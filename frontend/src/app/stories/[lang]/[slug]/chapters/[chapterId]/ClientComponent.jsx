"use client";

import React, { useMemo, useState, useEffect, useCallback, useRef } from "react";
import { ArrowLeft, ChevronRight, ChevronLeft, List, X } from "lucide-react";

// Memoized utilities
const cleanChapterName = (chapterId) => {
  if (!chapterId) return "";
  return chapterId
    .split(":")[0]
    .replace(/-/g, " ")
    .replace(/\b\w/g, l => l.toUpperCase())
    .trim();
};

const sanitizeChapterId = (chapterId) => {
  if (!chapterId) return "";
  return chapterId
    .replace(/:/g, "-")
    .replace(/--+/g, "-")
    .replace(/^-|-$/g, "");
};

const LANG_LABELS = { english: "EN", hindi: "HI", spanish: "ES", french: "FR" };

const AVAILABLE_LANGUAGES = [
  { code: "english", label: "English", flag: "🇬🇧" },
  { code: "hindi", label: "हिंदी", flag: "🇮🇳" },
  { code: "spanish", label: "Español", flag: "🇪🇸" },
  { code: "french", label: "Français", flag: "🇫🇷" },
];

// Memoized Language Menu
const LanguageMenu = React.memo(({ showLangMenu, setShowLangMenu, langCode, getLanguageUrl }) => (
  <div className="relative">
    <button
      onClick={() => setShowLangMenu(!showLangMenu)}
      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
    >
      <span className="text-sm font-medium text-gray-700">{LANG_LABELS[langCode]}</span>
    </button>
    
    {showLangMenu && (
      <>
        <div className="fixed inset-0 z-40" onClick={() => setShowLangMenu(false)} />
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
          {AVAILABLE_LANGUAGES.map((lang) => (
            <a
              key={lang.code}
              href={getLanguageUrl(lang.code)}
              onClick={() => setShowLangMenu(false)}
              className={`flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors ${
                langCode === lang.code ? 'bg-gray-50' : ''
              }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <span className="text-sm text-gray-700">{lang.label}</span>
            </a>
          ))}
        </div>
      </>
    )}
  </div>
));

LanguageMenu.displayName = 'LanguageMenu';

// Memoized content formatter with lazy rendering
const ContentFormatter = React.memo(({ content }) => {
  const [visibleParagraphs, setVisibleParagraphs] = useState(new Set([0, 1, 2]));
  const contentRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        setVisibleParagraphs(prev => {
          const newSet = new Set(prev);
          entries.forEach((entry) => {
            const index = parseInt(entry.target.dataset.index || 0);
            if (entry.isIntersecting) {
              newSet.add(index);
            }
          });
          return newSet;
        });
      },
      { rootMargin: '100px' }
    );

    const elements = contentRef.current?.querySelectorAll('[data-index]');
    elements?.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const paragraphs = (content?.split("\n\n") || []);

  return (
    <div ref={contentRef}>
      {paragraphs.map((para, idx) => {
        const trimmed = para.trim();
        const isVisible = visibleParagraphs.has(idx);

        if (!isVisible && idx > 2) return null;

        if (trimmed.startsWith("###")) {
          return (
            <h3 key={idx} data-index={idx} className="text-2xl md:text-3xl font-bold text-gray-900 mt-12 mb-6 leading-tight">
              {trimmed.replace(/^#+\s*/, "").trim()}
            </h3>
          );
        }
        if (trimmed.startsWith("##")) {
          return (
            <h2 key={idx} data-index={idx} className="text-3xl md:text-4xl font-bold text-gray-900 mt-16 mb-8 leading-tight">
              {trimmed.replace(/^#+\s*/, "").trim()}
            </h2>
          );
        }
        if (trimmed.startsWith("#")) {
          return (
            <h3 key={idx} data-index={idx} className="text-xl md:text-2xl font-bold text-gray-900 mt-10 mb-5">
              {trimmed.replace(/^#+\s*/, "").trim()}
            </h3>
          );
        }
        return (
          <p key={idx} data-index={idx} className="text-gray-700 text-lg leading-relaxed mb-6">
            {trimmed}
          </p>
        );
      })}
    </div>
  );
});

ContentFormatter.displayName = 'ContentFormatter';

export default function ChapterClient({
  story,
  chapter,
  faq,
  navigation,
  storyId,
  chapterId,
  langCode = "english",
  currentLang = "english",
}) {
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showChapterMenu, setShowChapterMenu] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollTimeoutRef = useRef(null);

  const allChapterIds = navigation?.allChapterIds || [];
  const totalChapters = allChapterIds.length;
  const previousChapter = navigation?.previousChapter || null;
  const nextChapterData = navigation?.nextChapter || null;

  // Optimized scroll handler with throttling
  useEffect(() => {
    let rafId = null;
    let lastTime = 0;

    const handleScroll = () => {
      const now = Date.now();
      if (now - lastTime < 100) return; // Throttle to 100ms
      lastTime = now;

      if (rafId) cancelAnimationFrame(rafId);
      
      rafId = requestAnimationFrame(() => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.scrollY;
        const progress = documentHeight > 0 ? (scrolled / documentHeight) * 100 : 0;
        setScrollProgress(Math.min(progress, 100));
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true, capture: false });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const readTime = useMemo(
    () => Math.max(1, Math.ceil((chapter?.word_count || 0) / 200)),
    [chapter?.word_count]
  );

  const sanitizedChapterIds = useMemo(
    () => allChapterIds.map(sanitizeChapterId),
    [allChapterIds]
  );

  const sanitizedCurrentChapterId = useMemo(
    () => sanitizeChapterId(chapterId),
    [chapterId]
  );

  const currentIndex = useMemo(() => chapter?.order ? chapter.order - 1 : -1, [chapter?.order]);

  const nextChapter = useMemo(
    () => nextChapterData?.chapter_id ? sanitizeChapterId(nextChapterData.chapter_id) : null,
    [nextChapterData?.chapter_id]
  );

  const prevChapter = useMemo(
    () => previousChapter?.chapter_id ? sanitizeChapterId(previousChapter.chapter_id) : null,
    [previousChapter?.chapter_id]
  );

  const getChapterUrl = useCallback((targetChapterId) => {
    if (!targetChapterId || !storyId) return "#";
    const cleanChapter = sanitizeChapterId(targetChapterId);
    return currentLang === "english" 
      ? `/stories/${storyId}/chapters/${cleanChapter}`
      : `/stories/${currentLang}/${storyId}/chapters/${cleanChapter}`;
  }, [storyId, currentLang]);

  const getStoryUrl = useCallback(() => {
    if (!storyId) return "/stories";
    return currentLang === "english" 
      ? `/stories/${storyId}`
      : `/stories/${currentLang}/${storyId}`;
  }, [storyId, currentLang]);

  const getLanguageUrl = useCallback((targetLang) => {
    if (!storyId || !sanitizedCurrentChapterId) return "#";
    return targetLang === "english"
      ? `/stories/${storyId}/chapters/${sanitizedCurrentChapterId}`
      : `/stories/${targetLang}/${storyId}/chapters/${sanitizedCurrentChapterId}`;
  }, [storyId, sanitizedCurrentChapterId]);

  return (
    <div className="min-h-screen bg-white">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-100 z-50" style={{ contain: 'layout' }}>
        <div 
          className="h-full bg-blue-600 transition-all duration-300 will-change-transform"
          style={{ width: `${scrollProgress}%`, backfaceVisibility: 'hidden' }}
        />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <a href={getStoryUrl()} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors p-2 -m-2">
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline text-sm font-medium">Back</span>
            </a>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setShowChapterMenu(!showChapterMenu)}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-xs sm:text-sm"
              >
                <List className="w-4 h-4" />
                <span className="font-medium">{currentIndex + 1}/{totalChapters}</span>
              </button>
              
              <LanguageMenu 
                showLangMenu={showLangMenu}
                setShowLangMenu={setShowLangMenu}
                langCode={langCode}
                getLanguageUrl={getLanguageUrl}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Chapter Sidebar */}
      <div className={`fixed right-0 top-0 h-full w-72 sm:w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
        showChapterMenu ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Chapters</h3>
          <button onClick={() => setShowChapterMenu(false)} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="overflow-y-auto h-[calc(100%-72px)] p-4 space-y-2">
          {sanitizedChapterIds.map((id, i) => {
            const isActive = id === sanitizedCurrentChapterId;
            return (
              <a
                key={id}
                href={getChapterUrl(id)}
                onClick={() => setShowChapterMenu(false)}
                className={`block rounded-lg transition-all p-4 flex items-start gap-3 ${
                  isActive ? "bg-blue-600 text-white shadow-md" : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className={`flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center text-sm font-bold ${
                  isActive ? "bg-white/20" : "bg-gray-200"
                }`}>
                  {i + 1}
                </div>
                <p className="font-medium text-sm leading-snug">{cleanChapterName(allChapterIds[i])}</p>
              </a>
            );
          })}
        </div>
      </div>

      {showChapterMenu && <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setShowChapterMenu(false)} />}

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-8">
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center gap-3 text-xs sm:text-sm flex-wrap">
            <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full font-medium">{story?.category}</span>
            {story?.sub_category && <span className="text-gray-500">{story.sub_category}</span>}
            <span className="text-gray-400">•</span>
            <span className="text-gray-500">{readTime} min read</span>
          </div>
          
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            {chapter?.title}
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-3xl">
            {chapter?.summary}
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <article className="prose prose-sm sm:prose-lg max-w-none">
          <ContentFormatter content={chapter?.content} />
        </article>

        {/* FAQ */}
        {faq?.length > 0 && (
          <section className="mt-12 sm:mt-20 pt-8 sm:pt-12 border-t border-gray-100">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
              {langCode === 'hindi' ? 'अक्सर पूछे जाने वाले प्रश्न' : 'FAQs'}
            </h2>
            
            <div className="space-y-3 sm:space-y-4">
              {faq.map((item, idx) => (
                <details key={idx} className="group bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200">
                  <summary className="flex items-center gap-3 sm:gap-4 cursor-pointer p-4 sm:p-6">
                    <span className="flex-shrink-0 w-6 sm:w-7 h-6 sm:h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold">
                      {idx + 1}
                    </span>
                    <span className="flex-1 font-semibold text-gray-900 text-sm sm:text-base">{item.q}</span>
                    <ChevronRight className="w-4 sm:w-5 h-4 sm:h-5 text-gray-400 group-open:rotate-90 transition-transform flex-shrink-0" />
                  </summary>
                  <div className="px-4 sm:px-6 pb-4 sm:pb-6 text-gray-600 leading-relaxed border-t border-gray-100 pt-4 text-sm sm:text-base">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Navigation */}
      <footer className="border-t border-gray-100 mt-12 sm:mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {prevChapter ? (
              <a
                href={getChapterUrl(prevChapter)}
                className="flex items-center gap-4 p-4 sm:p-6 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <ChevronLeft className="w-5 h-5 text-gray-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Previous</p>
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {previousChapter?.title || cleanChapterName(prevChapter)}
                  </p>
                </div>
              </a>
            ) : <div />}
            
            {nextChapter ? (
              <a
                href={getChapterUrl(nextChapter)}
                className="flex items-center justify-between gap-4 p-4 sm:p-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors sm:col-start-2"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-blue-100 uppercase tracking-wide mb-1">Next</p>
                  <p className="text-sm font-semibold truncate">
                    {nextChapterData?.title || cleanChapterName(nextChapter)}
                  </p>
                </div>
                <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </a>
            ) : (
              <div className="sm:col-start-2 p-4 sm:p-6 bg-green-50 border border-green-100 rounded-xl">
                <p className="text-sm font-semibold text-green-700">
                  ✓ {langCode === 'hindi' ? 'कहानी पूरी हुई!' : 'Story Complete!'}
                </p>
              </div>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}