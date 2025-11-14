"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Eye, Heart, Bookmark, TrendingUp, Flame, ChevronLeft, ChevronRight } from "lucide-react";

const AUTO_PLAY_INTERVAL = 5000;
const SWIPE_THRESHOLD = 50;

export default function StorySliderUI({ popularStories = [], trendingStories = [] }) {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("popular");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoPlaying, setAutoPlaying] = useState(true);
  const [imageError, setImageError] = useState(new Set());
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const sliderRef = useRef(null);
  const timerRef = useRef(null);

  const stories = useMemo(
    () => (activeTab === "popular" ? popularStories : trendingStories),
    [activeTab, popularStories, trendingStories]
  );
  
  const currentStory = useMemo(
    () => (stories.length ? stories[currentSlide % stories.length] : null),
    [stories, currentSlide]
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !autoPlaying || stories.length < 2) return;
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % stories.length);
    }, AUTO_PLAY_INTERVAL);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [autoPlaying, stories.length, mounted]);

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    setCurrentSlide(0);
    setAutoPlaying(true);
    setImageError(new Set());
  }, []);

  const handleGoToSlide = useCallback((idx) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(idx);
    setAutoPlaying(false);
    setTimeout(() => setIsTransitioning(false), 300);
  }, [isTransitioning]);

  const handlePrevSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((s) => (s === 0 ? stories.length - 1 : s - 1));
    setAutoPlaying(false);
    setTimeout(() => setIsTransitioning(false), 300);
  }, [stories.length, isTransitioning]);

  const handleNextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((s) => (s + 1) % stories.length);
    setAutoPlaying(false);
    setTimeout(() => setIsTransitioning(false), 300);
  }, [stories.length, isTransitioning]);

  const handleTouchStart = useCallback((e) => {
    setTouchStart(e.touches[0].clientX);
    setAutoPlaying(false);
  }, []);

  const handleTouchMove = useCallback((e) => {
    setTouchEnd(e.touches[0].clientX);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isSwipe = Math.abs(distance) > SWIPE_THRESHOLD;
    
    if (isSwipe) {
      if (distance > 0) {
        handleNextSlide();
      } else {
        handlePrevSlide();
      }
    }
    
    setTouchStart(0);
    setTouchEnd(0);
  }, [touchStart, touchEnd, handleNextSlide, handlePrevSlide]);

  const handleImageError = useCallback((storyId) => {
    setImageError((prev) => new Set(prev).add(storyId));
  }, []);

  const navigateToStory = useCallback((e, storyId) => {
    e.stopPropagation();
    if (storyId) {
      window.location.href = `/stories/${storyId}`;
    }
  }, []);

  if (!mounted) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-6">
        <div className="bg-slate-200 rounded-2xl h-[500px] animate-pulse" />
      </div>
    );
  }

  if (!stories.length) return null;

  const coverImageUrl = currentStory?.thumbnail_image
    ? `${currentStory.thumbnail_image}.jpg`
    : "/default-cover.jpg";

  return (
    <section 
      ref={sliderRef}
      className="w-full max-w-7xl mx-auto px-4 py-6 lg:py-8"
      aria-label="Featured Stories Carousel"
    >
      {/* Tab Switcher - Mobile Optimized */}
      <div className="flex items-center justify-center gap-3 mb-5">
        <button
          onClick={() => handleTabChange("popular")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all ${
            activeTab === "popular"
              ? "bg-gradient-to-r from-orange-500 to-pink-600 text-white shadow-lg"
              : "bg-white text-slate-700 border border-slate-200"
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>Popular</span>
        </button>
        <button
          onClick={() => handleTabChange("trending")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all ${
            activeTab === "trending"
              ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg"
              : "bg-white text-slate-700 border border-slate-200"
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Trending</span>
        </button>
      </div>

      {/* Main Slider */}
      <div 
        className="relative rounded-2xl overflow-hidden shadow-xl"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Background Image */}
        <div className="absolute inset-0 bg-slate-900">
          {!imageError.has(currentStory?._id) ? (
            <img
              src={coverImageUrl}
              alt=""
              className="w-full h-full object-cover"
              style={{ filter: "brightness(0.35)" }}
              loading="eager"
              onError={() => handleImageError(currentStory?._id)}
            />
          ) : (
            <div 
              className="w-full h-full"
              style={{ backgroundColor: currentStory?.theme_color || "#1e293b" }}
            />
          )}
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Content */}
        <div className="relative z-10 min-h-[450px] lg:min-h-[500px] flex flex-col justify-between p-5 lg:p-8">
          {/* Top Section - Category Badge */}
          <div className="flex justify-between items-start">
            <span
              className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase text-white"
              style={{
                background: currentStory?.theme_color || "#1e293b",
              }}
            >
              {currentStory?.category}
            </span>
          </div>

          {/* Middle Section - Main Content */}
          <div className="flex-1 flex items-end pb-6 lg:pb-8">
            <div className="max-w-2xl w-full space-y-3 lg:space-y-4">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                {currentStory?.title}
              </h1>
              
              <p className="text-sm md:text-base text-slate-200 line-clamp-2 leading-relaxed">
                {currentStory?.subtitle}
              </p>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm">
                <div className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  <span className="font-semibold">{(currentStory?.views || 0).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Heart className="w-4 h-4 fill-pink-500 text-pink-500" />
                  <span className="font-semibold">{(currentStory?.likes || 0).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Bookmark className="w-4 h-4" />
                  <span className="font-semibold">{(currentStory?.bookmarks || 0).toLocaleString()}</span>
                </div>
                <div className="px-2.5 py-1 bg-amber-400 rounded-full text-black text-xs font-bold flex items-center gap-1">
                  ⭐ {currentStory?.rating || 0}
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={(e) => navigateToStory(e, currentStory?.story_id)}
                className="inline-block px-6 py-3 mt-2 rounded-lg bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all active:scale-95"
              >
                Read Story →
              </button>
            </div>
          </div>

          {/* Bottom Section - Navigation */}
          <div className="flex items-center justify-between">
            {/* Desktop Arrow Buttons */}
            <button
              onClick={handlePrevSlide}
              className="hidden lg:flex items-center justify-center w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-sm"
              aria-label="Previous story"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>

            {/* Dot Indicators */}
            <div className="flex items-center justify-center gap-2 mx-auto lg:mx-0">
              {stories.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleGoToSlide(idx)}
                  disabled={isTransitioning}
                  className={`rounded-full transition-all ${
                    idx === currentSlide
                      ? "bg-white w-8 h-2"
                      : "bg-white/40 w-2 h-2 hover:bg-white/60"
                  }`}
                  aria-label={`Go to story ${idx + 1}`}
                  aria-current={idx === currentSlide ? "true" : "false"}
                />
              ))}
            </div>

            {/* Desktop Arrow Buttons */}
            <button
              onClick={handleNextSlide}
              className="hidden lg:flex items-center justify-center w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-sm"
              aria-label="Next story"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Mobile Swipe Indicator */}
        <div className="lg:hidden absolute bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-black/30 backdrop-blur-sm rounded-full">
          <span className="text-white/60 text-xs">Swipe to explore</span>
          <div className="flex gap-1">
            <div className="w-1 h-1 bg-white/60 rounded-full animate-pulse" />
            <div className="w-1 h-1 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }} />
            <div className="w-1 h-1 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }} />
          </div>
        </div>
      </div>

      {/* Thumbnail Grid - Desktop Only */}
      <div className="hidden lg:grid grid-cols-5 gap-4 mt-6">
        {stories.map((story, idx) => (
          <button
            key={story?._id || idx}
            onClick={(e) => {
              e.preventDefault();
              handleGoToSlide(idx);
            }}
            className={`group relative rounded-lg overflow-hidden transition-all ${
              idx === currentSlide
                ? "ring-2 ring-pink-500 shadow-lg shadow-pink-500/30"
                : "ring-1 ring-slate-200 hover:ring-slate-300"
            }`}
          >
            <div className="aspect-video bg-slate-200 overflow-hidden">
              {!imageError.has(story?._id) ? (
                <img
                  src={`${story?.thumbnail_image || "default"}.jpg`}
                  alt={story?.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                  onError={() => handleImageError(story?._id)}
                />
              ) : (
                <div 
                  className="w-full h-full flex items-center justify-center text-2xl"
                  style={{ backgroundColor: story?.theme_color || "#6366f1" }}
                >
                  📖
                </div>
              )}
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-white text-xs font-semibold line-clamp-2">
                  {story?.title}
                </p>
              </div>
            </div>
            
            {idx === currentSlide && (
              <div className="absolute top-2 right-2 w-2 h-2 bg-pink-500 rounded-full animate-pulse" />
            )}
          </button>
        ))}
      </div>

      {/* Mobile Story Preview Cards - Below Slider */}
      <div className="lg:hidden mt-6 space-y-3">
        <h3 className="text-lg font-bold text-slate-900 px-1">
          More {activeTab === "popular" ? "Popular" : "Trending"} Stories
        </h3>
        <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory hide-scrollbar">
          {stories.filter((_, idx) => idx !== currentSlide).slice(0, 5).map((story, idx) => (
            <button
              key={story?._id || idx}
              onClick={(e) => navigateToStory(e, story?.story_id)}
              className="flex-shrink-0 w-40 snap-start"
            >
              <div className="bg-white rounded-lg overflow-hidden shadow-md border border-slate-200">
                <div className="aspect-video bg-slate-200 overflow-hidden">
                  {!imageError.has(story?._id) ? (
                    <img
                      src={`${story?.thumbnail_image || "default"}.jpg`}
                      alt={story?.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={() => handleImageError(story?._id)}
                    />
                  ) : (
                    <div 
                      className="w-full h-full flex items-center justify-center text-2xl"
                      style={{ backgroundColor: story?.theme_color || "#6366f1" }}
                    >
                      📖
                    </div>
                  )}
                </div>
                <div className="p-2">
                  <p className="text-sm font-semibold text-slate-900 line-clamp-2 leading-snug">
                    {story?.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {(story?.views || 0).toLocaleString()}
                    </span>
                    <span>⭐ {story?.rating || 0}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}