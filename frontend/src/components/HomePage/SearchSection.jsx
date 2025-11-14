'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, Loader2, User, MapPin, Heart, Sparkles, ChevronRight, BookOpen, TrendingUp, Clock, Eye, Star, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

const UniversalSearch = () => {
  const [query, setQuery] = useState('');
  const [nameResults, setNameResults] = useState([]);
  const [storyResults, setStoryResults] = useState([]);
  const [isLoadingNames, setIsLoadingNames] = useState(false);
  const [isLoadingStories, setIsLoadingStories] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [activeTab, setActiveTab] = useState('all');
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);
  const router = useRouter();

  // Religion color mapping
  const religionColors = {
    islamic: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', gradient: 'from-emerald-500 to-teal-600' },
    hindu: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', gradient: 'from-orange-500 to-red-600' },
    christian: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', gradient: 'from-blue-500 to-indigo-600' },
    buddhist: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', gradient: 'from-yellow-500 to-orange-600' },
    jewish: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', gradient: 'from-purple-500 to-fuchsia-600' },
    default: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', gradient: 'from-gray-500 to-slate-600' }
  };

  // Category color mapping for stories
  const categoryColors = {
    education: { bg: 'bg-emerald-50', text: 'text-emerald-700', gradient: 'from-emerald-500 to-teal-600' },
    technology: { bg: 'bg-purple-50', text: 'text-purple-700', gradient: 'from-purple-500 to-indigo-600' },
    career: { bg: 'bg-orange-50', text: 'text-orange-700', gradient: 'from-orange-500 to-amber-600' },
    history: { bg: 'bg-red-50', text: 'text-red-700', gradient: 'from-red-500 to-rose-600' },
    culture: { bg: 'bg-indigo-50', text: 'text-indigo-700', gradient: 'from-indigo-500 to-purple-600' },
    inspiration: { bg: 'bg-pink-50', text: 'text-pink-700', gradient: 'from-pink-500 to-rose-600' },
    default: { bg: 'bg-gray-50', text: 'text-gray-700', gradient: 'from-gray-500 to-slate-600' }
  };

  // Gender icon mapping
  const getGenderIcon = (gender) => {
    const genderLower = gender?.toLowerCase();
    if (genderLower === 'male') return { icon: User, color: 'text-blue-600', bg: 'bg-blue-100' };
    if (genderLower === 'female') return { icon: Heart, color: 'text-pink-600', bg: 'bg-pink-100' };
    return { icon: Sparkles, color: 'text-purple-600', bg: 'bg-purple-100' };
  };

  // Format numbers
  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  // Fetch names separately (fast)
  const fetchNames = useCallback(async (searchQuery) => {
    try {
      const response = await fetch(`http://localhost:5000/api/search?q=${encodeURIComponent(searchQuery.trim())}`);
      if (response.ok) {
        const data = await response.json();
        return data.success ? data.results || [] : [];
      }
      return [];
    } catch (err) {
      console.error('Names fetch error:', err);
      return [];
    }
  }, []);

  // Fetch stories separately (slow)
  const fetchStories = useCallback(async (searchQuery) => {
    try {
      const response = await fetch(`http://localhost:5001/api/stories/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: searchQuery.trim(),
          lang: 'english'
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.success ? data.data || [] : [];
      }
      return [];
    } catch (err) {
      console.error('Stories fetch error:', err);
      return [];
    }
  }, []);

  // Progressive search - names first, then stories
  const searchAll = useCallback(async (searchQuery) => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setNameResults([]);
      setStoryResults([]);
      setIsOpen(false);
      setHasSearched(false);
      setIsLoadingNames(false);
      setIsLoadingStories(false);
      return;
    }

    setHasSearched(true);
    setError(null);
    setIsLoadingNames(true);
    setIsLoadingStories(true);

    try {
      // Start with names (fast)
      const namesPromise = fetchNames(searchQuery);
      
      // Show names immediately when ready
      namesPromise.then(names => {
        setNameResults(names);
        setIsLoadingNames(false);
        
        // Open dropdown if we have names, even if stories are still loading
        if (names.length > 0) {
          setIsOpen(true);
        }
      });

      // Then get stories (slow)
      const storiesPromise = fetchStories(searchQuery);
      
      storiesPromise.then(stories => {
        setStoryResults(stories);
        setIsLoadingStories(false);
        
        // Open dropdown if we have stories (might already be open from names)
        if (stories.length > 0) {
          setIsOpen(true);
        }
      });

      // Wait for both with timeout, but handle results progressively
      await Promise.race([
        Promise.all([namesPromise, storiesPromise]),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Request timeout')), 10000))
      ]);

    } catch (err) {
      console.error('Search error:', err);
      setError('Search is taking longer than usual. Partial results shown.');
      
      // Ensure loading states are cleared even on error
      setIsLoadingNames(false);
      setIsLoadingStories(false);
    }

    // Final check - if no results at all after both complete
    if (nameResults.length === 0 && storyResults.length === 0 && !isLoadingNames && !isLoadingStories) {
      setError('No results found for your search. Try different keywords.');
    }
  }, [fetchNames, fetchStories, nameResults.length, storyResults.length]);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.trim().length >= 2) {
      debounceRef.current = setTimeout(() => {
        searchAll(query);
      }, 250);
    } else {
      setNameResults([]);
      setStoryResults([]);
      setIsOpen(false);
      setHasSearched(false);
      setIsLoadingNames(false);
      setIsLoadingStories(false);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, searchAll]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get all results based on active tab
  const getAllResults = useCallback(() => {
    if (activeTab === 'names') return nameResults.map(r => ({ ...r, type: 'name' }));
    if (activeTab === 'stories') return storyResults.map(r => ({ ...r, type: 'story' }));
    
    // 'all' tab - interleave with priority to better matches
    const allResults = [];
    const maxLength = Math.max(nameResults.length, storyResults.length);
    
    for (let i = 0; i < maxLength; i++) {
      if (i < nameResults.length) allResults.push({ ...nameResults[i], type: 'name' });
      if (i < storyResults.length) allResults.push({ ...storyResults[i], type: 'story' });
    }
    
    return allResults.slice(0, 20);
  }, [activeTab, nameResults, storyResults]);

  const allResults = getAllResults();

  // Check if we have any results or are still loading
  const hasResults = nameResults.length > 0 || storyResults.length > 0;
  const isLoading = isLoadingNames || isLoadingStories;

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'Enter' && query.trim()) {
        handleSearchSubmit(e);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < allResults.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : allResults.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && allResults[selectedIndex]) {
          handleResultClick(allResults[selectedIndex]);
        } else if (query.trim()) {
          handleSearchSubmit(e);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
      case 'Tab':
        if (isOpen) {
          e.preventDefault();
          setActiveTab(prev => {
            const tabs = ['all', 'names', 'stories'].filter(tab => {
              if (tab === 'names') return nameResults.length > 0 || isLoadingNames;
              if (tab === 'stories') return storyResults.length > 0 || isLoadingStories;
              return true;
            });
            const currentIndex = tabs.indexOf(prev);
            const nextIndex = e.shiftKey ? 
              (currentIndex > 0 ? currentIndex - 1 : tabs.length - 1) :
              (currentIndex < tabs.length - 1 ? currentIndex + 1 : 0);
            return tabs[nextIndex];
          });
        }
        break;
      default:
        break;
    }
  };

  // Handle form submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      router.push(`/search/${encodeURIComponent(query.trim())}`);
    }
  };

  // Handle result selection
  const handleResultClick = (result) => {
    setIsOpen(false);
    setSelectedIndex(-1);
    
    if (result.type === 'story') {
      router.push(`/stories/${result.story_id || result._id}`);
    } else {
      const religion = result.religion?.toLowerCase() || 'global';
      const slug = result.slug || result.name?.toLowerCase().replace(/\s+/g, '-');
      router.push(`/names/${religion}/${slug}`);
    }
  };

  // Clear search
  const clearSearch = () => {
    setQuery('');
    setNameResults([]);
    setStoryResults([]);
    setIsOpen(false);
    setSelectedIndex(-1);
    setError(null);
    setActiveTab('all');
    setHasSearched(false);
    setIsLoadingNames(false);
    setIsLoadingStories(false);
    inputRef.current?.focus();
  };

  // Get religion styling
  const getReligionStyle = (religion) => {
    const religionKey = religion?.toLowerCase();
    return religionColors[religionKey] || religionColors.default;
  };

  // Get category styling for stories
  const getCategoryStyle = (category) => {
    const categoryKey = category?.toLowerCase();
    return categoryColors[categoryKey] || categoryColors.default;
  };

  // Highlight matching text
  const highlightText = (text, query) => {
    if (!text || !query) return text;
    
    const regex = new RegExp(`(${query.trim()})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 font-semibold px-0.5 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  // Loading skeleton for stories
  const StorySkeleton = () => (
    <div className="w-full px-4 py-3 flex items-start gap-3 animate-pulse">
      <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-xl"></div>
      <div className="flex-1 min-w-0">
        <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded mb-2 w-full"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  );

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl mx-auto">
      {/* Search Form */}
      <form onSubmit={handleSearchSubmit} className="relative" role="search" aria-label="Site search">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors duration-200" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => query.trim().length >= 2 && (hasResults || isLoading) && setIsOpen(true)}
            placeholder="Search names, stories, or topics..."
            className="w-full pl-12 pr-12 py-4 text-base font-medium text-gray-900 placeholder-gray-500 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl focus:outline-none focus:ring-3 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm hover:shadow-md transition-all duration-200"
            aria-label="Search for baby names or stories"
            aria-autocomplete="list"
            aria-controls="search-results"
            aria-expanded={isOpen}
            autoComplete="off"
            name="search"
            id="universal-search-input"
          />

          {/* Right side icons */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
            <AnimatePresence mode="wait">
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="p-1.5"
                  aria-label="Searching"
                >
                  <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" aria-hidden="true" />
                </motion.div>
              )}
              {query && !isLoading && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={clearSearch}
                  type="button"
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4 text-gray-400 hover:text-gray-600" aria-hidden="true" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </form>

      {/* Results Dropdown */}
      <AnimatePresence>
        {isOpen && (query.trim().length >= 2 || hasSearched) && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            id="search-results"
            role="listbox"
            aria-label="Search results"
            className="absolute top-full left-0 right-0 mt-3 bg-white/95 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-2xl shadow-gray-400/20 overflow-hidden z-50 max-h-[70vh] overflow-y-auto"
          >
            {error && !hasResults && !isLoading ? (
              <div className="p-8 text-center" role="status" aria-live="polite">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Search className="w-6 h-6 text-gray-400" aria-hidden="true" />
                </div>
                <p className="text-sm text-gray-600 font-medium mb-1">{error}</p>
                <p className="text-xs text-gray-500">Try different keywords or check your connection</p>
              </div>
            ) : !hasResults && !isLoading ? (
              <div className="p-8 text-center" role="status" aria-live="polite">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Search className="w-6 h-6 text-gray-400" aria-hidden="true" />
                </div>
                <p className="text-sm text-gray-600 font-medium mb-1">No results found</p>
                <p className="text-xs text-gray-500">Try adjusting your search terms</p>
              </div>
            ) : (
              <div>
                {/* Tab Navigation */}
                <div className="sticky top-0 bg-white/95 backdrop-blur-xl border-b border-gray-200 px-4 py-3 flex items-center justify-between z-10">
                  <div className="flex items-center gap-1" role="tablist" aria-label="Search result categories">
                    <button
                      onClick={() => setActiveTab('all')}
                      role="tab"
                      aria-selected={activeTab === 'all'}
                      aria-controls="search-results-content"
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                        activeTab === 'all'
                          ? 'bg-indigo-100 text-indigo-700 shadow-sm'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      All ({nameResults.length + storyResults.length})
                      {isLoading && <Loader2 className="w-3 h-3 ml-1 animate-spin inline" />}
                    </button>
                    {(nameResults.length > 0 || isLoadingNames) && (
                      <button
                        onClick={() => setActiveTab('names')}
                        role="tab"
                        aria-selected={activeTab === 'names'}
                        aria-controls="search-results-content"
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                          activeTab === 'names'
                            ? 'bg-blue-100 text-blue-700 shadow-sm'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        Names ({nameResults.length})
                        {isLoadingNames && <Loader2 className="w-3 h-3 ml-1 animate-spin inline" />}
                      </button>
                    )}
                    {(storyResults.length > 0 || isLoadingStories) && (
                      <button
                        onClick={() => setActiveTab('stories')}
                        role="tab"
                        aria-selected={activeTab === 'stories'}
                        aria-controls="search-results-content"
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                          activeTab === 'stories'
                            ? 'bg-purple-100 text-purple-700 shadow-sm'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        Stories ({storyResults.length})
                        {isLoadingStories && <Loader2 className="w-3 h-3 ml-1 animate-spin inline" />}
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 hidden sm:block">
                    <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs border border-gray-300">↑↓</kbd> Navigate
                    <span className="mx-1">•</span>
                    <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs border border-gray-300">↵</kbd> Select
                  </p>
                </div>

                {/* Results List */}
                <div className="py-2" id="search-results-content" role="tabpanel">
                  {/* Show names immediately */}
                  {activeTab === 'all' && nameResults.map((result, index) => {
                    const religionStyle = getReligionStyle(result.religion);
                    const genderInfo = getGenderIcon(result.gender);
                    const GenderIcon = genderInfo.icon;
                    const isSelected = selectedIndex === index;

                    return (
                      <motion.button
                        key={`name-${result._id}`}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.01 }}
                        onClick={() => handleResultClick({ ...result, type: 'name' })}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`w-full px-4 py-3 flex items-start gap-3 transition-all duration-200 border-l-4 group ${
                          isSelected
                            ? `${religionStyle.bg.replace('50', '20')} ${religionStyle.border} shadow-inner`
                            : 'border-transparent hover:bg-gray-50/80'
                        }`}
                        role="option"
                        aria-selected={isSelected}
                      >
                        {/* Name Icon Badge */}
                        <div className={`flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${religionStyle.gradient} flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-200`}>
                          <span className="text-white font-bold text-base">
                            {result.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>

                        {/* Name Content */}
                        <div className="flex-1 text-left min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900 text-sm truncate">
                              {highlightText(result.name, query)}
                            </h3>
                            <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5 group-hover:text-gray-600 transition-colors duration-200" aria-hidden="true" />
                          </div>
                          
                          <p className="text-xs text-gray-600 mb-2 line-clamp-1">
                            {highlightText(result.short_meaning || result.meaning, query)}
                          </p>

                          {/* Name Metadata */}
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className={`inline-flex items-center px-2 py-0.5 ${religionStyle.bg} ${religionStyle.text} text-xs font-medium rounded-md border ${religionStyle.border}`}>
                              {result.religion || 'Global'}
                            </span>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 ${genderInfo.bg} text-gray-700 text-xs font-medium rounded-md`}>
                              <GenderIcon className={`w-3 h-3 ${genderInfo.color}`} aria-hidden="true" />
                              {result.gender || 'Unisex'}
                            </span>
                            {result.origin && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-md">
                                <MapPin className="w-3 h-3 text-gray-500" aria-hidden="true" />
                                {result.origin}
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}

                  {/* Show stories as they load */}
                  {activeTab === 'all' && (
                    <>
                      {isLoadingStories && storyResults.length === 0 && (
                        <>
                          <StorySkeleton />
                          <StorySkeleton />
                        </>
                      )}
                      
                      {storyResults.map((result, index) => {
                        const adjustedIndex = nameResults.length + index;
                        const isSelected = selectedIndex === adjustedIndex;
                        const categoryStyle = getCategoryStyle(result.category);
                        
                        return (
                          <motion.button
                            key={`story-${result._id || result.story_id}`}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: (nameResults.length + index) * 0.01 }}
                            onClick={() => handleResultClick({ ...result, type: 'story' })}
                            onMouseEnter={() => setSelectedIndex(adjustedIndex)}
                            className={`w-full px-4 py-3 flex items-start gap-3 transition-all duration-200 border-l-4 group ${
                              isSelected
                                ? 'bg-purple-50/80 border-purple-500 shadow-inner'
                                : 'border-transparent hover:bg-gray-50/80'
                            }`}
                            role="option"
                            aria-selected={isSelected}
                          >
                            {/* Story Icon Badge */}
                            <div className={`flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${categoryStyle.gradient} flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-200`}>
                              <BookOpen className="w-5 h-5 text-white" aria-hidden="true" />
                            </div>

                            {/* Story Content */}
                            <div className="flex-1 text-left min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">
                                  {highlightText(result.title, query)}
                                </h3>
                                <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5 group-hover:text-gray-600 transition-colors duration-200" aria-hidden="true" />
                              </div>
                              
                              <p className="text-xs text-gray-600 mb-2 line-clamp-1">
                                {highlightText(result.trailer || result.description, query)}
                              </p>

                              {/* Story Metadata */}
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className={`inline-flex items-center px-2 py-0.5 ${categoryStyle.bg} ${categoryStyle.text} text-xs font-medium rounded-md`}>
                                  {result.category}
                                </span>
                                {result.read_time_minutes && (
                                  <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                                    <Clock className="w-3 h-3" aria-hidden="true" />
                                    {result.read_time_minutes}m
                                  </span>
                                )}
                                {result.views && (
                                  <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                                    <Eye className="w-3 h-3" aria-hidden="true" />
                                    {formatNumber(result.views)}
                                  </span>
                                )}
                                {result.rating && (
                                  <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                                    <Star className="w-3 h-3 text-yellow-500" aria-hidden="true" />
                                    {result.rating}
                                  </span>
                                )}
                              </div>
                            </div>
                          </motion.button>
                        );
                      })}
                    </>
                  )}

                  {/* Show loading indicator for stories if still loading */}
                  {activeTab === 'all' && isLoadingStories && storyResults.length > 0 && (
                    <div className="px-4 py-2 text-center">
                      <Loader2 className="w-4 h-4 animate-spin mx-auto text-gray-400" />
                      <p className="text-xs text-gray-500 mt-1">Loading more stories...</p>
                    </div>
                  )}
                </div>

                {/* View All Footer */}
                {(hasResults || isLoading) && (
                  <div className="sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent border-t border-gray-200 px-4 py-3">
                    <button
                      onClick={handleSearchSubmit}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <TrendingUp className="w-4 h-4" aria-hidden="true" />
                      <span>View All Results for "{query}"</span>
                      <ExternalLink className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default React.memo(UniversalSearch);