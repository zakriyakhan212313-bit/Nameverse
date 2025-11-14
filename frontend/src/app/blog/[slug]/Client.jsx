'use client';
import React, { useEffect, useState, useMemo, useCallback, memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Calendar,
  Clock,
  Bookmark,
  ChevronRight,
  Eye,
  ArrowLeft,
  Copy,
  CheckCircle,
  Share2,
} from 'lucide-react';

// ==================== UTILITY FUNCTIONS ====================
const getGradientBg = (articleId) => {
  const gradients = [
    'from-blue-600 via-indigo-600 to-purple-600',
    'from-emerald-500 via-teal-500 to-cyan-500',
    'from-orange-500 via-red-500 to-pink-500',
    'from-violet-600 via-purple-600 to-indigo-600',
    'from-slate-600 via-gray-600 to-stone-600',
  ];
  const hash = articleId ? articleId.charCodeAt(0) + articleId.length : 0;
  return gradients[hash % gradients.length];
};

// Extract primary category filter (islamic, christian, hindu, etc.)
const getCategoryFilter = (category) => {
  if (!category) return '';
  
  const categoryLower = category.toLowerCase();
  
  // Map category patterns to filter keywords
  const filterMap = {
    'islamic': ['islamic', 'muslim', 'arabic'],
    'christian': ['christian', 'biblical', 'religious'],
    'hindu': ['hindu', 'hinduism', 'indian'],
    'jewish': ['jewish', 'hebrew', 'torah'],
    'buddhist': ['buddhist', 'buddhism'],
    'sikh': ['sikh', 'sikhism'],
    'celtic': ['celtic', 'gaelic', 'irish'],
    'scandinavian': ['scandinavian', 'nordic', 'norse'],
    'greek': ['greek', 'classical'],
    'latin': ['latin', 'roman'],
    'spanish': ['spanish', 'spanish'],
    'french': ['french'],
    'german': ['german'],
    'hebrew': ['hebrew'],
    'hindi': ['hindi'],
  };
  
  // Check which filter matches the category
  for (const [filter, keywords] of Object.entries(filterMap)) {
    if (keywords.some(keyword => categoryLower.includes(keyword))) {
      return filter;
    }
  }
  
  // Default: use first word if no match found
  return categoryLower.split(' ')[0];
};

// Create clickable link from name
const createNameLink = (name, categoryFilter) => {
  const nameSlug = name.toLowerCase().replace(/\s+/g, '-');
  return `names/${categoryFilter}/${nameSlug}`;
};

// Render text with clickable names from name_links array
const renderTextWithNameLinks = (text, nameLinks, categoryFilter) => {
  if (!text || !nameLinks || nameLinks.length === 0) return text;

  const parts = [];
  let lastIndex = 0;

  // Create regex pattern for bracket notation [name]
  nameLinks.forEach((name) => {
    const bracketRegex = new RegExp(`\\[${name}\\]`, 'gi');
    text = text.replace(bracketRegex, name);
  });

  // Create word boundaries regex for each name
  const nameRegex = new RegExp(
    `\\b(${nameLinks.map(n => n.replace(/\s+/g, '\\s+')).join('|')})\\b`,
    'gi'
  );

  let match;
  while ((match = nameRegex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push({
        type: 'text',
        content: text.slice(lastIndex, match.index)
      });
    }

    // Add the clickable name
    const name = match[0];
    const nameSlug = name.toLowerCase().replace(/\s+/g, '-');
    const href = `/names/${categoryFilter}/${nameSlug}`;
    
    parts.push({
      type: 'link',
      name,
      href
    });

    lastIndex = nameRegex.lastIndex;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push({
      type: 'text',
      content: text.slice(lastIndex)
    });
  }

  return parts.map((part, idx) => 
    part.type === 'link' ? (
      <Link
        key={idx}
        href={part.href}
        className="text-blue-600 hover:text-blue-800 font-semibold hover:underline transition-all duration-200 cursor-pointer hover:shadow-sm"
      >
        {part.name}
      </Link>
    ) : (
      <span key={idx}>{part.content}</span>
    )
  );
};

// ==================== ERROR BOUNDARY ====================
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Article Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Oops! Something went wrong</h2>
            <p className="text-gray-600 mb-8 text-lg">We encountered an error loading this article.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ==================== MEMOIZED COMPONENTS ====================
