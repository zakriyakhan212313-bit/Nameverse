'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Globe, Heart, Award, BookOpen, Languages, CheckCircle, Star, Lock, ArrowRight, TrendingUp, ChevronDown, X } from 'lucide-react';
import SearchSection from './SearchSection';

// Memoized mobile-optimized category button
const CategoryCard = React.memo(({ category, isExpanded, onToggle, isMobile }) => {
  const Icon = category.icon;

  if (isMobile) {
    return (
      <motion.button
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle();
          }
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`relative w-full flex flex-col items-center justify-center gap-2 p-4 bg-white rounded-2xl border-2 transition-all duration-300 ${
          isExpanded
            ? `border-indigo-500 shadow-lg bg-indigo-50`
            : 'border-gray-200 shadow-md hover:border-indigo-300 hover:shadow-lg'
        }`}
        aria-expanded={isExpanded}
        aria-label={`${category.name} names - ${category.count} available`}
      >
        <div
          className={`bg-gradient-to-br ${category.gradient} p-3 rounded-xl text-white transition-all duration-300 ${
            isExpanded ? 'scale-110 shadow-lg' : 'shadow-md'
          }`}
        >
          <Icon className="w-6 h-6" aria-hidden="true" />
        </div>
        <div className="text-center min-h-14 flex flex-col justify-center">
          <span className="text-sm font-bold text-gray-900 block leading-tight">{category.name}</span>
          <span className="text-xs font-bold text-indigo-600 block mt-0.5">{category.count}</span>
        </div>
        {isExpanded && (
          <ChevronDown className="w-4 h-4 text-gray-400 rotate-180 transition-transform" aria-hidden="true" />
        )}
      </motion.button>
    );
  }

  // Desktop version
  return (
    <a
      href={category.url}
      className="group relative flex flex-col items-center gap-4 p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 hover:border-indigo-200 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2"
      aria-label={`Explore ${category.name} names - ${category.count} available`}
    >
      <div className={`bg-gradient-to-br ${category.gradient} p-4 rounded-xl text-white shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-3`}>
        <Icon className="w-8 h-8" aria-hidden="true" />
      </div>
      <div className="text-center">
        <h3 className="text-lg font-bold text-gray-900 mb-1">{category.name} Names</h3>
        <p className="text-base font-bold text-indigo-600 mb-2">{category.count}</p>
        <p className="text-sm text-gray-600 leading-relaxed">{category.description}</p>
      </div>
      <div className="flex items-center gap-2 mt-auto opacity-0 group-hover:opacity-100 transition-all duration-300">
        <span className="text-sm font-bold text-indigo-600">Explore</span>
        <ArrowRight className="w-4 h-4 text-indigo-600" aria-hidden="true" />
      </div>
    </a>
  );
});

CategoryCard.displayName = 'CategoryCard';

// Mobile-optimized category details
const CategoryDetails = React.memo(({ category, onClose }) => {
  const Icon = category.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 10 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="mt-3 rounded-2xl"
      role="region"
      aria-live="polite"
    >
      <div className={`${category.bgAccent} border-2 border-indigo-300 rounded-2xl p-4 shadow-xl`}>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className={`bg-gradient-to-br ${category.gradient} p-3 rounded-lg text-white flex-shrink-0`}>
              <Icon className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="text-left">
              <h3 className="text-base font-bold text-gray-900">{category.name} Names</h3>
              <p className="text-xs font-bold text-indigo-600">{category.count} available</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white rounded-lg transition-colors flex-shrink-0"
            aria-label="Close"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        <p className="text-xs text-gray-700 mb-4 leading-relaxed line-clamp-2">{category.description}</p>
        <a
          href={category.url}
          className={`flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r ${category.hoverGradient} text-white font-bold rounded-lg text-sm transition-all duration-300 hover:shadow-lg`}
        >
          <span>Explore {category.name}</span>
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </a>
      </div>
    </motion.div>
  );
});

CategoryDetails.displayName = 'CategoryDetails';

