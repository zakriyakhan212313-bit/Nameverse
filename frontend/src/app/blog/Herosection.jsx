"use client";
import React, { useState, useRef, useEffect } from "react";
import { Search, ArrowRight, X, ChevronDown, Filter } from "lucide-react";

const CIRCLE_STYLES = [
  { className: "absolute top-10 left-10 w-28 h-28 bg-blue-800/20 rounded-full blur-2xl" },
  { className: "absolute bottom-8 right-8 w-32 h-32 bg-indigo-600/15 rounded-full blur-3xl" },
  { className: "absolute top-1/3 left-1/2 w-24 h-24 bg-cyan-500/20 rounded-full blur-3xl" }
];

export default function HeroSection({
  article,
  categories = [],
  selected,
  onSelect,
  onSearch,
}) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!showDropdown) return;
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  // Handle search
  const handleSearch = () => {
    if (query.trim()) onSearch(query.trim());
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  // Handle category select
  const handleCategorySelect = (cat) => {
    onSelect(cat);
    setShowDropdown(false);
  };

  // Defensive: ensure array and content never undefined
  const uniqueCategories = Array.isArray(categories) ? [...new Set(categories)] : [];
  const stats = [
    { value: "1000+", label: "Articles", icon: "📚" },
    { value: `${uniqueCategories.length}+`, label: "Categories", icon: "🏷️" },
    { value: "100K+", label: "Readers", icon: "👥" },
    { value: "150+", label: "Countries", icon: "🌍" },
  ];

  // LOADING: block UI unless we have required data
  const isLoaded = article && uniqueCategories.length;

  return (
    <section className="relative w-full min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 text-white overflow-hidden">
      {/* Background: deterministic only */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.10),rgba(0,0,0,0))]" />
        {CIRCLE_STYLES.map((props, i) => (
          <div key={i} className={props.className} />
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 py-12 sm:px-6 md:py-16 lg:py-20 lg:px-8">
        {!isLoaded ? (
          // Render only static markup until client gets data (SSR won't mismatch on structure!)
          <div className="flex flex-col items-center justify-center min-h-[280px] animate-pulse space-y-5">
            <div className="h-8 w-2/3 bg-white/10 rounded-lg mb-2" />
            <div className="h-5 w-1/2 bg-white/10 rounded-lg" />
            <div className="h-12 w-full max-w-xl bg-white/5 rounded-lg mt-10" />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-6 sm:space-y-8 md:space-y-10">
            <div className="w-full max-w-3xl space-y-3 sm:space-y-4 text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-300 bg-clip-text text-transparent">
                  {article?.title ?? "Discover Insightful"}
                </span>
                <span className="block bg-gradient-to-r from-cyan-300 via-blue-200 to-purple-300 bg-clip-text text-transparent mt-2">
                  Articles and Ideas
                </span>
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
                {article?.excerpt ??
                  article?.subtitle ??
                  "Explore curated stories across every category. Your journey to knowledge starts here."}
              </p>
            </div>

            <div className="w-full max-w-2xl space-y-3">
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  type="button"
                  className="w-full flex items-center justify-between px-3.5 py-2.5 sm:px-4 sm:py-3 bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-lg border border-white/20 hover:border-white/30 transition-all duration-200 text-sm sm:text-base font-medium text-white/90"
                  aria-haspopup="listbox"
                  aria-expanded={showDropdown}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Filter className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-blue-400 flex-shrink-0" />
                    <span className="truncate">{selected || "All Categories"}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 sm:w-4.5 sm:h-4.5 text-white/60 transition-transform duration-200 flex-shrink-0 ${showDropdown ? "rotate-180" : ""}`} />
                </button>
                {showDropdown && uniqueCategories.length > 0 && (
                  <div 
                    className="absolute bottom-full left-0 right-0 mb-2 bg-slate-900/95 backdrop-blur-md rounded-lg border border-white/20 shadow-2xl max-h-64 overflow-y-auto z-50 divide-y divide-white/10"
                    role="listbox"
                  >
                    {uniqueCategories.map((cat, idx) => (
                      <button
                        key={`cat-${idx}`}
                        onClick={() => handleCategorySelect(cat)}
                        type="button"
                        role="option"
                        aria-selected={selected === cat}
                        className={`w-full text-left px-3.5 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base font-medium transition-colors duration-150 ${
                          selected === cat
                            ? "bg-blue-600/50 text-white"
                            : "text-white/80 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative group">
                <div
                  className={`relative flex items-center bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-lg border transition-all duration-200 ${
                    isFocused
                      ? "border-blue-400/60 bg-white/20"
                      : "border-white/20 hover:border-white/30"
                  }`}
                >
                  <Search className="absolute left-3.5 w-4 h-4 sm:w-4.5 sm:h-4.5 text-white/50 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 px-10 sm:px-12 py-2.5 sm:py-3 bg-transparent text-white text-sm sm:text-base placeholder-white/50 outline-none font-medium"
                    autoComplete="off"
                  />
                  {query && (
                    <button
                      onClick={() => setQuery("")}
                      type="button"
                      className="absolute right-12 sm:right-14 p-1 text-white/50 hover:text-white/80 transition-colors"
                      aria-label="Clear search"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={handleSearch}
                    type="button"
                    className="absolute right-1 px-2.5 sm:px-3.5 py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold text-xs sm:text-sm transition-all duration-200 active:scale-95 flex items-center gap-1.5 flex-shrink-0"
                    aria-label="Search"
                  >
                    <span className="hidden sm:inline">Search</span>
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-white/50 text-center">
                Trending: Baby Names, Parenting Tips, Cultural Stories
              </p>
            </div>

            <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-4 sm:pt-6">
              {stats.map((stat, i) => (
                <div
                  key={`stat-${i}`}
                  className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-lg bg-white/8 border border-white/10 hover:bg-white/12 hover:border-white/20 transition-colors duration-200"
                >
                  <span className="text-lg sm:text-2xl mb-1.5">
                    {stat.icon}
                  </span>
                  <p className="text-base sm:text-lg font-bold text-white">
                    {stat.value}
                  </p>
                  <p className="text-xs sm:text-sm text-white/60">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}