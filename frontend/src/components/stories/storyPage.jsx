'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Filter, X, Star, Clock, Eye, ChevronDown, Loader2 } from 'lucide-react';

export default function StoryFilterUI({
  initialFilters,
  initialStories,
  initialParams,
}) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [imageErrors, setImageErrors] = useState(new Set());
  const [displayedStories, setDisplayedStories] = useState(12);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const getValue = (param) => {
    return Array.isArray(param) ? (param[0] || '') : (param || '');
  };

  // Client-side only filters (not in URL)
  const [filters, setFilters] = useState({
    search: getValue(initialParams?.search) || '',
    category: getValue(initialParams?.category) || '',
    sub_category: getValue(initialParams?.sub_category) || '',
    mood: getValue(initialParams?.mood) || '',
    difficulty_level: getValue(initialParams?.difficulty_level) || '',
    minRating: getValue(initialParams?.minRating) || '',
    sort: getValue(initialParams?.sort) || '-views',
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setMobileFilterOpen(false);
    setDisplayedStories(12); // Reset pagination when filter changes
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      search: '',
      category: '',
      sub_category: '',
      mood: '',
      difficulty_level: '',
      minRating: '',
      sort: '-views',
    });
    setMobileFilterOpen(false);
    setDisplayedStories(12);
  }, []);

  const activeFilterCount = useMemo(() => 
    Object.entries(filters).filter(([k, v]) => v && v !== '-views' && k !== 'sort').length,
    [filters]
  );

  // Apply filters client-side
  const filteredStories = useMemo(() => {
    let stories = [...initialStories];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      stories = stories.filter(story => 
        story.title?.toLowerCase().includes(searchLower) ||
        story.subtitle?.toLowerCase().includes(searchLower) ||
        story.category?.toLowerCase().includes(searchLower)
      );
    }

    // Category filter
    if (filters.category) {
      stories = stories.filter(story => story.category === filters.category);
    }

    // Mood filter
    if (filters.mood) {
      stories = stories.filter(story => story.mood === filters.mood);
    }

    // Difficulty filter
    if (filters.difficulty_level) {
      stories = stories.filter(story => story.difficulty_level === filters.difficulty_level);
    }

    // Rating filter
    if (filters.minRating) {
      const minRating = parseFloat(filters.minRating);
      stories = stories.filter(story => story.rating >= minRating);
    }

    // Sort
    if (filters.sort) {
      stories.sort((a, b) => {
        switch (filters.sort) {
          case '-views':
            return (b.views || 0) - (a.views || 0);
          case '-rating':
            return (b.rating || 0) - (a.rating || 0);
          case '-createdAt':
            return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
          case 'createdAt':
            return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
          default:
            return 0;
        }
      });
    }

    return stories;
  }, [initialStories, filters]);

  const handleImageError = useCallback((storyId) => {
    setImageErrors((prev) => new Set(prev).add(storyId));
  }, []);

  const loadMoreStories = useCallback(() => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setDisplayedStories((prev) => prev + 12);
      setIsLoadingMore(false);
    }, 500);
  }, []);

  const visibleStories = useMemo(() => 
    filteredStories.slice(0, displayedStories),
    [filteredStories, displayedStories]
  );

  const hasMoreStories = displayedStories < filteredStories.length;

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 py-6 lg:py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-48 mb-6" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                  <div className="h-48 bg-slate-200" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                    <div className="h-3 bg-slate-200 rounded w-full" />
                    <div className="h-3 bg-slate-200 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-6 lg:py-8">
        {/* Mobile Header */}
        <div className="lg:hidden mb-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">
            Discover Stories
          </h1>
          <div className="flex gap-3">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white rounded-lg border border-slate-200 text-slate-700 font-medium shadow-sm active:scale-95 transition-transform"
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>
            
            <select
              value={filters.sort}
              onChange={(e) => updateFilter('sort', e.target.value)}
              className="px-4 py-3 bg-white rounded-lg border border-slate-200 text-slate-700 font-medium shadow-sm"
            >
              <option value="-views">👁 Popular</option>
              <option value="-rating">⭐ Top Rated</option>
              <option value="-createdAt">🆕 Latest</option>
              <option value="createdAt">📅 Oldest</option>
            </select>
          </div>
        </div>

        <div className="flex gap-6">
          {/* DESKTOP SIDEBAR */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-6 bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-900">Filters</h2>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 font-medium hover:text-blue-700"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Search */}
              <div className="mb-5">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search stories..."
                    value={filters.search}
                    onChange={(e) => updateFilter('search', e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-colors"
                    autoComplete="off"
                    data-form-type="other"
                  />
                </div>
              </div>

              {/* Sort */}
              <div className="mb-5">
                <label htmlFor="desktop-sort" className="block text-sm font-semibold text-slate-700 mb-2">Sort by</label>
                <select
                  id="desktop-sort"
                  value={filters.sort}
                  onChange={(e) => updateFilter('sort', e.target.value)}
                  className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-colors"
                  autoComplete="off"
                >
                  <option value="-views">Most Viewed</option>
                  <option value="-rating">Highest Rated</option>
                  <option value="-createdAt">Newest First</option>
                  <option value="createdAt">Oldest First</option>
                </select>
              </div>

              {/* Category */}
              <div className="mb-5">
                <label htmlFor="desktop-category" className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                <select
                  id="desktop-category"
                  value={filters.category}
                  onChange={(e) => updateFilter('category', e.target.value)}
                  className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-colors"
                  autoComplete="off"
                >
                  <option value="">All Categories</option>
                  {initialFilters.categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Difficulty */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Difficulty</label>
                <div className="grid grid-cols-3 gap-2">
                  {['easy', 'medium', 'hard'].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => updateFilter('difficulty_level', filters.difficulty_level === level ? '' : level)}
                      className={`py-2 px-3 rounded-lg text-xs font-medium transition-colors ${
                        filters.difficulty_level === level
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {level === 'easy' ? '😊 Easy' : level === 'medium' ? '😐 Med' : '😤 Hard'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mood */}
              <div className="mb-5">
                <label htmlFor="desktop-mood" className="block text-sm font-semibold text-slate-700 mb-2">Mood</label>
                <select
                  id="desktop-mood"
                  value={filters.mood}
                  onChange={(e) => updateFilter('mood', e.target.value)}
                  className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-colors"
                  autoComplete="off"
                >
                  <option value="">All Moods</option>
                  {initialFilters.moods.map((mood) => (
                    <option key={mood} value={mood}>{mood}</option>
                  ))}
                </select>
              </div>

              {/* Rating */}
              <div className="mb-5">
                <label htmlFor="desktop-rating" className="block text-sm font-semibold text-slate-700 mb-2">
                  Min Rating: {filters.minRating || 'Any'}
                </label>
                <input
                  id="desktop-rating"
                  type="range"
                  min="0"
                  max="5"
                  step="0.5"
                  value={filters.minRating || 0}
                  onChange={(e) => updateFilter('minRating', e.target.value)}
                  className="w-full accent-blue-600"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>0</span>
                  <span>5</span>
                </div>
              </div>
            </div>
          </aside>

          {/* MOBILE FILTER SHEET */}
          {mobileFilterOpen && (
            <div className="lg:hidden fixed inset-0 z-50 flex items-end">
              <div 
                onClick={() => setMobileFilterOpen(false)}
                className="absolute inset-0 bg-black/50"
              />
              <div className="relative w-full bg-white rounded-t-2xl max-h-[85vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-slate-200 px-5 py-4 flex items-center justify-between z-10">
                  <h2 className="text-lg font-bold text-slate-900">Filters</h2>
                  <button
                    type="button"
                    onClick={() => setMobileFilterOpen(false)}
                    className="p-2 rounded-lg hover:bg-slate-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-5 space-y-5">
                  {/* Search */}
                  <div>
                    <label htmlFor="mobile-search" className="block text-sm font-semibold text-slate-700 mb-2">Search</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      <input
                        id="mobile-search"
                        type="text"
                        placeholder="Search stories..."
                        value={filters.search}
                        onChange={(e) => updateFilter('search', e.target.value)}
                        className="w-full pl-10 pr-3 py-3 text-sm border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                        autoComplete="off"
                        data-form-type="other"
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label htmlFor="mobile-category" className="block text-sm font-semibold text-slate-700 mb-2">📂 Category</label>
                    <select
                      id="mobile-category"
                      value={filters.category}
                      onChange={(e) => updateFilter('category', e.target.value)}
                      className="w-full p-3 text-sm border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                      autoComplete="off"
                    >
                      <option value="">All Categories</option>
                      {initialFilters.categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Difficulty */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">🎯 Difficulty</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['easy', 'medium', 'hard'].map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => updateFilter('difficulty_level', filters.difficulty_level === level ? '' : level)}
                          className={`py-3 px-3 rounded-lg text-sm font-medium transition-colors ${
                            filters.difficulty_level === level
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {level === 'easy' ? '😊 Easy' : level === 'medium' ? '😐 Med' : '😤 Hard'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Mood */}
                  <div>
                    <label htmlFor="mobile-mood" className="block text-sm font-semibold text-slate-700 mb-2">🎭 Mood</label>
                    <select
                      id="mobile-mood"
                      value={filters.mood}
                      onChange={(e) => updateFilter('mood', e.target.value)}
                      className="w-full p-3 text-sm border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                      autoComplete="off"
                    >
                      <option value="">All Moods</option>
                      {initialFilters.moods.map((mood) => (
                        <option key={mood} value={mood}>{mood}</option>
                      ))}
                    </select>
                  </div>

                  {/* Rating */}
                  <div>
                    <label htmlFor="mobile-rating" className="block text-sm font-semibold text-slate-700 mb-2">
                      ⭐ Min Rating: {filters.minRating || 'Any'}
                    </label>
                    <input
                      id="mobile-rating"
                      type="range"
                      min="0"
                      max="5"
                      step="0.5"
                      value={filters.minRating || 0}
                      onChange={(e) => updateFilter('minRating', e.target.value)}
                      className="w-full accent-blue-600"
                    />
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                      <span>0</span>
                      <span>5</span>
                    </div>
                  </div>

                  {/* Clear All */}
                  {activeFilterCount > 0 && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="w-full py-3 bg-slate-900 text-white rounded-lg font-medium text-sm"
                    >
                      Clear All Filters ({activeFilterCount})
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* MAIN CONTENT */}
          <main className="flex-1 min-w-0">
            <div className="hidden lg:block mb-6">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Discover Stories
              </h1>
              <p className="text-slate-600">
                {filteredStories.length} {filteredStories.length === 1 ? 'story' : 'stories'} found
              </p>
            </div>

            {filteredStories.length === 0 ? (
              <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
                <div className="text-6xl mb-4">📚</div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">No Stories Found</h2>
                <p className="text-slate-600 mb-6">Try adjusting your filters</p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {visibleStories.map((story, idx) => (
                    <Link
                      key={story._id}
                      href={`/stories/${story.story_id}`}
                      className="group bg-white rounded-lg border border-slate-200 overflow-hidden hover:border-blue-300 hover:shadow-lg transition-all"
                    >
                      {/* Image */}
                      <div className="relative h-48 overflow-hidden bg-slate-100">
                        {!imageErrors.has(story._id) ? (
                          <img
                            src={`${story.thumbnail_image || story.cover_image || 'default'}.jpg`}
                            alt={story.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading={idx < 6 ? 'eager' : 'lazy'}
                            onError={() => handleImageError(story._id)}
                          />
                        ) : (
                          <div
                            className="w-full h-full flex items-center justify-center text-4xl"
                            style={{ backgroundColor: story.theme_color || '#6366f1' }}
                          >
                            📖
                          </div>
                        )}

                        {story.featured && (
                          <div className="absolute top-2 right-2 bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                            <Star className="w-3 h-3 fill-current" />
                            Featured
                          </div>
                        )}

                        <div className="absolute top-2 left-2 bg-white/90 px-2 py-1 rounded-full text-xs font-semibold text-slate-800">
                          {story.category}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <h3 className="text-base font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {story.title}
                        </h3>
                        <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                          {story.subtitle}
                        </p>

                        {/* Stats */}
                        <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                          <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span className="font-semibold">{story.rating}</span>
                          </div>
                          {story.read_time_minutes && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{story.read_time_minutes}m</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" />
                            <span>{(story.views || 0).toLocaleString()}</span>
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="flex gap-2">
                          {story.difficulty_level && (
                            <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded font-medium">
                              {story.difficulty_level}
                            </span>
                          )}
                          {story.length_type && (
                            <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded font-medium">
                              {story.length_type}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Load More Button */}
                {hasMoreStories && (
                  <div className="mt-8 text-center">
                    <button
                      type="button"
                      onClick={loadMoreStories}
                      disabled={isLoadingMore}
                      className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
                    >
                      {isLoadingMore ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-5 h-5" />
                          Load More Stories
                        </>
                      )}
                    </button>
                    <p className="text-sm text-slate-500 mt-3">
                      Showing {visibleStories.length} of {filteredStories.length} stories
                    </p>
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