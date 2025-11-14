'use client';
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search, Grid, List, ChevronLeft, ChevronRight, Star, Heart, User, Globe, Sparkles, BookOpen, Menu, X, ArrowUp
} from 'lucide-react';

export default function NamesDatabaseClient({
  initialNames = [],
  initialTotal = 0,
  initialReligion = "islamic",
  initialLetter = "A",
  initialPage = 1,
  perPageDefault = 20,
  initialSort = "popularity"
}) {
  const router = useRouter();
  const [selectedReligion, setSelectedReligion] = useState(initialReligion);
  const [selectedLetter, setSelectedLetter] = useState(initialLetter);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [perPage, setPerPage] = useState(perPageDefault);
  const [sortBy, setSortBy] = useState(initialSort);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const names = initialNames;
  const totalResults = initialTotal;

  const religions = useMemo(() => [
    { value: 'islamic', label: 'Islamic', icon: '☪️', description: 'Beautiful Islamic names with meanings' },
    { value: 'hindu', label: 'Hindu', icon: '🕉️', description: 'Traditional Hindu names with meanings' },
    { value: 'christian', label: 'Christian', icon: '✝️', description: 'Christian baby names with meanings' }
  ], []);

  const alphabet = useMemo(() => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''), []);

  const sortOptions = useMemo(() => [
    { value: 'popularity', label: 'Popularity', description: 'Most popular names first' },
    { value: 'alphabetical', label: 'A-Z', description: 'Alphabetical order' },
    { value: 'length', label: 'Length', description: 'By name length' }
  ], []);

  // Scroll to top
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ✅ FIXED: Navigate to new URL when filters change
  const handleReligionChange = useCallback((religion) => {
    const url = `/names/${religion}/letter/${selectedLetter.toLowerCase()}?page=1&perPage=${perPage}&sort=${sortBy}`;
    router.push(url);
  }, [selectedLetter, perPage, sortBy, router]);

  const handleLetterChange = useCallback((letter) => {
    const url = `/names/${selectedReligion}/letter/${letter.toLowerCase()}?page=1&perPage=${perPage}&sort=${sortBy}`;
    router.push(url);
  }, [selectedReligion, perPage, sortBy, router]);

  const handleSortChange = useCallback((val) => {
    const url = `/names/${selectedReligion}/letter/${selectedLetter.toLowerCase()}?page=1&perPage=${perPage}&sort=${val}`;
    router.push(url);
  }, [selectedReligion, selectedLetter, perPage, router]);

  const handlePerPageChange = useCallback((val) => {
    const url = `/names/${selectedReligion}/letter/${selectedLetter.toLowerCase()}?page=1&perPage=${val}&sort=${sortBy}`;
    router.push(url);
  }, [selectedReligion, selectedLetter, sortBy, router]);

  const handlePageChange = useCallback((number) => {
    const url = `/names/${selectedReligion}/letter/${selectedLetter.toLowerCase()}?page=${number}&perPage=${perPage}&sort=${sortBy}`;
    router.push(url);
  }, [selectedReligion, selectedLetter, perPage, sortBy, router]);

  const handleViewMode = useCallback((mode) => {
    setViewMode(mode);
  }, []);

  // Filter locally for search box ONLY
  const filteredNames = useMemo(() => {
    if (!searchTerm.trim()) return names;
    const term = searchTerm.toLowerCase().trim();
    return names.filter(name =>
      (name.name ?? '').toLowerCase().includes(term) ||
      (name.short_meaning ?? '').toLowerCase().includes(term) ||
      (name.origin ?? '').toLowerCase().includes(term)
    );
  }, [names, searchTerm]);

  const totalPages = useMemo(() => Math.ceil(totalResults / perPage), [totalResults, perPage]);

  const NameCard = React.memo(({ name, index }) => (
    <article
      className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 ring-1 ring-blue-100 border border-blue-50 transition-transform duration-300 p-5 flex flex-col h-full"
      itemScope
      itemType="https://schema.org/Person"
      role="article"
      aria-label={`${name.name} - ${name.short_meaning}`}
      tabIndex="0"
    >
      <header className="flex items-center gap-3 mb-3">
        <div
          className="w-11 h-11 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-extrabold text-lg shadow-lg"
          aria-hidden="true"
        >
          {name.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-blue-900 mb-0.5 group-hover:text-purple-600 truncate" itemProp="name">
            {name.name}
          </h3>
          <div className="flex flex-wrap items-center gap-2 mt-0.5">
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                name.gender === 'male' ? 'bg-blue-100 text-blue-700' :
                name.gender === 'female' ? 'bg-pink-100 text-pink-700' :
                'bg-purple-100 text-purple-700'
              }`}
              itemProp="gender"
            >
              <span aria-hidden="true">{name.gender === 'male' ? '♂' : name.gender === 'female' ? '♀' : '⚧'}</span>
              <span className="hidden sm:inline">{name.gender}</span>
            </span>
            <span className="px-2 py-1 bg-gray-50 text-gray-600 rounded-full text-xs font-semibold flex items-center gap-1" itemProp="nationality">
              <Globe className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
              <span className="truncate">{name.origin}</span>
            </span>
          </div>
        </div>
        <button
          className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity p-2 hover:bg-red-50 rounded-full flex-shrink-0"
          aria-label={`Add ${name.name} to favorites`}
          type="button"
        >
          <Heart className="w-5 h-5 text-gray-400 hover:text-red-500" />
        </button>
      </header>
      <div className="flex-1 flex items-center">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 w-full">
          <div className="flex items-center mb-1.5 gap-2">
            <Sparkles className="w-4 h-4 text-blue-500" aria-hidden="true" />
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">Meaning</span>
          </div>
          <p className="text-gray-800 font-semibold text-sm" itemProp="description">
            {name.short_meaning}
          </p>
        </div>
      </div>
      <footer className="flex items-center justify-between mt-6 pt-3 border-t border-blue-50">
        <div className="flex items-center gap-0.5" role="img" aria-label="4 out of 5 stars">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
              aria-hidden="true"
            />
          ))}
          <span className="text-xs text-blue-600 ml-2 font-bold">4.0</span>
        </div>
        <button
          className="px-4 py-2 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-md text-xs focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label={`View details for ${name.name}`}
          type="button"
        >
          Details
        </button>
      </footer>
    </article>
  ));

  const ListNameItem = React.memo(({ name }) => (
    <article
      className="bg-white rounded-xl shadow transition-all duration-200 p-4 border border-blue-50 hover:border-blue-300 flex items-center justify-between gap-4"
      itemScope
      itemType="https://schema.org/Person"
      role="article"
      aria-label={`${name.name} - ${name.short_meaning}`}
    >
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <div
          className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-extrabold text-base"
          aria-hidden="true"
        >
          {name.name.charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-blue-900 text-lg truncate" itemProp="name">
            {name.name}
          </h3>
          <p className="text-gray-700 text-sm truncate" itemProp="description">
            {name.short_meaning}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                name.gender === 'male' ? 'bg-blue-100 text-blue-700' :
                name.gender === 'female' ? 'bg-pink-100 text-pink-700' :
                'bg-purple-100 text-purple-700'
              }`}
              itemProp="gender"
            >
              {name.gender}
            </span>
            <span className="text-xs text-gray-500 truncate" itemProp="nationality">
              {name.origin}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          className="p-2 hover:bg-red-50 rounded-full transition-colors"
          aria-label={`Add ${name.name} to favorites`}
          type="button"
        >
          <Heart className="w-4 h-4 text-gray-400 hover:text-red-500" />
        </button>
        <button
          className="px-3 py-1.5 bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-md text-sm hover:bg-blue-600 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label={`View details for ${name.name}`}
          type="button"
        >
          Details
        </button>
      </div>
    </article>
  ));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 px-1">
      {/* Header */}
      <header className="bg-white drop-shadow-lg border-b border-blue-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 xl:px-8 py-3 md:py-6 flex flex-col gap-2 md:gap-0 md:flex-row items-start md:items-center justify-between">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
              <BookOpen className="w-6 h-6 md:w-7 md:h-7 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
                Names Database
              </h1>
              <p className="text-gray-600 text-base hidden md:block">
                {totalResults.toLocaleString()} names — meanings & origins
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="search"
                placeholder="Search names..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-xl border border-blue-200 bg-blue-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 text-base"
                aria-label="Search names and meanings"
              />
            </div>
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="md:hidden p-2 bg-blue-500 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
              aria-label="Toggle filters menu"
              aria-expanded={showMobileFilters}
              type="button"
            >
              {showMobileFilters ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Search */}
      <div className="md:hidden mt-4 px-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="search"
            placeholder="Search names..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-blue-200 bg-blue-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
            aria-label="Search names and meanings"
          />
        </div>
      </div>

      {/* Filters bar */}
      <section className="mx-auto max-w-7xl my-7 relative">
        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl p-5 border border-blue-100 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          {/* Filters */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-blue-900 text-sm">Religion</label>
              <div className="flex gap-2 flex-wrap">
                {religions.map((religion) => (
                  <button
                    key={religion.value}
                    onClick={() => handleReligionChange(religion.value)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all
                      ${selectedReligion === religion.value
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-700'
                      }
                    `}
                    aria-label={`Select ${religion.label} names`}
                    aria-pressed={selectedReligion === religion.value}
                    type="button"
                  >
                    <span className="text-lg" role="img" aria-label={religion.label}>{religion.icon}</span>
                    {religion.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-blue-900 text-sm">Letter</label>
              <div className="flex gap-1 flex-wrap">
                {alphabet.map((letter) => (
                  <button
                    key={letter}
                    onClick={() => handleLetterChange(letter)}
                    className={`w-9 h-9 rounded-md font-bold
                      ${selectedLetter === letter
                        ? 'bg-purple-500 text-white scale-110 shadow'
                        : 'bg-gray-100 text-gray-700 hover:bg-purple-100'
                      } transition-all`}
                    aria-label={`Names starting with ${letter}`}
                    aria-pressed={selectedLetter === letter}
                    type="button"
                  >
                    {letter}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-blue-900 text-sm">Sort</label>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="rounded-lg p-2 border border-blue-200 text-sm focus:ring-2 focus:ring-blue-500"
                aria-label="Sort names by"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* View Toggle */}
          <div className="flex gap-3 items-center mt-3 md:mt-0">
            <span className="text-blue-900 font-semibold text-sm">View:</span>
            <button
              onClick={() => handleViewMode('grid')}
              className={`p-2 rounded-xl ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              aria-label="Grid view"
              aria-pressed={viewMode === 'grid'}
              type="button"
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleViewMode('list')}
              className={`p-2 rounded-xl ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              aria-label="List view"
              aria-pressed={viewMode === 'list'}
              type="button"
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Content/results area */}
      <main className="max-w-7xl mx-auto px-2 sm:px-6">
        {/* Results Info */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-2">
          <div className="text-blue-900 font-semibold">
            Showing <span className="text-purple-600">{filteredNames.length.toLocaleString()}</span> names
            {searchTerm && ' matching'} for <span className="uppercase tracking-wide text-blue-500">{selectedLetter}</span>
            <span className="ml-2 capitalize font-semibold">{selectedReligion}</span>
          </div>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-sm text-blue-600 hover:text-blue-800 underline focus:ring-2 focus:ring-blue-500 rounded px-2"
              type="button"
            >
              Clear search
            </button>
          )}
        </div>
        {/* Main List/Grid */}
        {viewMode === 'grid' ? (
          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 mb-10">
            {filteredNames.map((name, index) => (
              <NameCard key={name._id || name.name + index} name={name} index={index} />
            ))}
          </section>
        ) : (
          <section className="space-y-3 mb-10">
            {filteredNames.map((name) => (
              <ListNameItem key={name._id || name.name} name={name} />
            ))}
          </section>
        )}
        {/* Pagination */}
        {totalPages > 1 && (
          <nav className="flex items-center justify-center space-x-1 mt-2" aria-label="Pagination navigation" role="navigation">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-blue-200 hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous page"
              type="button"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              let pageNumber = Math.max(1, Math.min(currentPage - 2 + i, totalPages - 4 + i));
              pageNumber = Math.max(1, Math.min(pageNumber, totalPages));
              return (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`px-3 py-2 rounded-lg font-medium ${currentPage === pageNumber ? 'bg-blue-500 text-white' : 'border border-blue-200 hover:bg-blue-50'}`}
                  aria-label={`Go to page ${pageNumber}`}
                  aria-current={currentPage === pageNumber ? 'page' : undefined}
                  type="button"
                >
                  {pageNumber}
                </button>
              );
            })}
            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-blue-200 hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next page"
              type="button"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </nav>
        )}
        {filteredNames.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-200 via-white to-purple-200 rounded-full flex items-center justify-center mb-4">
              <User className="w-10 h-10 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-blue-800 mb-2">No names found</h3>
            <p className="text-blue-500 text-base">
              {searchTerm ? 'Try changing your search term' : 'Try selecting a different letter or religion'}
            </p>
          </div>
        )}
      </main>
      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 bg-blue-500 text-white rounded-full shadow-xl hover:bg-blue-600 transition-all transform hover:scale-110 focus:ring-2 focus:ring-blue-500 z-50"
          aria-label="Scroll to top"
          type="button"
        >
          <ArrowUp className="w-7 h-7" />
        </button>
      )}
    </div>
  );
}