const ArticleMetadata = memo(({ author, formattedDate, estimatedReadTime, viewCount }) => (
  <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-4 sm:gap-6 mb-10 pb-10 border-b-2 border-gray-200">
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
        {author?.charAt(0).toUpperCase() || 'A'}
      </div>
      <div>
        <p className="font-semibold text-gray-900 text-sm sm:text-base">{author || 'Anonymous'}</p>
        <p className="text-xs text-gray-500">Expert Writer</p>
      </div>
    </div>
    <div className="hidden sm:block w-px h-8 bg-gray-300"></div>
    <div className="flex items-center gap-2 text-sm text-gray-700">
      <Calendar className="w-4 h-4 text-blue-600" />
      <time>{formattedDate || 'Date'}</time>
    </div>
    <div className="flex items-center gap-2 text-sm text-gray-700">
      <Clock className="w-4 h-4 text-blue-600" />
      <span>{estimatedReadTime} min</span>
    </div>
    <div className="flex items-center gap-2 text-sm text-gray-700">
      <Eye className="w-4 h-4 text-blue-600" />
      <span>{viewCount.toLocaleString()}</span>
    </div>
  </div>
));

const ActionButtons = memo(({ copied, isBookmarked, onCopyLink, onBookmark, onShare }) => (
  <div className="flex flex-wrap items-center gap-3 mb-12">
    <button
      onClick={onCopyLink}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${
        copied
          ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-300'
          : 'bg-gray-100 text-gray-700 border-2 border-gray-200 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50'
      }`}
    >
      <Copy className="w-4 h-4" />
      {copied ? 'Copied!' : 'Copy Link'}
    </button>

    <button
      onClick={onBookmark}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${
        isBookmarked
          ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
          : 'bg-gray-100 text-gray-700 border-2 border-gray-200 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50'
      }`}
    >
      <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
      {isBookmarked ? 'Saved' : 'Save'}
    </button>

    <div className="flex items-center gap-2 bg-gray-100 border-2 border-gray-200 rounded-lg p-1">
      <button
        onClick={() => onShare('twitter')}
        className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-600 hover:text-blue-500"
        aria-label="Share on Twitter"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7z" />
        </svg>
      </button>
      <button
        onClick={() => onShare('facebook')}
        className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-600 hover:text-blue-600"
        aria-label="Share on Facebook"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18 2h-3a6 6 0 00-6 6v3H7v4h2v8h4v-8h3l1-4h-4V8a1 1 0 011-1h3z" />
        </svg>
      </button>
      <button
        onClick={() => onShare('linkedin')}
        className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-600 hover:text-blue-700"
        aria-label="Share on LinkedIn"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      </button>
    </div>
  </div>
));

const TableOfContents = memo(({ items }) => (
  <div className="sticky top-24 p-6 bg-gradient-to-br from-gray-50 to-blue-50 border-2 border-gray-200 rounded-xl shadow-md">
    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-5">Contents</h3>
    <nav className="space-y-3">
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className="block text-sm text-gray-700 hover:text-blue-600 font-medium transition-all hover:translate-x-1 duration-200"
        >
          {item.title}
        </a>
      ))}
    </nav>
  </div>
));

const ArticleStats = memo(({ wordCount, readTime, status }) => (
  <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl shadow-md">
    <h4 className="text-xs font-bold text-blue-900 uppercase tracking-widest mb-5">Article Stats</h4>
    <div className="space-y-4 text-sm text-gray-700">
      <p className="flex justify-between">
        <span>Word Count:</span>
        <span className="font-bold text-blue-700">{wordCount.toLocaleString()}</span>
      </p>
      <p className="flex justify-between">
        <span>Read Time:</span>
        <span className="font-bold text-blue-700">{readTime} min</span>
      </p>
      <p className="flex justify-between">
        <span>Status:</span>
        <span className="font-bold text-emerald-700 capitalize">{status || 'draft'}</span>
      </p>
    </div>
  </div>
));

