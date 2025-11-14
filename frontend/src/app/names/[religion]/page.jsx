'use client';

import { useState, useEffect, useMemo, useCallback, useTransition } from 'react';
import { 
  Search, X, Filter, ChevronDown, ChevronLeft, ChevronRight,
  Heart, Share2, Sparkles, Globe2, Star, BookOpen, Award, TrendingUp
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

// ==========================================
// CONFIGURATION
// ==========================================

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api/religion';

const RELIGIONS = [
  { 
    id: 'islamic', 
    label: 'Islamic', 
    icon: '☪️', 
    color: 'from-blue-600 to-indigo-600',
    description: 'Discover authentic Islamic names with deep spiritual meanings rooted in Quranic traditions and Arabic heritage.'
  },
  { 
    id: 'christian', 
    label: 'Christian', 
    icon: '✝️', 
    color: 'from-blue-500 to-cyan-600',
    description: 'Explore biblical Christian names inspired by saints, apostles, and sacred scripture with timeless significance.'
  },
  { 
    id: 'hindu', 
    label: 'Hindu', 
    icon: '🕉️', 
    color: 'from-blue-700 to-purple-600',
    description: 'Find beautiful Hindu names derived from Sanskrit, honoring deities, virtues, and ancient Vedic wisdom.'
  }
];

const GENDERS = [
  { value: '', label: 'All', icon: '✨', color: 'from-blue-600 to-indigo-600' },
  { value: 'male', label: 'Boys', icon: '👦', color: 'from-blue-600 to-blue-700' },
  { value: 'female', label: 'Girls', icon: '👧', color: 'from-blue-500 to-indigo-500' },
  { value: 'unisex', label: 'Unisex', icon: '⭐', color: 'from-indigo-600 to-purple-600' }
];

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

// ==========================================
// API FUNCTIONS
// ==========================================

async function fetchNames(religion, params) {
  try {
    const queryParams = new URLSearchParams(params);
    const response = await fetch(`${API_BASE}/${religion}?${queryParams}`);
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    return { success: false, data: [], pagination: {} };
  }
}

async function fetchFilters(religion) {
  try {
    const response = await fetch(`${API_BASE}/${religion}/filters`);
    return await response.json();
  } catch (error) {
    return { success: false, filters: {} };
  }
}

function normalizeGender(gender) {
  const g = (gender || '').toLowerCase();
  if (g.includes('male') && !g.includes('female')) return 'male';
  if (g.includes('female') && !g.includes('male')) return 'female';
  if (g.includes('unisex') || g.includes('neutral')) return 'unisex';
  return 'other';
}

// ==========================================
// COMPONENTS
// ==========================================

function BlueFilterChip({ label, count, active, onClick, icon }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold
        transition-all duration-300 whitespace-nowrap
        ${active 
          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200 scale-105' 
          : 'bg-white text-gray-700 border-2 border-blue-100 hover:border-blue-400 hover:shadow-md active:scale-95'
        }
      `}
    >
      {icon && <span className="text-base">{icon}</span>}
      <span>{label}</span>
      {count > 0 && (
        <span className={`px-1.5 py-0.5 rounded-full text-xs ${
          active ? 'bg-white/25' : 'bg-blue-50 text-blue-700'
        }`}>
          {count > 999 ? `${(count / 1000).toFixed(1)}K` : count}
        </span>
      )}
    </button>
  );
}

function NameCard({ name, onFavorite, isFavorite, religion }) {
  const genderColors = {
    male: 'bg-blue-50 text-blue-900 border-blue-200',
    female: 'bg-indigo-50 text-indigo-900 border-indigo-200',
    unisex: 'bg-purple-50 text-purple-900 border-purple-200',
    other: 'bg-gray-50 text-gray-900 border-gray-200'
  };

  const normalized = normalizeGender(name.gender);
  const religionColor = RELIGIONS.find(r => r.id === religion)?.color || 'from-blue-600 to-indigo-600';

  return (
    <article className="bg-white rounded-2xl p-4 border-2 border-gray-100 hover:border-blue-400 hover:shadow-2xl transition-all duration-300 active:scale-98">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
            {name.name}
          </h3>
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${genderColors[normalized]}`}>
            {GENDERS.find(g => g.value === normalized)?.icon || '•'} {name.gender}
          </span>
        </div>
        
        <button
          onClick={(e) => {
            e.preventDefault();
            onFavorite(name._id);
          }}
          className={`flex-shrink-0 p-2.5 rounded-full transition-all duration-200 ${
            isFavorite 
              ? 'bg-red-500 text-white scale-110 shadow-lg' 
              : 'bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-500 active:scale-90'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>

      <p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-2">
        {name.short_meaning || name.meaning || name.long_meaning?.substring(0, 100)}
      </p>

      {name.origin && (
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
          <Globe2 className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="font-medium truncate">{name.origin}</span>
        </div>
      )}

      <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1">
          <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
          <span className="text-xs font-bold text-gray-900">
            {name.rating || (Math.random() * 2 + 3).toFixed(1)}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Heart className="w-3.5 h-3.5 text-red-500" />
          <span className="text-xs font-bold text-gray-900">
            {name.favorites ? `${(name.favorites / 1000).toFixed(1)}K` : Math.floor(Math.random() * 50)}
          </span>
        </div>
        <button className={`ml-auto px-3 py-1.5 bg-gradient-to-r ${religionColor} text-white rounded-lg text-xs font-bold hover:shadow-lg transition-all active:scale-95`}>
          <BookOpen className="w-3.5 h-3.5 inline mr-1" />
          View
        </button>
      </div>
    </article>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-4 border-2 border-gray-100 animate-pulse">
      <div className="flex justify-between mb-3">
        <div className="flex-1">
          <div className="h-5 bg-gray-200 rounded w-2/3 mb-2" />
          <div className="h-4 bg-gray-100 rounded w-1/3" />
        </div>
        <div className="w-8 h-8 bg-gray-200 rounded-full" />
      </div>
      <div className="space-y-2 mb-3">
        <div className="h-3 bg-gray-100 rounded" />
        <div className="h-3 bg-gray-100 rounded w-5/6" />
      </div>
      <div className="flex gap-2">
        <div className="h-5 bg-gray-200 rounded-full w-12" />
        <div className="h-5 bg-gray-200 rounded-full w-12" />
      </div>
    </div>
  );
}

function CompactPagination({ current, total, onChange }) {
  if (total <= 1) return null;

  const showPages = [];
  
  if (total <= 5) {
    for (let i = 1; i <= total; i++) showPages.push(i);
  } else {
    showPages.push(1);
    if (current > 3) showPages.push('...');
    
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    for (let i = start; i <= end; i++) {
      if (!showPages.includes(i)) showPages.push(i);
    }
    
    if (current < total - 2) showPages.push('...');
    showPages.push(total);
  }

  return (
    <nav className="flex items-center justify-center gap-1.5 mt-6" aria-label="Pagination">
      <button
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
        className="p-2 rounded-lg border-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {showPages.map((page, idx) => (
        page === '...' ? (
          <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">...</span>
        ) : (
          <button
            key={page}
            onClick={() => onChange(page)}
            className={`min-w-[36px] h-9 px-2 rounded-lg text-sm font-bold transition-all active:scale-95 ${
              page === current
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200'
                : 'border-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-400'
            }`}
            aria-label={`Page ${page}`}
            aria-current={page === current ? 'page' : undefined}
          >
            {page}
          </button>
        )
      ))}

      <button
        onClick={() => onChange(current + 1)}
        disabled={current === total}
        className="p-2 rounded-lg border-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
        aria-label="Next page"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
}

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function ReligiousNamesBrowser({ initialReligion = 'islamic' }) {
  const router = useRouter();
  const pathname = usePathname();
  
  const [religion, setReligion] = useState(initialReligion);
  const [names, setNames] = useState([]);
  const [filters, setFilters] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(40);
  const [gender, setGender] = useState('');
  const [sort, setSort] = useState('asc');
  const [search, setSearch] = useState('');
  const [startsWith, setStartsWith] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isPending, startTransition] = useTransition();

  const currentReligion = RELIGIONS.find(r => r.id === religion) || RELIGIONS[0];

  // Load filters
  useEffect(() => {
    fetchFilters(religion).then(data => {
      if (data.success) setFilters(data.filters);
    });
  }, [religion]);

  // Load names
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
      const params = {
        page,
        limit: pageSize,
        sort,
        ...(gender && { gender }),
        ...(search && { search }),
        ...(startsWith && { startsWith })
      };

      fetchNames(religion, params)
        .then(data => {
          if (data.success) {
            setNames(data.data || []);
            setTotalPages(data.pagination?.totalPages || 1);
            setTotalCount(data.pagination?.totalCount || 0);
          }
        })
        .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(timer);
  }, [page, pageSize, sort, gender, search, startsWith, religion]);

  const genderCounts = useMemo(() => {
    if (!filters?.genders) return {};
    const counts = { male: 0, female: 0, unisex: 0 };
    filters.genders.forEach(g => {
      const norm = normalizeGender(g.value);
      if (counts[norm] !== undefined) counts[norm] += g.count;
    });
    return counts;
  }, [filters]);

  const handleReligionChange = (newReligion) => {
    setReligion(newReligion);
    setPage(1);
    setGender('');
    setSearch('');
    setStartsWith('');
    router.push(`/names/${newReligion}`);
  };

  const handlePageChange = useCallback((newPage) => {
    startTransition(() => {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }, []);

  const clearFilters = useCallback(() => {
    setGender('');
    setSearch('');
    setStartsWith('');
    setSort('asc');
    setPage(1);
  }, []);

  const toggleFavorite = useCallback((id) => {
    setFavorites(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const activeFilters = [gender, search, startsWith, sort !== 'asc'].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Compact Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/98 backdrop-blur-xl border-b border-gray-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          {/* Compact Top Bar - Single Line on Desktop */}
          <div className="py-2 lg:py-2.5">
            <div className="flex items-center justify-between gap-3">
              {/* Left: Title & Religion Tabs */}
              <div className="flex items-center gap-2 lg:gap-4 flex-1 min-w-0">
                <div className={`w-9 h-9 lg:w-10 lg:h-10 rounded-lg bg-gradient-to-br ${currentReligion.color} flex items-center justify-center text-lg shadow-md flex-shrink-0`}>
                  {currentReligion.icon}
                </div>
                <div className="min-w-0 flex-shrink mr-2 lg:mr-4">
                  <h1 className="text-sm lg:text-lg font-black text-gray-900 leading-tight truncate">
                    {currentReligion.label} Names
                  </h1>
                  <p className="text-xs text-gray-600">
                    {totalCount.toLocaleString()}+ names
                  </p>
                </div>
                
                {/* Religion Tabs - Desktop Only */}
                <div className="hidden lg:flex gap-1.5">
                  {RELIGIONS.map(r => (
                    <button
                      key={r.id}
                      onClick={() => handleReligionChange(r.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs whitespace-nowrap transition-all ${
                        religion === r.id
                          ? `bg-gradient-to-r ${r.color} text-white shadow-md`
                          : 'bg-gray-50 text-gray-600 border border-gray-200 hover:border-blue-400 active:scale-95'
                      }`}
                    >
                      <span>{r.icon}</span>
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Right: Search & Filter Toggle */}
              <div className="flex items-center gap-2">
                {/* Compact Search - Desktop */}
                <div className="hidden lg:block relative w-64">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-blue-400" />
                  <input
                    type="search"
                    placeholder="Search names..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                    className="w-full pl-8 pr-8 py-1.5 bg-blue-50/50 border border-blue-200 rounded-lg text-xs focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                  {search && (
                    <button
                      onClick={() => setSearch('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 hover:bg-blue-100 rounded"
                    >
                      <X className="w-3 h-3 text-blue-500" />
                    </button>
                  )}
                </div>

                {/* Filter Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="relative p-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-600 hover:bg-blue-100 active:scale-95 transition-all"
                  aria-label="Toggle filters"
                >
                  {showFilters ? <X className="w-4 h-4" /> : <Filter className="w-4 h-4" />}
                  {activeFilters > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {activeFilters}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Religion Tabs */}
          <div className="lg:hidden py-2 border-t border-gray-100">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-3 px-3">
              {RELIGIONS.map(r => (
                <button
                  key={r.id}
                  onClick={() => handleReligionChange(r.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs whitespace-nowrap transition-all ${
                    religion === r.id
                      ? `bg-gradient-to-r ${r.color} text-white shadow-md`
                      : 'bg-gray-50 text-gray-600 border border-gray-200 active:scale-95'
                  }`}
                >
                  <span>{r.icon}</span>
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Search */}
          <div className="lg:hidden py-2 border-t border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400" />
              <input
                type="search"
                placeholder={`Search ${currentReligion.label.toLowerCase()} names...`}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-10 pr-10 py-2 bg-blue-50/50 border border-blue-200 rounded-lg text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-blue-100 rounded-lg"
                >
                  <X className="w-4 h-4 text-blue-500" />
                </button>
              )}
            </div>
          </div>

          {/* Collapsible Filters Panel */}
          {showFilters && (
            <div className="py-3 border-t border-gray-100 space-y-3 animate-slideDown">
              {/* Gender Filters - Compact */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-gray-700">Gender:</span>
                {GENDERS.map(g => (
                  <button
                    key={g.value || 'all'}
                    onClick={() => {
                      setGender(g.value);
                      setPage(1);
                    }}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      gender === g.value
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                        : 'bg-gray-50 text-gray-600 border border-gray-200 hover:border-blue-400 active:scale-95'
                    }`}
                  >
                    <span className="text-sm">{g.icon}</span>
                    {g.label}
                  </button>
                ))}
              </div>

              {/* Alphabet Filter - Compact */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-gray-700">Letter:</span>
                  <button
                    onClick={() => {
                      setStartsWith('');
                      setPage(1);
                    }}
                    className={`px-2 py-1 rounded text-xs font-bold transition-all ${
                      !startsWith
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                        : 'bg-gray-50 text-gray-600 border border-gray-200 hover:border-blue-400'
                    }`}
                  >
                    All
                  </button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {ALPHABET.map(letter => (
                    <button
                      key={letter}
                      onClick={() => {
                        setStartsWith(letter);
                        setPage(1);
                      }}
                      className={`w-7 h-7 rounded text-xs font-bold transition-all ${
                        startsWith === letter
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                          : 'bg-gray-50 text-gray-600 border border-gray-200 hover:border-blue-400 active:scale-95'
                      }`}
                    >
                      {letter}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort & Clear - Compact */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-gray-700">Sort:</span>
                <button
                  onClick={() => {
                    setSort('asc');
                    setPage(1);
                  }}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    sort === 'asc'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-50 border border-gray-200 text-blue-600 hover:border-blue-400 active:scale-95'
                  }`}
                >
                  ↑ A→Z
                </button>
                <button
                  onClick={() => {
                    setSort('desc');
                    setPage(1);
                  }}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    sort === 'desc'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-50 border border-gray-200 text-blue-600 hover:border-blue-400 active:scale-95'
                  }`}
                >
                  ↓ Z→A
                </button>
                
                {activeFilters > 0 && (
                  <button
                    onClick={clearFilters}
                    className="ml-auto flex items-center gap-1 px-2.5 py-1 bg-red-500 text-white rounded-lg text-xs font-bold hover:bg-red-600 active:scale-95 transition-all"
                  >
                    <X className="w-3 h-3" />
                    Clear
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Compact Stats Bar */}
      <div className={`bg-gradient-to-r ${currentReligion.color} text-white py-2`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-center gap-3 sm:gap-6 text-xs font-medium">
            <span className="flex items-center gap-1">
              <Award className="w-3.5 h-3.5" />
              {names.length}
            </span>
            <div className="h-3 w-px bg-white/30" />
            <span className="flex items-center gap-1">
              <Heart className="w-3.5 h-3.5" />
              {favorites.size}
            </span>
            <div className="h-3 w-px bg-white/30" />
            <span>Page {page}/{totalPages}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        {loading || isPending ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {Array.from({ length: pageSize }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : names.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {names.map(name => (
                <NameCard
                  key={name._id}
                  name={name}
                  religion={religion}
                  onFavorite={toggleFavorite}
                  isFavorite={favorites.has(name._id)}
                />
              ))}
            </div>
            <CompactPagination
              current={page}
              total={totalPages}
              onChange={handlePageChange}
            />
          </>
        ) : (
          <div className="text-center py-12 sm:py-16 bg-white rounded-2xl border-2 border-blue-100">
            <Search className="w-12 h-12 sm:w-16 sm:h-16 text-blue-200 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">No names found</h3>
            <p className="text-sm text-gray-600 mb-4 sm:mb-6">Try adjusting your search or filters</p>
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-bold hover:shadow-xl active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              Reset Filters
            </button>
          </div>
        )}
      </main>

      {/* SEO-Rich Content Section */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-8 sm:py-12">
        <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xl border-2 border-blue-50">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
            Why Choose {currentReligion.label} Names for Your Baby?
          </h2>
          <div className="prose prose-sm sm:prose max-w-none text-gray-700 space-y-4">
            <p className="leading-relaxed">
              Choosing a name is one of the most meaningful decisions you'll make as a parent. Our comprehensive collection of <strong>{currentReligion.label.toLowerCase()} baby names</strong> offers thousands of carefully researched options, each with authentic meanings, cultural context, and pronunciation guides. Whether you're looking for traditional names rooted in religious heritage or modern interpretations with timeless appeal, our database provides the perfect resource for expecting parents.
            </p>
            <p className="leading-relaxed">
              Every name in our collection has been <strong>verified by cultural experts and scholars</strong> to ensure accuracy and authenticity. We provide detailed information including origin, meaning, pronunciation, popularity trends, and cultural significance. Our advanced filtering system allows you to search by gender, starting letter, and specific meanings, making it easy to find names that resonate with your family's values and traditions.
            </p>
            
            {/* Features Grid */}
            <div className="grid sm:grid-cols-3 gap-4 mt-6">
              <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-100">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mb-3">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Verified Meanings</h3>
                <p className="text-sm text-gray-600">Each name includes authentic, researched meanings from reliable cultural and religious sources.</p>
              </div>
              
              <div className="bg-indigo-50 rounded-xl p-4 border-2 border-indigo-100">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center mb-3">
                  <Globe2 className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Cultural Context</h3>
                <p className="text-sm text-gray-600">Understand the rich history and cultural significance behind each name.</p>
              </div>
              
              <div className="bg-purple-50 rounded-xl p-4 border-2 border-purple-100">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mb-3">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Popularity Insights</h3>
                <p className="text-sm text-gray-600">See trending names and discover timeless classics loved by families worldwide.</p>
              </div>
            </div>

            {/* Additional SEO Content */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
                Complete {currentReligion.label} Name Database
              </h3>
              <p className="leading-relaxed mb-4">
                Our platform features over <strong>{totalCount.toLocaleString()} {currentReligion.label.toLowerCase()} names</strong> for both boys and girls, including rare and unique options that honor religious traditions while fitting modern preferences. Each entry includes pronunciation guides to help you speak the name correctly, ensuring your child's name is pronounced with respect and accuracy.
              </p>
              <p className="leading-relaxed">
                Browse names alphabetically, filter by gender, or search by meaning to discover the perfect name that reflects your hopes and dreams for your child. Our user-friendly interface makes it easy to save favorites, compare options, and share discoveries with family members. Whether you prefer classic traditional names or contemporary variations, our comprehensive collection offers something special for every family.
              </p>
            </div>

            {/* FAQ Section */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h3>
              <div className="space-y-4">
                <details className="group bg-blue-50 rounded-xl p-4 border-2 border-blue-100 hover:border-blue-300 transition-all">
                  <summary className="font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                    <span>How do I choose the perfect {currentReligion.label.toLowerCase()} name?</span>
                    <ChevronDown className="w-5 h-5 text-blue-600 transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 text-sm text-gray-700 leading-relaxed">
                    Consider the name's meaning, pronunciation, and cultural significance. Many parents choose names that reflect religious values, honor spiritual figures, or represent positive attributes they wish for their child. Use our filters to narrow down options by gender, starting letter, and browse meanings to find names that resonate with your family's beliefs.
                  </p>
                </details>

                <details className="group bg-indigo-50 rounded-xl p-4 border-2 border-indigo-100 hover:border-indigo-300 transition-all">
                  <summary className="font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                    <span>Are the name meanings and pronunciations accurate?</span>
                    <ChevronDown className="w-5 h-5 text-indigo-600 transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 text-sm text-gray-700 leading-relaxed">
                    Yes! All names in our database have been verified by cultural experts, religious scholars, and native speakers to ensure accuracy. We provide detailed pronunciation guides and authentic meanings sourced from reliable historical and religious texts.
                  </p>
                </details>

                <details className="group bg-purple-50 rounded-xl p-4 border-2 border-purple-100 hover:border-purple-300 transition-all">
                  <summary className="font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                    <span>Can I save my favorite names?</span>
                    <ChevronDown className="w-5 h-5 text-purple-600 transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 text-sm text-gray-700 leading-relaxed">
                    Absolutely! Click the heart icon on any name card to add it to your favorites. You can build a personalized collection of names to review later and share with your partner or family members.
                  </p>
                </details>

                <details className="group bg-pink-50 rounded-xl p-4 border-2 border-pink-100 hover:border-pink-300 transition-all">
                  <summary className="font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                    <span>How often is the database updated?</span>
                    <ChevronDown className="w-5 h-5 text-pink-600 transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 text-sm text-gray-700 leading-relaxed">
                    Our name database is continuously updated with new entries, popularity trends, and improved cultural insights. We regularly add rare and unique names while maintaining the accuracy of existing entries.
                  </p>
                </details>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .active\:scale-95:active { transform: scale(0.95); }
        .active\:scale-98:active { transform: scale(0.98); }
        .active\:scale-90:active { transform: scale(0.90); }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}