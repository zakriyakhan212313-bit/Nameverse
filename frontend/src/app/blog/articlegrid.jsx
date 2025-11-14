"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, User, ArrowRight, Bookmark, Share2, TrendingUp } from "lucide-react";

// Premium gradient backgrounds for fallback
const bgGradients = [
  "bg-gradient-to-br from-violet-600 via-purple-600 to-pink-600",
  "bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-500",
  "bg-gradient-to-br from-orange-500 via-red-500 to-pink-600",
  "bg-gradient-to-br from-emerald-500 via-green-600 to-teal-600",
  "bg-gradient-to-br from-indigo-600 via-blue-500 to-cyan-500",
  "bg-gradient-to-br from-fuchsia-600 via-purple-600 to-blue-600",
  "bg-gradient-to-br from-amber-500 via-orange-600 to-red-600",
  "bg-gradient-to-br from-rose-600 via-pink-600 to-purple-600",
];

const getStableGradient = (index) => {
  return bgGradients[index % bgGradients.length];
};

// Format date helper
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric' 
  });
};

// Article Card Component
const ArticleCard = ({ article, index }) => {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleCardClick = (e) => {
    // Prevent navigation if clicking on action buttons
    if (e.target.closest('.action-button')) {
      return;
    }
    router.push(`/blog/${article.slug}`);
  };

  const handleBookmark = (e) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = async (e) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt || article.subtitle,
          url: `/blog/${article.slug}`,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    }
  };

  return (
    <article 
      onClick={handleCardClick}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer border border-gray-100 hover:border-blue-200 transform hover:-translate-y-2"
    >
      {/* Image/Fallback Section */}
      <div className="relative h-56 overflow-hidden">
        {article.cover_image_url && !imageError ? (
          <>
            <img
              src={article.cover_image_url}
              alt={article.title}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </>
        ) : (
          <div className={`${getStableGradient(index)} w-full h-full relative flex items-center justify-center`}>
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
            
            {/* Logo text */}
            <div className="relative z-10 text-center px-4">
              <h3 className="text-5xl font-black text-white drop-shadow-2xl tracking-tight mb-2">
                Nameverse
              </h3>
              <div className="h-1 w-20 bg-white/80 rounded-full mx-auto" />
            </div>
          </div>
        )}

        {/* Category Badge */}
        {article.category && (
          <div className="absolute top-4 left-4 z-20">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full text-xs font-bold text-gray-800 shadow-lg border border-gray-100">
              <TrendingUp className="w-3 h-3" />
              {article.category}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleBookmark}
            className="action-button p-2 bg-white/95 backdrop-blur-sm rounded-full shadow-lg hover:bg-blue-50 transition-colors"
            aria-label="Bookmark article"
          >
            <Bookmark 
              className={`w-4 h-4 ${isBookmarked ? 'fill-blue-600 text-blue-600' : 'text-gray-700'}`} 
            />
          </button>
          <button
            onClick={handleShare}
            className="action-button p-2 bg-white/95 backdrop-blur-sm rounded-full shadow-lg hover:bg-blue-50 transition-colors"
            aria-label="Share article"
          >
            <Share2 className="w-4 h-4 text-gray-700" />
          </button>
        </div>

        {/* Read Time Badge */}
        {article.read_time_minutes && (
          <div className="absolute bottom-4 right-4 z-20">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-full text-white text-xs font-semibold">
              <Clock className="w-3 h-3" />
              {article.read_time_minutes} min
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
          {article.title}
        </h2>

        {/* Excerpt */}
        {(article.excerpt || article.subtitle) && (
          <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
            {article.excerpt || article.subtitle}
          </p>
        )}

        {/* Footer Meta */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            {article.author ? (
              <>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {article.author.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-gray-900">{article.author}</span>
                  {article.created_at && (
                    <span className="text-xs text-gray-500">{formatDate(article.created_at)}</span>
                  )}
                </div>
              </>
            ) : article.created_at ? (
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(article.created_at)}
              </div>
            ) : null}
          </div>

          {/* Read More Arrow */}
          <div className="flex items-center gap-1 text-blue-600 font-semibold text-sm opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300">
            <span>Read</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 rounded-2xl ring-2 ring-blue-400/50 ring-offset-2" />
      </div>
    </article>
  );
};

// Empty State Component
const EmptyState = () => (
  <div className="col-span-full flex flex-col items-center justify-center py-24 px-4">
    <div className="relative mb-8">
      <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
        <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      </div>
      <div className="absolute -top-1 -right-1 w-8 h-8 bg-blue-500 rounded-full animate-ping opacity-20" />
    </div>
    <h3 className="text-2xl font-bold text-gray-900 mb-2">No Articles Found</h3>
    <p className="text-gray-500 text-center max-w-md">
      We couldn't find any articles matching your criteria. Try adjusting your filters or check back later for new content.
    </p>
  </div>
);

// Loading Skeleton Component
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 animate-pulse">
    <div className="h-56 bg-gradient-to-br from-gray-200 to-gray-300" />
    <div className="p-6">
      <div className="h-6 bg-gray-200 rounded-lg mb-3 w-3/4" />
      <div className="h-4 bg-gray-200 rounded mb-2" />
      <div className="h-4 bg-gray-200 rounded mb-4 w-5/6" />
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-200 rounded-full" />
          <div className="h-4 bg-gray-200 rounded w-20" />
        </div>
        <div className="h-4 bg-gray-200 rounded w-16" />
      </div>
    </div>
  </div>
);

// Main Grid Component
export default function ArticleGrid({ articles, isLoading = false }) {
  if (isLoading) {
    return (
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-12">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!articles?.length) {
    return <EmptyState />;
  }

  return (
    <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-12">
      {articles.map((article, idx) => (
        <ArticleCard key={article.id || idx} article={article} index={idx} />
      ))}

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}