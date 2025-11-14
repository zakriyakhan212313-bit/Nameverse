// src/app/names/NamesClient.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Moon,
  Sun,
  Heart,
  Sparkles,
  ChevronDown,
  X,
  SlidersHorizontal,
  TrendingUp,
  BookOpen,
} from 'lucide-react';

export default function NamesClient({ initialData, filterOptions, searchParams }) {
  const router = useRouter();
  const params = useSearchParams();
  const [names, setNames] = useState(initialData?.names || []);
  const [pagination, setPagination] = useState(initialData?.pagination || {});
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const [filters, setFilters] = useState({
    religion: searchParams.religion || 'islamic',
    gender: searchParams.gender || '',
    origin: searchParams.origin || '',
    alphabet: searchParams.alphabet || '',
    language: searchParams.language || '',
    category: searchParams.category || '',
    themes: searchParams.themes || '',
    lucky_number: searchParams.lucky_number || '',
    lucky_day: searchParams.lucky_day || '',
    lucky_color: searchParams.lucky_color || '',
    lucky_stone: searchParams.lucky_stone || '',
    search: searchParams.search || '',
    sort: searchParams.sort || 'popularity',
    page: searchParams.page || '1',
    limit: searchParams.limit || '20',
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      setDarkMode(savedTheme === 'dark');
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const updateURL = (newFilters) => {
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    router.push(`/names?${params.toString()}`, { scroll: false });
  };

  const handleFilterChange = async (key, value) => {
    const newFilters = { ...filters, [key]: value, page: '1' };
    setFilters(newFilters);
    updateURL(newFilters);
    await fetchNames(newFilters);
  };

  const fetchNames = async (currentFilters) => {
    setIsLoading(true);
    const params = new URLSearchParams();
    Object.entries(currentFilters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });

    try {
      const response = await fetch(`http://localhost:5000/api/names?${params}`);
      const data = await response.json();
      setNames(data.data?.names || []);
      setPagination(data.data?.pagination || {});
    } catch (error) {
      console.error('Error fetching names:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearFilters = () => {
    const defaultFilters = {
      religion: 'islamic',
      gender: '',
      origin: '',
      alphabet: '',
      language: '',
      category: '',
      themes: '',
      lucky_number: '',
      lucky_day: '',
      lucky_color: '',
      lucky_stone: '',
      search: '',
      sort: 'popularity',
      page: '1',
      limit: '20',
    };
    setFilters(defaultFilters);
    updateURL(defaultFilters);
    fetchNames(defaultFilters);
  };

  const handlePageChange = (newPage) => {
    handleFilterChange('page', newPage.toString());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-emerald-50 via-white to-teal-50'}`}>
      {/* Header */}
      <Header darkMode={darkMode} setDarkMode={setDarkMode} setShowFilters={setShowFilters} showFilters={showFilters} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <SearchBar filters={filters} handleFilterChange={handleFilterChange} darkMode={darkMode} />

        {/* Stats Bar */}
        <StatsBar pagination={pagination} filters={filters} darkMode={darkMode} />

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <FilterSidebar
            showFilters={showFilters}
            filters={filters}
            filterOptions={filterOptions}
            handleFilterChange={handleFilterChange}
            clearFilters={clearFilters}
            darkMode={darkMode}
          />

          {/* Names Grid */}
          <NamesGrid names={names} isLoading={isLoading} darkMode={darkMode} />
        </div>

        {/* Pagination */}
        {!isLoading && names.length > 0 && (
          <Pagination pagination={pagination} handlePageChange={handlePageChange} darkMode={darkMode} />
        )}
      </main>

      {/* Footer */}
      <Footer darkMode={darkMode} />
    </div>
  );
}

// Header Component
function Header({ darkMode, setDarkMode, setShowFilters, showFilters }) {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-emerald-100 dark:border-gray-700 sticky top-0 z-50 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg"
            >
              <BookOpen className="w-7 h-7 text-white" />
            </motion.div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                Names Directory
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Discover meaningful names across cultures
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-emerald-50 dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-gray-600 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden p-2 rounded-lg bg-emerald-50 dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-gray-600 transition-colors"
              aria-label="Toggle filters"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

// Search Bar Component
function SearchBar({ filters, handleFilterChange, darkMode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="search"
          placeholder="Search names, meanings, or themes..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-emerald-100 dark:border-gray-700 focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 dark:focus:ring-emerald-900/20 outline-none transition-all text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 shadow-sm"
          aria-label="Search names"
        />
      </div>
    </motion.div>
  );
}

// Stats Bar Component
function StatsBar({ pagination, filters, darkMode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-emerald-50 dark:border-gray-700"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Total:{' '}
              <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                {pagination.total?.toLocaleString() || 0}
              </span>
            </span>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Page {pagination.current_page || 1} of {pagination.total_pages || 1}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300">
            {filters.religion || 'All'}
          </span>
          {filters.gender && (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300">
              {filters.gender}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Filter Sidebar Component
function FilterSidebar({ showFilters, filters, filterOptions, handleFilterChange, clearFilters, darkMode }) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={`lg:block ${showFilters ? 'block' : 'hidden'} lg:w-80 space-y-6`}
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-emerald-50 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <Filter className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Filters
          </h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearFilters}
            className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium"
            aria-label="Clear all filters"
          >
            Clear All
          </motion.button>
        </div>

        <div className="space-y-5">
          <FilterSelect
            label="Religion"
            value={filters.religion}
            onChange={(val) => handleFilterChange('religion', val)}
            options={['islamic', 'christian', 'hindu', 'all']}
            darkMode={darkMode}
          />

          <FilterSelect
            label="Gender"
            value={filters.gender}
            onChange={(val) => handleFilterChange('gender', val)}
            options={filterOptions.genders || ['male', 'female']}
            darkMode={darkMode}
          />

          <FilterSelect
            label="Origin"
            value={filters.origin}
            onChange={(val) => handleFilterChange('origin', val)}
            options={filterOptions.origins || ['arabic', 'persian', 'turkish']}
            darkMode={darkMode}
          />

          <FilterSelect
            label="Sort By"
            value={filters.sort}
            onChange={(val) => handleFilterChange('sort', val)}
            options={['popularity', 'recent', 'a-z', 'z-a', 'trending']}
            darkMode={darkMode}
          />

          {/* Alphabet Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Starting Letter
            </label>
            <div className="grid grid-cols-7 gap-1">
              {alphabet.map((letter) => (
                <motion.button
                  key={letter}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleFilterChange('alphabet', filters.alphabet === letter ? '' : letter)}
                  className={`p-2 text-xs rounded-lg transition-colors ${
                    filters.alphabet === letter
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-emerald-100 dark:hover:bg-gray-600'
                  }`}
                  aria-label={`Filter by letter ${letter}`}
                >
                  {letter}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Lucky Attributes */}
          <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Lucky Attributes
                </span>
              </div>

              <FilterSelect
                label="Lucky Number"
                value={filters.lucky_number}
                onChange={(val) => handleFilterChange('lucky_number', val)}
                options={filterOptions.lucky_numbers || ['1', '2', '3', '4', '5', '6', '7', '8', '9']}
                darkMode={darkMode}
                small
              />

              <FilterSelect
                label="Lucky Day"
                value={filters.lucky_day}
                onChange={(val) => handleFilterChange('lucky_day', val)}
                options={filterOptions.lucky_days || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']}
                darkMode={darkMode}
                small
              />
            </div>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}

// Filter Select Component
function FilterSelect({ label, value, onChange, options, darkMode, small }) {
  return (
    <div className={small ? 'mt-3' : ''}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-50 dark:focus:ring-emerald-900/20 outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 transition-colors"
        aria-label={`Filter by ${label}`}
      >
        <option value="">All {label}s</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt.charAt(0).toUpperCase() + opt.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}

// Names Grid Component
function NamesGrid({ names, isLoading, darkMode }) {
  if (isLoading) {
    return (
      <div className="flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} darkMode={darkMode} />
          ))}
        </div>
      </div>
    );
  }

  if (names.length === 0) {
    return (
      <div className="flex-1">
        <EmptyState darkMode={darkMode} />
      </div>
    );
  }

  return (
    <div className="flex-1">
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {names.map((name, index) => (
            <NameCard key={name._id} name={name} index={index} darkMode={darkMode} />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

// Name Card Component
function NameCard({ name, index, darkMode }) {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-emerald-50 dark:border-gray-700 hover:border-emerald-200 dark:hover:border-emerald-700 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">
            {name.name}
          </h3>
          <div className="flex gap-2">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
              {name.gender}
            </span>
            {name.religion && (
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                {name.religion}
              </span>
            )}
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsFavorite(!isFavorite)}
          className="p-2 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
          aria-label={`${isFavorite ? 'Remove' : 'Add'} ${name.name} to favorites`}
        >
          <Heart
            className={`w-5 h-5 ${
              isFavorite
                ? 'fill-rose-500 text-rose-500'
                : 'text-gray-400 dark:text-gray-500'
            }`}
          />
        </motion.button>
      </div>

      <p className="text-gray-700 dark:text-gray-300 font-medium mb-3">
        {name.short_meaning}
      </p>

      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
        {name.long_meaning}
      </p>

      {name.themes && name.themes.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {name.themes.slice(0, 3).map((theme, idx) => (
            <motion.span
              key={idx}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 * idx }}
              className="px-2 py-1 rounded-md text-xs bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300"
            >
              {theme}
            </motion.span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            {name.origin}
          </span>
          {name.emotional_traits && (
            <span>• {name.emotional_traits[0]}</span>
          )}
        </div>
        {name.lucky_number && (
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-xs font-medium"
          >
            <Sparkles className="w-3 h-3" />
            {name.lucky_number}
          </motion.div>
        )}
      </div>
    </motion.article>
  );
}

// Skeleton Card Component
function SkeletonCard({ darkMode }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-emerald-50 dark:border-gray-700 animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
        </div>
        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      </div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mb-4"></div>
      <div className="flex gap-2 mb-4">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-12"></div>
      </div>
    </div>
  );
}

// Empty State Component
function EmptyState({ darkMode }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-16"
    >
      <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
        <Search className="w-12 h-12 text-gray-400 dark:text-gray-500" />
      </div>
      <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
        No names found
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Try adjusting your filters or search terms
      </p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors"
      >
        Clear All Filters
      </motion.button>
    </motion.div>
  );
}

// Pagination Component
function Pagination({ pagination, handlePageChange, darkMode }) {
  const { current_page, total_pages } = pagination;
  const pages = [];

  // Generate page numbers
  const maxVisible = 5;
  let startPage = Math.max(1, current_page - Math.floor(maxVisible / 2));
  let endPage = Math.min(total_pages, startPage + maxVisible - 1);

  if (endPage - startPage < maxVisible - 1) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-12 flex items-center justify-center gap-2"
    >
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handlePageChange(current_page - 1)}
        disabled={current_page === 1}
        className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Previous page"
      >
        Previous
      </motion.button>

      {startPage > 1 && (
        <>
          <PageButton page={1} current={current_page} onClick={handlePageChange} darkMode={darkMode} />
          {startPage > 2 && <span className="px-2 text-gray-500 dark:text-gray-400">...</span>}
        </>
      )}

      {pages.map((page) => (
        <PageButton
          key={page}
          page={page}
          current={current_page}
          onClick={handlePageChange}
          darkMode={darkMode}
        />
      ))}

      {endPage < total_pages && (
        <>
          {endPage < total_pages - 1 && <span className="px-2 text-gray-500 dark:text-gray-400">...</span>}
          <PageButton page={total_pages} current={current_page} onClick={handlePageChange} darkMode={darkMode} />
        </>
      )}

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handlePageChange(current_page + 1)}
        disabled={current_page === total_pages}
        className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Next page"
      >
        Next
      </motion.button>
    </motion.div>
  );
}

// Page Button Component
function PageButton({ page, current, onClick, darkMode }) {
  const isCurrent = page === current;

  return (
    <motion.button
      whileHover={{ scale: isCurrent ? 1 : 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => onClick(page)}
      className={`w-10 h-10 rounded-lg font-medium transition-colors ${
        isCurrent
          ? 'bg-emerald-500 text-white'
          : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-gray-700'
      }`}
      aria-label={`Go to page ${page}`}
      aria-current={isCurrent ? 'page' : undefined}
    >
      {page}
    </motion.button>
  );
}

// Footer Component
function Footer({ darkMode }) {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-emerald-100 dark:border-gray-700 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
            © 2025 Names Directory. Discover meaningful names with spiritual significance.
          </p>
          <div className="flex items-center gap-4">
            <motion.a
              whileHover={{ scale: 1.05 }}
              href="#"
              className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 text-sm font-medium"
            >
              About
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              href="#"
              className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 text-sm font-medium"
            >
              Contact
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              href="#"
              className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 text-sm font-medium"
            >
              Privacy
            </motion.a>
          </div>
        </div>
      </div>
    </footer>
  );
}