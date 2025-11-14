'use client';
import { useState, useRef, useEffect, useCallback, forwardRef } from 'react';
import { Search, X, Loader2, ChevronRight, User, Heart, Sparkles, BookOpen, Clock } from 'lucide-react';

const SearchBar = forwardRef(({ onSearch, mobile = false, placeholder = "Search names..." }, ref) => {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [nameResults, setNameResults] = useState([]);
  const [storyResults, setStoryResults] = useState([]);
  const [isLoadingNames, setIsLoadingNames] = useState(false);
  const [isLoadingStories, setIsLoadingStories] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Religion color mapping
  const religionColors = {
    islamic: { gradient: 'from-emerald-500 to-teal-600', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    hindu: { gradient: 'from-orange-500 to-red-600', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
    christian: { gradient: 'from-blue-500 to-indigo-600', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    default: { gradient: 'from-gray-500 to-slate-600', bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' }
  };

  const categoryColors = {
    education: { gradient: 'from-emerald-500 to-teal-600' },
    technology: { gradient: 'from-purple-500 to-indigo-600' },
    career: { gradient: 'from-orange-500 to-amber-600' },
    history: { gradient: 'from-red-500 to-rose-600' },
    culture: { gradient: 'from-indigo-500 to-purple-600' },
    inspiration: { gradient: 'from-pink-500 to-rose-600' },
    default: { gradient: 'from-gray-500 to-slate-600' }
  };

  const getGenderIcon = (gender) => {
    const genderLower = gender?.toLowerCase();
    if (genderLower === 'male') return { icon: User, color: 'text-blue-600', bg: 'bg-blue-100' };
    if (genderLower === 'female') return { icon: Heart, color: 'text-pink-600', bg: 'bg-pink-100' };
    return { icon: Sparkles, color: 'text-purple-600', bg: 'bg-purple-100' };
  };

  const getReligionStyle = (religion) => {
    const religionKey = religion?.toLowerCase();
    return religionColors[religionKey] || religionColors.default;
  };

  const getCategoryStyle = (category) => {
    const categoryKey = category?.toLowerCase();
    return categoryColors[categoryKey] || categoryColors.default;
  };

  const fetchNames = useCallback(async (searchQuery) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/search?q=${encodeURIComponent(searchQuery.trim())}`);
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

  const fetchStories = useCallback(async (searchQuery) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE1}/stories/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery.trim(), lang: 'english' })
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

  const searchAll = useCallback(async (searchQuery) => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setNameResults([]);
      setStoryResults([]);
      setIsLoadingNames(false);
      setIsLoadingStories(false);
      return;
    }

    setIsLoadingNames(true);
    setIsLoadingStories(true);

    const namesPromise = fetchNames(searchQuery);
    namesPromise.then(names => {
      setNameResults(names.slice(0, 5));
      setIsLoadingNames(false);
    });

    const storiesPromise = fetchStories(searchQuery);
    storiesPromise.then(stories => {
      setStoryResults(stories.slice(0, 3));
      setIsLoadingStories(false);
    });
  }, [fetchNames, fetchStories]);

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
      setIsLoadingNames(false);
      setIsLoadingStories(false);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, searchAll]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setFocused(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const allResults = [...nameResults, ...storyResults];
  const hasResults = nameResults.length > 0 || storyResults.length > 0;
  const isLoading = isLoadingNames || isLoadingStories;

  const handleResultClick = (result, type) => {
    setFocused(false);
    setQuery('');
    setSelectedIndex(-1);
    
    if (type === 'story') {
      window.location.href = `/stories/${result.story_id || result._id}`;
    } else {
      const religionPath = result.religion?.toLowerCase() === 'islam' ? 'islamic' : 
                           result.religion?.toLowerCase() === 'hinduism' ? 'hindu' : 
                           result.religion?.toLowerCase() === 'christianity' ? 'christian' : 
                           result.religion?.toLowerCase() || 'global';
      const slug = result.slug || result.name?.toLowerCase().replace(/\s+/g, '-');
      window.location.href = `/names/${religionPath}/${slug}`;
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (query.trim()) {
      if (selectedIndex >= 0 && allResults[selectedIndex]) {
        const result = allResults[selectedIndex];
        handleResultClick(result, selectedIndex < nameResults.length ? 'name' : 'story');
      } else {
        window.location.href = `/search/${encodeURIComponent(query.trim())}`;
      }
      if (mobile) inputRef.current?.blur();
    }
  };

  const handleClear = () => {
    setQuery('');
    setNameResults([]);
    setStoryResults([]);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (!focused || !hasResults) {
      if (e.key === 'Escape') {
        inputRef.current?.blur();
        setQuery('');
      }
      if (e.key === 'Enter') {
        handleSubmit(e);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => prev < allResults.length - 1 ? prev + 1 : 0);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : allResults.length - 1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && allResults[selectedIndex]) {
          const result = allResults[selectedIndex];
          handleResultClick(result, selectedIndex < nameResults.length ? 'name' : 'story');
        } else {
          handleSubmit();
        }
        break;
      case 'Escape':
        setFocused(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
      default:
        break;
    }
  };

  const highlightText = (text, query) => {
    if (!text || !query) return text;
    const regex = new RegExp(`(${query.trim()})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200/70 font-semibold px-0.5 rounded">{part}</mark>
      ) : part
    );
  };

  return (
    <div ref={searchRef} className="relative w-full">
      {/* Search Input */}
      <div className={`relative flex items-center transition-all duration-500 ${
        mobile ? 'w-full' : 'w-72'
      } ${focused ? 'ring-2 ring-blue-500/50' : 'ring-1 ring-gray-200/60'} rounded-2xl bg-white/90 backdrop-blur-xl hover:ring-blue-500/30 shadow-sm hover:shadow-md`}>
        <div className="absolute left-4 flex items-center pointer-events-none">
          {isLoading ? (
            <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
          ) : (
            <Search className={`w-5 h-5 transition-colors duration-300 ${focused ? 'text-blue-600' : 'text-gray-400'}`} />
          )}
        </div>

        <input
          ref={ref || inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`w-full pl-12 ${query ? 'pr-12' : 'pr-4'} ${mobile ? 'py-3.5 text-base' : 'py-3 text-sm'} border-none outline-none rounded-2xl bg-transparent placeholder-gray-400 font-medium transition-all duration-300`}
        />

        {mounted && query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 p-1.5 rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-all duration-300 active:scale-95"
          >
            <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}

        {mounted && !mobile && !focused && !query && (
          <div className="absolute right-4 flex items-center gap-1 text-xs text-gray-400 pointer-events-none">
            <kbd className="px-2 py-1 bg-gray-100 rounded-lg text-xs font-semibold border border-gray-200">⌘K</kbd>
          </div>
        )}
      </div>

      {/* Desktop Dropdown - Normal positioning */}
      {mounted && focused && query.trim().length >= 2 && !mobile && (
        <div 
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-3 bg-white/95 backdrop-blur-2xl border border-gray-200/60 rounded-2xl shadow-2xl z-50 max-h-[32rem] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-500"
        >
          {!hasResults && !isLoading && (
            <div className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-600">No results found</p>
              <p className="text-xs text-gray-400 mt-1">Try different keywords</p>
            </div>
          )}

          {nameResults.length > 0 && (
            <div className="border-b border-gray-100/60">
              <div className="px-4 py-3 text-xs font-bold text-gray-500 bg-gray-50/80 backdrop-blur-xl uppercase tracking-wider">Names</div>
              {nameResults.map((result, index) => {
                const religionStyle = getReligionStyle(result.religion);
                const genderInfo = getGenderIcon(result.gender);
                const GenderIcon = genderInfo.icon;
                const isSelected = selectedIndex === index;

                return (
                  <button
                    key={result._id}
                    onClick={() => handleResultClick(result, 'name')}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full px-4 py-3 flex items-start gap-3 transition-all duration-300 ${
                      isSelected ? 'bg-blue-50/80 backdrop-blur-xl' : 'hover:bg-gray-50/50'
                    }`}
                  >
                    <div className={`flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${religionStyle.gradient} flex items-center justify-center shadow-lg transition-transform duration-300 ${isSelected ? 'scale-110 rotate-6' : ''}`}>
                      <span className="text-white font-black text-sm">{result.name?.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-bold text-base text-gray-900 truncate">
                          {highlightText(result.name, query)}
                        </h3>
                        <ChevronRight className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${isSelected ? 'translate-x-1' : ''}`} />
                      </div>
                      <p className="text-sm text-gray-600 truncate mt-0.5">{result.short_meaning || result.meaning}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-2.5 py-1 ${religionStyle.bg} ${religionStyle.text} text-xs font-semibold rounded-lg`}>
                          {result.religion}
                        </span>
                        <span className={`px-2.5 py-1 ${genderInfo.bg} text-gray-700 text-xs font-semibold rounded-lg flex items-center gap-1`}>
                          <GenderIcon className={`w-3.5 h-3.5 ${genderInfo.color}`} />
                          {result.gender}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {storyResults.length > 0 && (
            <div>
              <div className="px-4 py-3 text-xs font-bold text-gray-500 bg-gray-50/80 backdrop-blur-xl uppercase tracking-wider">Stories</div>
              {storyResults.map((result, index) => {
                const adjustedIndex = nameResults.length + index;
                const isSelected = selectedIndex === adjustedIndex;
                const categoryStyle = getCategoryStyle(result.category);

                return (
                  <button
                    key={result._id || result.story_id}
                    onClick={() => handleResultClick(result, 'story')}
                    onMouseEnter={() => setSelectedIndex(adjustedIndex)}
                    className={`w-full px-4 py-3 flex items-start gap-3 transition-all duration-300 ${
                      isSelected ? 'bg-purple-50/80 backdrop-blur-xl' : 'hover:bg-gray-50/50'
                    }`}
                  >
                    <div className={`flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${categoryStyle.gradient} flex items-center justify-center shadow-lg transition-transform duration-300 ${isSelected ? 'scale-110 rotate-6' : ''}`}>
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-bold text-base text-gray-900 line-clamp-1">
                          {highlightText(result.title, query)}
                        </h3>
                        <ChevronRight className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${isSelected ? 'translate-x-1' : ''}`} />
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-1 mt-0.5">{result.trailer || result.description}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 font-medium">
                        <span className="px-2.5 py-1 bg-gray-100 rounded-lg">{result.category}</span>
                        {result.read_time_minutes && (
                          <span className="flex items-center gap-1 px-2.5 py-1 bg-gray-100 rounded-lg">
                            <Clock className="w-3.5 h-3.5" />
                            {result.read_time_minutes}m
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {hasResults && (
            <button
              onClick={() => window.location.href = `/search/${encodeURIComponent(query.trim())}`}
              className="w-full px-4 py-4 text-sm text-blue-600 font-bold hover:bg-blue-50/80 backdrop-blur-xl transition-all duration-300 border-t border-gray-100/60 rounded-b-2xl group"
            >
              <span className="flex items-center justify-center gap-2">
                View all results for "{query}"
                <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </button>
          )}
        </div>
      )}

      {/* Mobile Dropdown - Fixed to viewport bottom */}
      {mounted && focused && query.trim().length >= 2 && mobile && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 animate-in fade-in duration-300"
            onClick={() => setFocused(false)}
          />
          
          {/* Bottom Sheet */}
          <div 
            ref={dropdownRef}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50 max-h-[70vh] overflow-y-auto animate-in slide-in-from-bottom duration-500"
          >
            <div className="sticky top-0 bg-white/95 backdrop-blur-xl border-b border-gray-100 px-4 py-3 rounded-t-3xl">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-3" />
              <h3 className="text-sm font-bold text-gray-900">Search Results</h3>
            </div>

            {!hasResults && !isLoading && (
              <div className="p-8 text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <Search className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-base font-semibold text-gray-600">No results found</p>
                <p className="text-sm text-gray-400 mt-1">Try different keywords</p>
              </div>
            )}

            {nameResults.length > 0 && (
              <div className="border-b border-gray-100">
                <div className="px-5 py-3 text-xs font-bold text-gray-500 bg-gray-50/80 uppercase tracking-wider">Names</div>
                {nameResults.map((result, index) => {
                  const religionStyle = getReligionStyle(result.religion);
                  const genderInfo = getGenderIcon(result.gender);
                  const GenderIcon = genderInfo.icon;
                  const isSelected = selectedIndex === index;

                  return (
                    <button
                      key={result._id}
                      onClick={() => handleResultClick(result, 'name')}
                      className={`w-full px-5 py-4 flex items-start gap-3 active:bg-blue-50 transition-all duration-300`}
                    >
                      <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${religionStyle.gradient} flex items-center justify-center shadow-lg`}>
                        <span className="text-white font-black text-base">{result.name?.charAt(0).toUpperCase()}</span>
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-bold text-base text-gray-900 line-clamp-1">
                            {highlightText(result.name, query)}
                          </h3>
                          <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2 mt-1">{result.short_meaning || result.meaning}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`px-3 py-1.5 ${religionStyle.bg} ${religionStyle.text} text-xs font-semibold rounded-lg`}>
                            {result.religion}
                          </span>
                          <span className={`px-3 py-1.5 ${genderInfo.bg} text-gray-700 text-xs font-semibold rounded-lg flex items-center gap-1`}>
                            <GenderIcon className={`w-3.5 h-3.5 ${genderInfo.color}`} />
                            {result.gender}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {storyResults.length > 0 && (
              <div>
                <div className="px-5 py-3 text-xs font-bold text-gray-500 bg-gray-50/80 uppercase tracking-wider">Stories</div>
                {storyResults.map((result, index) => {
                  const adjustedIndex = nameResults.length + index;
                  const categoryStyle = getCategoryStyle(result.category);

                  return (
                    <button
                      key={result._id || result.story_id}
                      onClick={() => handleResultClick(result, 'story')}
                      className="w-full px-5 py-4 flex items-start gap-3 active:bg-purple-50 transition-all duration-300"
                    >
                      <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${categoryStyle.gradient} flex items-center justify-center shadow-lg`}>
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-bold text-base text-gray-900 line-clamp-1">
                            {highlightText(result.title, query)}
                          </h3>
                          <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2 mt-1">{result.trailer || result.description}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 font-medium">
                          <span className="px-3 py-1.5 bg-gray-100 rounded-lg">{result.category}</span>
                          {result.read_time_minutes && (
                            <span className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-lg">
                              <Clock className="w-3.5 h-3.5" />
                              {result.read_time_minutes}m
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {hasResults && (
              <button
                onClick={() => window.location.href = `/search/${encodeURIComponent(query.trim())}`}
                className="w-full px-5 py-5 text-base text-blue-600 font-bold active:bg-blue-50 transition-all duration-300 border-t border-gray-100"
              >
                View all results for "{query}"
              </button>
            )}
            
            <div className="h-safe-area-inset-bottom" />
          </div>
        </>
      )}

      <style jsx global>{`
        @keyframes slide-in-from-top-2 {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-in-from-bottom {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        
        .animate-in {
          animation-fill-mode: both;
        }
        
        .fade-in {
          animation-name: fadeIn;
          animation-duration: 300ms;
        }
        
        .slide-in-from-top-2 {
          animation-name: slide-in-from-top-2;
        }
        
        .slide-in-from-bottom {
          animation-name: slide-in-from-bottom;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .h-safe-area-inset-bottom {
          height: env(safe-area-inset-bottom, 20px);
        }
      `}</style>
    </div>
  );
});

SearchBar.displayName = 'SearchBar';

export default SearchBar;