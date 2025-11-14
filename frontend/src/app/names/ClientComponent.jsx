"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, X, Loader2, Heart, Sparkles, BookOpen, Star, Users, Globe, ChevronRight, Zap, Gem, Palette, Tag } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api';

export default function BabyNamesClient({ initialData, initialReligion = 'islamic' }) {
  const router = useRouter();
  const [religion, setReligion] = useState(initialReligion);
  const [filters, setFilters] = useState(initialData?.filters || null);
  const [names, setNames] = useState(initialData?.names || []);
  const [pagination, setPagination] = useState(initialData?.pagination || null);
  const [loading, setLoading] = useState(false);
  const [filtersLoading, setFiltersLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState(new Set());

  const [selectedFilters, setSelectedFilters] = useState({
    origin: '',
    language: '',
    category: '',
    theme: '',
    luckyDay: '',
    luckyColor: '',
    alphabet: '',
    luckyStone: '',
    gender: '',
  });

  const [currentPage, setCurrentPage] = useState(1);

  const deduplicateAndClean = useCallback((items) => {
    if (!items) return [];
    const seen = new Set();
    return items
      .map(item => item.replace(/\s*\([^)]*\)/g, "").trim())
      .filter(item => {
        const lower = item.toLowerCase();
        if (!lower || seen.has(lower)) return false;
        seen.add(lower);
        return true;
      })
      .sort();
  }, []);

  const fetchFilters = useCallback(async () => {
    setFiltersLoading(true);
    try {
      const res = await fetch(`${API_BASE}/filters?religion=${religion}`);
      const data = await res.json();
      if (data.success) {
        setFilters({
          origins: deduplicateAndClean(data.filters.origins),
          languages: deduplicateAndClean(data.filters.languages),
          categories: deduplicateAndClean(data.filters.categories),
          themes: deduplicateAndClean(data.filters.themes),
          lucky_days: deduplicateAndClean(data.filters.lucky_days),
          lucky_colors: deduplicateAndClean(data.filters.lucky_colors),
          lucky_stones: deduplicateAndClean(data.filters.lucky_stones),
          genders: deduplicateAndClean(data.filters.genders)
        });
      }
    } catch (error) {
      console.error('Error fetching filters:', error);
    }
    setFiltersLoading(false);
  }, [religion, deduplicateAndClean]);

  const fetchNames = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        religion,
        page: page.toString(),
        limit: '20'
      });

      Object.entries(selectedFilters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const res = await fetch(`${API_BASE}/names?${params}`);
      const data = await res.json();
      
      if (data.success) {
        setNames(data.data.names);
        setPagination(data.data.pagination);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Error fetching names:', error);
    }
    setLoading(false);
  }, [religion, selectedFilters]);

  const handleFilterChange = useCallback((filterType, value) => {
    const newFilters = { ...selectedFilters, [filterType]: value };
    setSelectedFilters(newFilters);
    setCurrentPage(1);
  }, [selectedFilters]);

  useEffect(() => {
    fetchNames(currentPage);
  }, [selectedFilters, religion, currentPage]);

  const handleReligionChange = useCallback((newReligion) => {
    setReligion(newReligion);
    const emptyFilters = {
      origin: '', language: '', category: '', theme: '',
      luckyDay: '', luckyColor: '', alphabet: '', luckyStone: '', gender: ''
    };
    setSelectedFilters(emptyFilters);
    setCurrentPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    const emptyFilters = {
      origin: '', language: '', category: '', theme: '',
      luckyDay: '', luckyColor: '', alphabet: '', luckyStone: '', gender: ''
    };
    setSelectedFilters(emptyFilters);
    setCurrentPage(1);
  }, []);

  const handleNameClick = useCallback((name) => {
    const slug = name.name.toLowerCase().replace(/\s+/g, '-');
    router.push(`/names/${religion}/${slug}`);
  }, [router, religion]);

  const toggleFavorite = useCallback((nameId, e) => {
    if (e) {
      e.stopPropagation();
    }
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(nameId)) {
        newFavorites.delete(nameId);
      } else {
        newFavorites.add(nameId);
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('favorites', JSON.stringify([...newFavorites]));
      }
      return newFavorites;
    });
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('favorites');
      if (saved) {
        setFavorites(new Set(JSON.parse(saved)));
      }
    }
  }, []);

  useEffect(() => {
    fetchFilters();
  }, [fetchFilters]);

  const activeFiltersCount = useMemo(() => 
    Object.values(selectedFilters).filter(v => v).length, 
    [selectedFilters]
  );

  const LoadingSkeleton = () => (
    <div className="space-y-2">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="bg-white rounded-lg border border-gray-100 p-3 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-1.5"></div>
          <div className="h-3 bg-gray-100 rounded w-full mb-1"></div>
          <div className="h-3 bg-gray-100 rounded w-4/5"></div>
        </div>
      ))}
    </div>
  );

  const FilterButton = ({ label, value, options, onChange, icon: Icon, color = "indigo" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const colorClasses = {
      indigo: "bg-indigo-50 border-indigo-200 text-indigo-700",
      purple: "bg-purple-50 border-purple-200 text-purple-700",
      blue: "bg-blue-50 border-blue-200 text-blue-700",
      pink: "bg-pink-50 border-pink-200 text-pink-700",
      emerald: "bg-emerald-50 border-emerald-200 text-emerald-700",
      orange: "bg-orange-50 border-orange-200 text-orange-700"
    };

    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between gap-1.5 px-3 py-2 rounded-lg border transition-all text-xs ${
            value 
              ? colorClasses[color] + " shadow-sm" 
              : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
          }`}
        >
          <div className="flex items-center gap-1.5 min-w-0">
            {Icon && <Icon className="w-3.5 h-3.5 flex-shrink-0" />}
            <span className="font-semibold truncate">
              {value || label}
            </span>
          </div>
          {value ? (
            <X 
              className="w-3.5 h-3.5 flex-shrink-0" 
              onClick={(e) => {
                e.stopPropagation();
                onChange('');
              }}
            />
          ) : (
            <ChevronRight className={`w-3.5 h-3.5 flex-shrink-0 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
          )}
        </button>

        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-white rounded-lg shadow-xl border border-gray-200 max-h-48 overflow-y-auto">
              <div className="p-1">
                <button
                  onClick={() => {
                    onChange('');
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 rounded transition-colors"
                >
                  All {label}
                </button>
                {options?.map(opt => (
                  <button
                    key={opt}
                    onClick={() => {
                      onChange(opt);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-medium rounded transition-colors ${
                      value === opt 
                        ? colorClasses[color]
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3">
          {/* Logo */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-sm">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Baby Names
                </h1>
              </div>
            </div>
            
            {pagination && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 rounded-full border border-indigo-100">
                <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                <span className="text-xs font-bold text-indigo-700">{pagination.totalResults.toLocaleString()}</span>
              </div>
            )}
          </div>

          {/* Religion Tabs */}
          <nav className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5">
            {[
              { value: 'islamic', icon: Star, label: 'Islamic' },
              { value: 'christian', icon: Globe, label: 'Christian' },
              { value: 'hindu', icon: Users, label: 'Hindu' }
            ].map(({ value, icon: Icon, label }) => (
              <button
                key={value}
                onClick={() => handleReligionChange(value)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-semibold text-xs whitespace-nowrap transition-all ${
                  religion === value
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-4">
        {/* Mobile Filters Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden w-full flex items-center justify-between px-4 py-3 bg-white rounded-lg shadow-sm border border-gray-100 mb-4"
        >
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-semibold">Filters</span>
            {activeFiltersCount > 0 && (
              <span className="px-2 py-0.5 bg-indigo-600 text-white rounded-full text-[10px] font-bold">
                {activeFiltersCount}
              </span>
            )}
          </div>
          <ChevronRight className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-90' : ''}`} />
        </button>

        <div className="flex flex-col lg:flex-row gap-4">
          {/* Filters Sidebar */}
          <aside className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-72`}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sticky top-24 overflow-visible">
              <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-indigo-600" />
                  <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Quick Filters</h2>
                </div>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs text-red-600 font-semibold bg-red-50 rounded-md hover:bg-red-100 transition-colors"
                  >
                    <X className="w-3 h-3" />
                    Clear
                  </button>
                )}
              </div>

              {filtersLoading ? (
                <div className="flex flex-col items-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-indigo-600 mb-2" />
                  <p className="text-xs text-gray-500">Loading filters...</p>
                </div>
              ) : (
                <div className="space-y-3 overflow-y-visible pr-1">
                  <FilterButton 
                    label="Gender" 
                    value={selectedFilters.gender} 
                    options={filters?.genders} 
                    onChange={(v) => handleFilterChange('gender', v)} 
                    icon={Users}
                    color="indigo"
                  />
                  <FilterButton 
                    label="Letter" 
                    value={selectedFilters.alphabet} 
                    options={['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']} 
                    onChange={(v) => handleFilterChange('alphabet', v)} 
                    icon={Search}
                    color="purple"
                  />
                  <FilterButton 
                    label="Origin" 
                    value={selectedFilters.origin} 
                    options={filters?.origins} 
                    onChange={(v) => handleFilterChange('origin', v)} 
                    icon={Globe}
                    color="blue"
                  />
                  <FilterButton 
                    label="Language" 
                    value={selectedFilters.language} 
                    options={filters?.languages} 
                    onChange={(v) => handleFilterChange('language', v)} 
                    icon={BookOpen}
                    color="emerald"
                  />
                  <FilterButton 
                    label="Category" 
                    value={selectedFilters.category} 
                    options={filters?.categories} 
                    onChange={(v) => handleFilterChange('category', v)}
                    icon={Tag}
                    color="pink"
                  />
                  <FilterButton 
                    label="Theme" 
                    value={selectedFilters.theme} 
                    options={filters?.themes} 
                    onChange={(v) => handleFilterChange('theme', v)}
                    icon={Palette}
                    color="orange"
                  />
                  <FilterButton 
                    label="Lucky Day" 
                    value={selectedFilters.luckyDay} 
                    options={filters?.lucky_days} 
                    onChange={(v) => handleFilterChange('luckyDay', v)} 
                    icon={Star}
                    color="indigo"
                  />
                  <FilterButton 
                    label="Lucky Color" 
                    value={selectedFilters.luckyColor} 
                    options={filters?.lucky_colors} 
                    onChange={(v) => handleFilterChange('luckyColor', v)} 
                    icon={Sparkles}
                    color="purple"
                  />
                  <FilterButton 
                    label="Lucky Stone" 
                    value={selectedFilters.luckyStone} 
                    options={filters?.lucky_stones} 
                    onChange={(v) => handleFilterChange('luckyStone', v)}
                    icon={Gem}
                    color="blue"
                  />
                </div>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 space-y-4">
            {/* Results Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wide mb-1">
                {religion.charAt(0).toUpperCase() + religion.slice(1)} Names
              </h2>
              {pagination && (
                <p className="text-xs text-gray-600">
                  Showing <strong>{names.length}</strong> of <strong>{pagination.totalResults.toLocaleString()}</strong> names
                </p>
              )}
            </div>

            {/* Names Grid */}
            {loading ? (
              <LoadingSkeleton />
            ) : names.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-sm font-bold mb-2 text-gray-700">No names found</h3>
                <p className="text-xs text-gray-500 mb-4">Try adjusting your filters</p>
                <button onClick={clearFilters} className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-sm">
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {names.map((name) => (
                    <article 
                      key={name._id} 
                      onClick={() => handleNameClick(name)}
                      className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-gray-900 mb-1 truncate group-hover:text-indigo-600 transition-colors">{name.name}</h3>
                          <p className="text-sm font-semibold text-indigo-600 mb-1.5 line-clamp-1">{name.short_meaning}</p>
                          <p className="text-xs text-gray-500">
                            <span className="font-medium">{name.gender}</span> • <span>{name.origin}</span>
                          </p>
                        </div>
                        <button 
                          onClick={(e) => toggleFavorite(name._id, e)} 
                          className="p-1.5 rounded-full hover:bg-red-50 flex-shrink-0 transition-colors"
                        >
                          <Heart className={`w-5 h-5 ${favorites.has(name._id) ? 'fill-red-500 text-red-500' : 'text-gray-300'}`} />
                        </button>
                      </div>

                      <p className="text-xs text-gray-700 leading-relaxed mb-3 line-clamp-2">{name.long_meaning}</p>

                      {name.themes && name.themes.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {name.themes.slice(0, 3).map((theme, idx) => (
                            <span key={idx} className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-md text-[10px] font-semibold border border-indigo-100">
                              {theme}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-50">
                        {name.lucky_day && (
                          <div className="flex items-center gap-1.5">
                            <Star className="w-3.5 h-3.5 text-yellow-500 flex-shrink-0" />
                            <span className="text-[10px] font-semibold text-gray-700 truncate">{name.lucky_day}</span>
                          </div>
                        )}
                        {name.lucky_stone && (
                          <div className="flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-purple-500 flex-shrink-0" />
                            <span className="text-[10px] font-semibold text-gray-700 truncate">{name.lucky_stone}</span>
                          </div>
                        )}
                      </div>
                    </article>
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
                    <button
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold disabled:opacity-40 hover:bg-gray-50 transition-colors shadow-sm"
                    >
                      First
                    </button>
                    
                    <button
                      onClick={() => setCurrentPage(prev => prev - 1)}
                      disabled={!pagination.hasPrevPage}
                      className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold disabled:opacity-40 hover:bg-gray-50 transition-colors shadow-sm"
                    >
                      ← Prev
                    </button>
                    
                    <div className="flex items-center gap-1.5">
                      {(() => {
                        const totalPages = pagination.totalPages;
                        const current = currentPage;
                        let pages = [];
                        
                        if (totalPages <= 7) {
                          pages = Array.from({ length: totalPages }, (_, i) => i + 1);
                        } else {
                          if (current <= 4) {
                            pages = [1, 2, 3, 4, 5, '...', totalPages];
                          } else if (current >= totalPages - 3) {
                            pages = [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
                          } else {
                            pages = [1, '...', current - 1, current, current + 1, '...', totalPages];
                          }
                        }
                        
                        return pages.map((pageNum, idx) => {
                          if (pageNum === '...') {
                            return (
                              <span key={`ellipsis-${idx}`} className="px-2 text-xs text-gray-400 font-bold">
                                ...
                              </span>
                            );
                          }
                          
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`w-9 h-9 rounded-lg text-xs font-bold transition-all ${
                                currentPage === pageNum
                                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md scale-110'
                                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        });
                      })()}
                    </div>

                    <button
                      onClick={() => setCurrentPage(prev => prev + 1)}
                      disabled={!pagination.hasNextPage}
                      className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold disabled:opacity-40 hover:bg-gray-50 transition-colors shadow-sm"
                    >
                      Next →
                    </button>
                    
                    <button
                      onClick={() => setCurrentPage(pagination.totalPages)}
                      disabled={currentPage === pagination.totalPages}
                      className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold disabled:opacity-40 hover:bg-gray-50 transition-colors shadow-sm"
                    >
                      Last
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}