// Main Hero Component
const Hero = () => {
  const prefersReducedMotion = useReducedMotion();
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [screenSize, setScreenSize] = useState({ isMobile: false, isTablet: false, isClient: false });

  // Animation variants
  const containerVariants = useMemo(
    () => ({
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: prefersReducedMotion ? 0 : 0.05, delayChildren: 0.1 }
      }
    }),
    [prefersReducedMotion]
  );

  const itemVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    }),
    [prefersReducedMotion]
  );

  // Categories - Removed Global
  const categories = useMemo(
    () => [
      {
        id: 'islamic',
        name: 'Islamic',
        icon: Globe,
        gradient: 'from-emerald-500 to-teal-600',
        hoverGradient: 'from-emerald-600 to-teal-700',
        url: '/names/islamic',
        count: '25K+',
        description: 'Arabic & Quranic names',
        bgAccent: 'bg-emerald-50'
      },
      {
        id: 'hindu',
        name: 'Hindu',
        icon: Heart,
        gradient: 'from-orange-500 to-red-600',
        hoverGradient: 'from-orange-600 to-red-700',
        url: '/names/hindu',
        count: '20K+',
        description: 'Sanskrit & Hindi names',
        bgAccent: 'bg-orange-50'
      },
      {
        id: 'christian',
        name: 'Christian',
        icon: Award,
        gradient: 'from-blue-500 to-indigo-600',
        hoverGradient: 'from-blue-600 to-indigo-700',
        url: '/names/christian',
        count: '15K+',
        description: 'Biblical & European names',
        bgAccent: 'bg-blue-50'
      }
    ],
    []
  );

  // Stats
  const stats = useMemo(
    () => [
      { number: '60K+', label: 'Names', icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-50' },
      { number: '15+', label: 'Languages', icon: Languages, color: 'text-emerald-600', bg: 'bg-emerald-50' },
      { number: '99%', label: 'Verified', icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-50' }
    ],
    []
  );

  // Trust indicators
  const trustIndicators = useMemo(
    () => [
      { icon: Star, text: 'Verified Meanings', color: 'text-amber-600', bg: 'bg-amber-50' },
      { icon: Lock, text: 'Privacy First', color: 'text-blue-600', bg: 'bg-blue-50' },
      { icon: TrendingUp, text: '1M+ Happy Parents', color: 'text-emerald-600', bg: 'bg-emerald-50' }
    ],
    []
  );

  // Screen size detection
  useEffect(() => {
    const checkScreenSize = () => {
      const width = typeof window !== 'undefined' ? window.innerWidth : 1920;
      setScreenSize({
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isClient: true
      });
    };

    if (typeof window !== 'undefined') {
      checkScreenSize();
      window.addEventListener('resize', checkScreenSize, { passive: true });
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', checkScreenSize);
      }
    };
  }, []);

  // Handlers
  const handleCategoryToggle = useCallback((categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  }, [expandedCategory]);

  const handleCategoryClose = useCallback(() => {
    setExpandedCategory(null);
  }, []);

  const expandedCategoryData = categories.find((c) => c.id === expandedCategory);

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-100/40 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl opacity-20" />
      </div>

      <main className="relative z-10 w-full px-4 sm:px-6 py-8 sm:py-12 md:py-16">
        <motion.div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 md:space-y-12" variants={containerVariants} initial="hidden" animate="visible">
          {/* Trust badge */}
          <motion.div variants={itemVariants} className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/95 backdrop-blur-md border border-indigo-100 rounded-full shadow-lg hover:shadow-xl transition-all">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" aria-hidden="true" />
              <span className="text-xs sm:text-sm font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Trusted by 1M+ Parents
              </span>
            </div>
          </motion.div>

          {/* Main heading */}
          <motion.div variants={itemVariants} className="space-y-3 sm:space-y-4 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight">
              Find the Perfect
              <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mt-2">
                Baby Boy and Girl Name with Verified Meanings
              </span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Explore over 60,000 unique and authentic baby names from Islamic, Hindu, and Christian traditions. Discover each name's meaning, origin, and cultural story to choose the perfect baby name that reflects your family's heritage and love.
            </p>
          </motion.div>

          {/* Trust indicators - Mobile optimized */}
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {trustIndicators.map((indicator, index) => {
              const Icon = indicator.icon;
              return (
                <div
                  key={index}
                  className={`inline-flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 ${indicator.bg} rounded-lg text-xs sm:text-sm font-semibold border border-transparent hover:border-gray-200 transition-all`}
                >
                  <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${indicator.color}`} aria-hidden="true" />
                  <span className="text-gray-800">{indicator.text}</span>
                </div>
              );
            })}
          </motion.div>

          {/* Search Section - Visible on tablet and desktop */}
          <motion.div variants={itemVariants}>
            <SearchSection isMobile={screenSize.isMobile} />
          </motion.div>

          {/* Categories - Clean mobile layout with 3 items */}
          <motion.div variants={itemVariants} className="max-w-full">
            <h2 className="sr-only">Browse Baby Names by Category</h2>

            {/* Mobile & Tablet */}
            {screenSize.isClient && (screenSize.isMobile || screenSize.isTablet) && (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  {categories.map((category) => (
                    <div key={category.id} className="relative">
                      <CategoryCard
                        category={category}
                        isExpanded={expandedCategory === category.id}
                        onToggle={() => handleCategoryToggle(category.id)}
                        isMobile={true}
                      />
                      <AnimatePresence>
                        {expandedCategory === category.id && (
                          <div className="col-span-3 mt-3">
                            <CategoryDetails category={category} onClose={handleCategoryClose} />
                          </div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Desktop */}
            {screenSize.isClient && !screenSize.isMobile && !screenSize.isTablet && (
              <div className="grid grid-cols-3 gap-6 max-w-4xl mx-auto">
                {categories.map((category) => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    isExpanded={false}
                    onToggle={() => {}}
                    isMobile={false}
                  />
                ))}
              </div>
            )}
          </motion.div>

          {/* Stats */}
          <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3 sm:gap-6 max-w-2xl mx-auto pt-4 sm:pt-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className={`inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 ${stat.bg} rounded-lg sm:rounded-xl mb-2 sm:mb-3`}>
                    <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} aria-hidden="true" />
                  </div>
                  <div className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900">{stat.number}</div>
                  <div className="text-xs sm:text-sm font-medium text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </motion.div>

          {/* CTA Button - Full width on mobile */}
          <motion.div variants={itemVariants} className="flex gap-3 justify-center pt-4">
            <a href="/names/islamic" className="flex-1 sm:flex-none">
              <button className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg transition-all text-sm sm:text-base">
                Browse Names
              </button>
            </a>
            <a href="/stories" className="flex-1 sm:flex-none">
              <button className="w-full px-6 py-3 border-2 border-gray-300 text-gray-900 font-bold rounded-lg hover:border-gray-400 transition-all text-sm sm:text-base">
                Stories
              </button>
            </a>
          </motion.div>
        </motion.div>
      </main>
    </section>
  );
};

export default Hero;