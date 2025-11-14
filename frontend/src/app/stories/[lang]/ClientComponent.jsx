'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const LANGUAGES = [
  { code: 'english', label: 'English', flag: '🇺🇸' },
  { code: 'hindi', label: 'हिन्दी', flag: '🇮🇳' },
  { code: 'spanish', label: 'Español', flag: '🇪🇸' },
  { code: 'french', label: 'Français', flag: '🇫🇷' },
  { code: 'german', label: 'Deutsch', flag: '🇩🇪' },
];

export default function StoryClient({ storyData, slug, lang }) {
  const router = useRouter();
  const [activeChapter, setActiveChapter] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  if (!storyData || typeof storyData !== "object") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="text-6xl mb-6">📚</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Story Not Found</h1>
          <p className="text-gray-600 mb-6">Sorry, this story is not available.</p>
          <button
            onClick={() => router.push('/stories')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold transition-colors hover:bg-blue-700"
          >
            Browse Stories →
          </button>
        </div>
      </main>
    );
  }

  const { translation = {}, ...meta } = storyData;
  const sortedChapters = useMemo(
    () => Array.isArray(translation.chapters)
      ? [...translation.chapters].sort((a, b) => a.order - b.order)
      : [],
    [translation.chapters]
  );

  useEffect(() => {
    if (sortedChapters.length > 0) {
      setActiveChapter(sortedChapters[0].chapter_id);
    }
  }, [sortedChapters]);

  // Scroll tracking
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.scrollY;
          const height = document.documentElement.scrollHeight - window.innerHeight;
          setReadingProgress((scrolled / height) * 100);
          setShowScrollTop(scrolled > 400);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Chapter intersection observer
  useEffect(() => {
    if (!Array.isArray(sortedChapters) || sortedChapters.length === 0) return;

    const observerOptions = {
      rootMargin: '-10% 0px -70% 0px',
      threshold: 0,
    };

    const observer = new window.IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveChapter(entry.target.id);
      });
    }, observerOptions);

    sortedChapters.forEach((chapter) => {
      const element = document.getElementById(chapter.chapter_id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [sortedChapters]);

  const changeLanguage = useCallback((newLang) => {
    const storyId = storyData?.story_id || slug;
    
    if (!storyId || storyId === 'undefined' || storyId === 'null') {
      console.error('Invalid story ID:', { storyId, slug });
      alert('Error: Cannot change language. Story ID not found.');
      setShowLangDropdown(false);
      return;
    }
    
    const newPath = `/stories/${newLang}/${storyId}`;
    router.push(newPath);
    setShowLangDropdown(false);
  }, [router, slug, storyData]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const scrollToChapter = useCallback((chapterId) => {
    const element = document.getElementById(chapterId);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: elementPosition, behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  }, []);

  const navigateToChapterPage = useCallback((chapterId) => {
    const cleanChapterId = chapterId.replace(/^chapterid:/, '').replace(/[;:]/g, '');
    const storyId = storyData?.story_id || slug;
    router.push(`/stories/${lang}/${storyId}/chapters/${cleanChapterId}`);
  }, [lang, slug, router, storyData]);

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: translation.seo_title,
          text: translation.seo_meta_description,
          url: window.location.href,
        });
      } catch (err) {
        if (err.name !== 'AbortError') console.log('Share cancelled');
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      } catch (err) {
        console.log('Copy failed');
      }
    }
  }, [translation.seo_title, translation.seo_meta_description]);

  const getDifficultyColor = useCallback((level) => {
    const colors = {
      easy: 'bg-emerald-100 text-emerald-700 border border-emerald-300',
      medium: 'bg-amber-100 text-amber-700 border border-amber-300',
      hard: 'bg-red-100 text-red-700 border border-red-300',
    };
    return colors[level] || colors.easy;
  }, []);

  const currentLang = useMemo(
    () => LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0],
    [lang]
  );
  
  const coverImagePath = translation?.cover_image
    ? `/${translation.cover_image}.jpg`
    : '/default-cover.jpg';

  return (
    <article className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-slate-200 z-50">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"
          style={{ width: `${readingProgress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-slate-200 z-40 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg transition-colors hover:bg-slate-100"
            aria-label="Go back"
          >
            <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-sm font-bold text-slate-900 line-clamp-1 flex-1 mx-4">{translation.title}</h2>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg transition-colors hover:bg-slate-100"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="lg:hidden fixed inset-0 bg-white z-50 pt-16 overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900">Chapters</h3>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg transition-colors hover:bg-slate-100"
                  aria-label="Close menu"
                >
                  <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <nav className="space-y-2">
                {sortedChapters.map((chapter) => (
                  <button
                    key={chapter.chapter_id}
                    onClick={() => scrollToChapter(chapter.chapter_id)}
                    className={`w-full text-left py-3 px-4 rounded-lg transition-colors ${
                      activeChapter === chapter.chapter_id
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className={`flex-shrink-0 w-7 h-7 rounded-full text-xs flex items-center justify-center font-bold ${
                        activeChapter === chapter.chapter_id ? 'bg-white text-blue-600' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {chapter.order}
                      </span>
                      <span className="flex-1">{chapter.title}</span>
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section - Modern Clean Design */}
      <section className="relative pt-20 lg:pt-0 lg:py-24 overflow-hidden">
        {/* Background with better visibility */}
        <div className="absolute inset-0 z-0">
          <Image
            src={coverImagePath}
            alt=""
            fill
            priority
            quality={95}
            className="object-cover"
            style={{ filter: 'brightness(0.4)' }}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-900/70 to-blue-900/80" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-20 lg:py-32 z-10">
          <div className="text-center space-y-8">
            {/* Language Picker - Simple */}
            <div className="flex justify-center">
              <button
                onClick={() => setShowLangDropdown(!showLangDropdown)}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg border border-white/20 text-white text-sm font-medium transition-colors hover:bg-white/20"
              >
                <span className="text-lg">{currentLang.flag}</span>
                <span>{currentLang.label}</span>
                <svg className={`w-4 h-4 transition-transform ${showLangDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <AnimatePresence>
                {showLangDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="fixed lg:absolute top-28 lg:top-auto lg:mt-2 left-4 right-4 lg:left-auto lg:right-auto lg:min-w-[200px] bg-white rounded-lg shadow-2xl overflow-hidden z-50 max-h-[400px] overflow-y-auto"
                  >
                    {LANGUAGES.map((language) => (
                      <button
                        key={language.code}
                        onClick={() => changeLanguage(language.code)}
                        className={`w-full px-4 py-3 flex items-center gap-2 text-sm font-medium transition-colors ${
                          language.code === lang ? 'bg-blue-600 text-white' : 'hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <span className="text-lg">{language.flag}</span>
                        <span>{language.label}</span>
                        {language.code === lang && (
                          <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Meta Badges */}
            <div className="flex flex-wrap justify-center gap-2">
              <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium text-white border border-white/20">
                {meta.category}
              </span>
              <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium text-white border border-white/20">
                ⭐ {meta.rating}
              </span>
              <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium text-white border border-white/20">
                👁 {(meta.views || 0).toLocaleString()}
              </span>
              {meta.tags?.slice(0, 2).map((tag, i) => (
                <span key={i} className="px-3 py-1 bg-blue-500/20 rounded-full text-xs font-medium text-white border border-white/20">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              {translation.title}
            </h1>

            {/* Subtitle */}
            {translation.subtitle && (
              <p className="text-lg lg:text-xl text-slate-200 max-w-3xl mx-auto">
                {translation.subtitle}
              </p>
            )}

            {/* Meta Info */}
            <div className="flex flex-wrap justify-center gap-6">
              <div className="text-white">
                <p className="text-sm font-medium flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {meta.author}
                </p>
              </div>
              <div className="text-white">
                <p className="text-sm font-medium flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {meta.read_time_minutes} min read
                </p>
              </div>
              <div className={`px-3 py-1 rounded-lg font-medium text-sm ${getDifficultyColor(meta.difficulty_level)}`}>
                {meta.difficulty_level?.toUpperCase()}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <button
                onClick={() => scrollToChapter(sortedChapters[0]?.chapter_id)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold transition-colors hover:bg-blue-700"
              >
                Start Reading
              </button>
              <button
                onClick={handleShare}
                className="px-6 py-3 bg-white/10 text-white rounded-lg font-semibold border border-white/20 transition-colors hover:bg-white/20"
              >
                Share
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Clean Modern Design */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-lg border border-slate-200 p-5 shadow-lg">
              <h2 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wide">
                Table of Contents
              </h2>
              <nav className="space-y-1 max-h-[600px] overflow-y-auto custom-scrollbar">
                {sortedChapters.map((chapter) => (
                  <button
                    key={chapter.chapter_id}
                    onClick={() => scrollToChapter(chapter.chapter_id)}
                    className={`w-full text-left py-2.5 px-3 text-sm rounded-md transition-colors ${
                      activeChapter === chapter.chapter_id
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <span className={`flex-shrink-0 w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold ${
                        activeChapter === chapter.chapter_id ? 'bg-white text-blue-600' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {chapter.order}
                      </span>
                      <span className="flex-1 leading-snug">{chapter.title}</span>
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3 space-y-8">
            {/* Trailer Section - Clean */}
            <section className="bg-blue-50 rounded-lg border border-blue-200 p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="font-bold text-slate-900 text-lg mb-3">Story Overview</h2>
                  <p className="text-slate-700 leading-relaxed">{translation.trailer}</p>
                </div>
              </div>
            </section>

            {/* Chapters Section - Clean Cards */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Chapters</h2>
              {sortedChapters.map((chapter) => (
                <article
                  key={chapter.chapter_id}
                  id={chapter.chapter_id}
                  className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm transition-shadow hover:shadow-md scroll-mt-28"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                      {chapter.order}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900 mb-3">{chapter.title}</h3>
                      <div className="flex items-center gap-3 flex-wrap text-xs text-slate-600">
                        <span className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          {chapter.word_count} words
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {Math.ceil(chapter.word_count / 200)} min read
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-700 leading-relaxed mb-4">{chapter.summary}</p>
                  <button
                    onClick={() => navigateToChapterPage(chapter.chapter_id)}
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-semibold transition-colors hover:bg-blue-700"
                  >
                    Read Chapter
                  </button>
                </article>
              ))}
            </section>

            {/* FAQ Section - Clean Design */}
            {translation.faq?.length > 0 && (
              <section className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm mt-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  {translation.faq.map((faq, index) => (
                    <article
                      key={index}
                      className="border border-slate-200 rounded-lg p-5 bg-slate-50"
                    >
                      <h3 className="font-bold text-slate-900 mb-2 text-base">
                        Q: {faq.q}
                      </h3>
                      <p className="text-slate-700 leading-relaxed">
                        A: {faq.a}
                      </p>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* Action Buttons - Clean Footer */}
            <div className="flex flex-wrap gap-3 p-5 bg-slate-50 rounded-lg border border-slate-200">
              <button
                onClick={handleShare}
                className="flex-1 min-w-[180px] px-5 py-3 bg-blue-600 text-white rounded-lg font-semibold transition-colors hover:bg-blue-700"
              >
                Share Story
              </button>
              <button
                onClick={scrollToTop}
                className="flex-1 min-w-[180px] px-5 py-3 bg-white text-slate-900 rounded-lg font-semibold border border-slate-300 transition-colors hover:bg-slate-50"
              >
                Back to Top
              </button>
            </div>

            {/* Story Metadata Footer */}
            <div className="p-5 bg-white rounded-lg border border-slate-200 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-slate-600">
                <span>📅 Published: {new Date(meta.publishedAt).toLocaleDateString()}</span>
                <span>👁 {(meta.views || 0).toLocaleString()} views</span>
                <span>❤️ {(meta.likes || 0).toLocaleString()} likes</span>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Floating Scroll to Top Button - Clean */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            onClick={scrollToTop}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-8 right-8 w-14 h-14 bg-blue-600 text-white rounded-lg shadow-lg flex items-center justify-center transition-colors hover:bg-blue-700 z-40"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #3b82f6;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #2563eb;
        }
      `}</style>
    </article>
  );
}