const RelatedArticleCard = memo(({ article }) => (
  <Link
    href={`/${article.slug}`}
    className="group block overflow-hidden bg-white rounded-xl border-2 border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
  >
    <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden relative">
      {article.cover_image_url ? (
        <Image
          src={`/article/${article.cover_image_url.split('/').pop()}`}
          alt={article.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
      ) : (
        <div className={`w-full h-full bg-gradient-to-br ${getGradientBg(article.id)} flex items-center justify-center`}>
          <span className="text-white/90 font-bold text-3xl">
            {article.category?.charAt(0).toUpperCase() || 'A'}
          </span>
        </div>
      )}
    </div>
    <div className="p-5">
      <span className="inline-block text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">
        {article.category || 'Article'}
      </span>
      <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
        {article.title}
      </h3>
      <p className="text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed">
        {article.subtitle}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500 font-medium">
          {article.read_time_minutes || 5} min read
        </span>
        <ChevronRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  </Link>
));

// ==================== MAIN COMPONENT ====================
function ArticleClientInner({ article, latestArticles = [] }) {
  const [isClient, setIsClient] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [viewCount, setViewCount] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [gradientBg, setGradientBg] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [formattedDate, setFormattedDate] = useState('');

  // Hydration and initialization
  useEffect(() => {
    setIsClient(true);
    setViewCount(article?.views || 0);
    setGradientBg(getGradientBg(article?.id));
    
    if (article?.created_at) {
      const date = new Date(article.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      setFormattedDate(date);
    }

    if (article?.id && typeof sessionStorage !== 'undefined') {
      const viewKey = `viewed_${article.id}`;
      if (!sessionStorage.getItem(viewKey)) {
        setViewCount(prev => prev + 1);
        sessionStorage.setItem(viewKey, 'true');
      }
    }
  }, [article?.id, article?.views, article?.created_at]);

  const tableOfContents = useMemo(() => {
    if (!article?.content) return [];
    const headings = article.content.match(/^## .+$/gm) || [];
    return headings.map((heading, idx) => ({
      id: `section-${idx}`,
      title: heading.replace('## ', '').trim(),
      level: 2
    }));
  }, [article?.content]);

  const estimatedReadTime = useMemo(() => 
    article?.read_time_minutes || Math.ceil((article?.content?.split(/\s+/).length || 0) / 200),
    [article?.read_time_minutes, article?.content]
  );

  const wordCount = useMemo(() => 
    article?.content?.split(/\s+/).length || 0,
    [article?.content]
  );

  const categoryFilter = useMemo(() => 
    getCategoryFilter(article?.category),
    [article?.category]
  );

  const handleCopyLink = useCallback(async () => {
    if (typeof window === 'undefined') return;
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, []);

  const handleShare = useCallback((platform) => {
    if (typeof window === 'undefined') return;
    const url = window.location.href;
    const text = article?.title || 'Check out this article';
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    };
    if (shareUrls[platform]) window.open(shareUrls[platform], '_blank', 'noopener,noreferrer');
  }, [article?.title]);

  const handleBookmark = useCallback(() => {
    setIsBookmarked(prev => !prev);
  }, []);

  const getCoverImage = useCallback(() => {
    if (article?.cover_image_url && !imageError) {
      return `/article/${article.cover_image_url.split('/').pop()}`;
    }
    return null;
  }, [article?.cover_image_url, imageError]);

  if (!isClient || !article) {
    return <ArticleSkeleton />;
  }

  const coverImage = getCoverImage();

  return (
    <article className="min-h-screen bg-white">
      {/* Sticky Header */}
      <div className="fixed top-16 left-0 right-0 z-40 bg-white/90 backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="hidden sm:inline">Back to Articles</span>
            <span className="sm:hidden">Back</span>
          </Link>
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">{estimatedReadTime} min read</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] bg-gray-900 overflow-hidden">
        {coverImage && !imageError ? (
          <Image
            src={coverImage}
            alt={article.title}
            fill
            className="object-cover"
            priority
            quality={90}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradientBg} flex items-center justify-center`}>
            <div className="text-center text-white z-10">
              <div className="text-7xl sm:text-8xl md:text-9xl font-extrabold mb-6 opacity-90">
                {article.title.charAt(0).toUpperCase()}
              </div>
              <p className="text-2xl sm:text-3xl font-light opacity-80">NameVerse</p>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-12 pb-16">
          
          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Title Section */}
            <div className="mb-10">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-full">
                  {article.category}
                </span>
                {article.status === 'published' && (
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider rounded-full">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Published
                  </span>
                )}
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-6 leading-[1.1] tracking-tight">
                {renderTextWithNameLinks(article.title, article.name_links, categoryFilter)}
              </h1>

              {article.subtitle && (
                <p className="text-xl sm:text-2xl md:text-3xl text-gray-600 mb-10 leading-relaxed font-light max-w-4xl">
                  {renderTextWithNameLinks(article.subtitle, article.name_links, categoryFilter)}
                </p>
              )}
            </div>

            <ArticleMetadata
              author={article.author}
              formattedDate={formattedDate}
              estimatedReadTime={estimatedReadTime}
              viewCount={viewCount}
            />

            <ActionButtons
              copied={copied}
              isBookmarked={isBookmarked}
              onCopyLink={handleCopyLink}
              onBookmark={handleBookmark}
              onShare={handleShare}
            />

            {/* Article Content */}
            <div className="prose prose-xl max-w-none mb-16">
              {article.content ? (
                article.content.split('\n\n').map((paragraph, idx) => {
                  if (paragraph.startsWith('## ')) {
                    return (
                      <h2
                        key={idx}
                        id={`section-${idx}`}
                        className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 mt-20 mb-8 scroll-mt-28 tracking-tight leading-[1.1]"
                        style={{ fontFamily: 'Georgia, serif' }}
                      >
                        {renderTextWithNameLinks(paragraph.replace('## ', ''), article.name_links, categoryFilter)}
                      </h2>
                    );
                  }
                  if (paragraph.startsWith('### ')) {
                    return (
                      <h3
                        key={idx}
                        className="text-3xl sm:text-4xl font-bold text-gray-800 mt-16 mb-6 tracking-tight leading-tight"
                      >
                        {renderTextWithNameLinks(paragraph.replace('### ', ''), article.name_links, categoryFilter)}
                      </h3>
                    );
                  }
                  if (paragraph.startsWith('> ')) {
                    return (
                      <blockquote
                        key={idx}
                        className="border-l-4 border-blue-500 pl-8 py-6 my-10 text-2xl italic text-gray-700 bg-blue-50/50 rounded-r-xl leading-relaxed"
                        style={{ fontFamily: 'Georgia, serif' }}
                      >
                        {renderTextWithNameLinks(paragraph.replace(/^> /gm, ''), article.name_links, categoryFilter)}
                      </blockquote>
                    );
                  }
                  if (paragraph.startsWith('- ')) {
                    return (
                      <ul key={idx} className="space-y-5 my-10 ml-0">
                        {paragraph.split('\n').map((item, i) => (
                          <li key={i} className="text-gray-800 text-xl leading-relaxed flex items-start gap-4">
                            <span className="text-blue-600 font-bold text-2xl mt-1 flex-shrink-0">→</span>
                            <span className="flex-1">{renderTextWithNameLinks(item.replace('- ', ''), article.name_links, categoryFilter)}</span>
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  return (
                    <p key={idx} className="text-gray-800 text-xl leading-[1.9] mb-8 font-light">
                      {renderTextWithNameLinks(paragraph, article.name_links, categoryFilter)}
                    </p>
                  );
                })
              ) : (
                <p className="text-gray-500 text-xl">Content not available</p>
              )}
            </div>

            {/* Tags Section */}
            {article.tags && article.tags.length > 0 && (
              <div className="mt-16 pt-10 border-t-2 border-gray-200">
                <h3 className="text-sm font-bold text-gray-600 uppercase tracking-widest mb-5">Tagged With</h3>
                <div className="flex flex-wrap gap-3">
                  {article.tags.map((tag, idx) => (
                    <Link
                      key={idx}
                      href={`/blog?tag=${encodeURIComponent(tag)}`}
                      className="px-4 py-2 bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-600 text-sm font-semibold rounded-full transition-all duration-200 hover:shadow-md"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-full px-5 py-3 mb-6 bg-blue-50 border-2 border-blue-200 rounded-xl text-sm font-semibold text-blue-700 hover:bg-blue-100 transition-colors"
            >
              {isMobileMenuOpen ? '✕ Hide' : '✓ Show'} Article Info
            </button>

            <div className={`lg:block ${isMobileMenuOpen ? 'block' : 'hidden'} space-y-6`}>
              {tableOfContents.length > 0 && <TableOfContents items={tableOfContents} />}
              
              <ArticleStats 
                wordCount={wordCount}
                readTime={estimatedReadTime}
                status={article.status}
              />

              <div className="p-6 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl text-white shadow-lg">
                <h4 className="text-base font-bold mb-3">Enjoy this article?</h4>
                <p className="text-sm text-blue-100 mb-5 leading-relaxed">
                  Share it with your network or bookmark for later.
                </p>
                <button
                  onClick={handleCopyLink}
                  className="w-full py-3 bg-white text-blue-600 text-sm font-bold rounded-lg hover:bg-blue-50 transition-all hover:shadow-md flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Share Article
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Articles */}
      {latestArticles && latestArticles.length > 0 && (
        <section className="bg-gradient-to-b from-white via-gray-50 to-white border-t-2 border-gray-200 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 mb-4">
                Discover More
              </h2>
              <p className="text-gray-600 text-xl">Related articles you might find interesting</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestArticles.slice(0, 3).map((relArticle) => (
                <RelatedArticleCard key={relArticle.id} article={relArticle} />
              ))}
            </div>
          </div>
        </section>
      )}

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </article>
  );
}

// ==================== SKELETON LOADER ====================
function ArticleSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <div className="h-[500px] bg-gray-200 animate-pulse"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="space-y-6">
          <div className="h-12 bg-gray-200 rounded w-3/4 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-full animate-pulse"></div>
          <div className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

// ==================== MAIN EXPORT ====================
export default function ArticleClient(props) {
  return (
    <ErrorBoundary>
      <ArticleClientInner {...props} />
    </ErrorBoundary>
  );
}