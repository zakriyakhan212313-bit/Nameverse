import React, { useState, useEffect, useRef } from 'react';

const TrendingStories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCards, setVisibleCards] = useState(new Set());
  const cardsRef = useRef([]);

  // Fetch stories from API
  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/stories/trending?limit=8');
        const result = await response.json();
        console.log(result)
        if (result.success) {
          // Add .jpg extension to image paths
          const storiesWithImages = result.data.map(story => ({
            ...story,
            thumbnail_image: story.thumbnail_image ? `/${story.thumbnail_image}.jpg` : null,
            cover_image: story.cover_image ? `/${story.cover_image}.jpg` : null
          }));
          setStories(storiesWithImages);
        }
      } catch (error) {
        console.error('Error fetching stories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              const cardId = entry.target.dataset.cardId;
              setVisibleCards(prev => new Set([...prev, cardId]));
            }, index * 80);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    cardsRef.current.forEach(card => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, [stories]);

  const handleReadClick = (e, storyId) => {
    e.stopPropagation();
    window.location.href = `/stories/${storyId}`;
  };

  const handleEngagementClick = (e, action, storyId) => {
    e.stopPropagation();
    console.log(`${action} clicked for story ${storyId}`);
  };

  // Category color mapping
  const getCategoryColor = (category) => {
    const colors = {
      'Education': 'emerald',
      'Technology': 'purple',
      'Career': 'orange',
      'History': 'red',
      'Culture': 'indigo',
      'default': 'blue'
    };
    return colors[category] || colors.default;
  };

  // Format numbers with K notation
  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num;
  };

  if (loading) {
    return (
      <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 w-full bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="text-center mb-12">
          <div className="h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-xl w-64 mx-auto mb-4 animate-pulse"></div>
          <div className="h-5 bg-gray-200 rounded-lg w-80 max-w-full mx-auto animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 max-w-[1600px] mx-auto">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg animate-pulse">
              <div className="h-72 bg-gradient-to-br from-gray-200 to-gray-300"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-5 bg-gray-300 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 w-full bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
      {/* Section Header */}
      <div className="text-center mb-12 md:mb-16 relative z-10 max-w-4xl mx-auto">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-3 tracking-tight">
          Trending Stories
        </h2>
        <div className="flex justify-center gap-2 mb-4">
          <span className="h-1 w-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></span>
          <span className="h-1 w-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></span>
          <span className="h-1 w-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-full"></span>
        </div>
        <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
          Explore captivating narratives, insights, and knowledge from around the world
        </p>
      </div>

      {/* Stories Grid - Full Width */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6 relative z-10 max-w-[1600px] mx-auto">
        {stories.map((story, index) => {
          const color = getCategoryColor(story.category);
          return (
            <article
              key={story._id}
              ref={el => cardsRef.current[index] = el}
              data-card-id={story._id}
              className={`group relative bg-white rounded-2xl overflow-hidden border border-gray-200 cursor-pointer transition-all duration-500 ease-out transform ${
                visibleCards.has(story._id) 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              } hover:-translate-y-2 hover:shadow-xl hover:border-gray-300`}
            >
              {/* Thumbnail Image with Overlay */}
              <div className="relative h-72 overflow-hidden">
                {/* Background Image */}
                {story.thumbnail_image ? (
                  <>
                    <img 
                      src={story.thumbnail_image}
                      alt={story.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
                  </>
                ) : (
                  <div className={`absolute inset-0 bg-gradient-to-br from-${color}-500 to-${color}-700`}></div>
                )}

                {/* Top badges */}
                <div className="absolute top-3 left-3 right-3 flex items-start justify-between z-10">
                  <span className={`bg-${color}-500 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase shadow-md`}>
                    {story.category}
                  </span>
                  
                  {story.featured && (
                    <div className="bg-yellow-500 text-gray-900 px-2.5 py-1 rounded-full text-xs font-bold uppercase shadow-md flex items-center gap-1">
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      Featured
                    </div>
                  )}
                </div>

                {/* Hover Overlay with Read Button */}
                <div className="absolute inset-0 bg-white/95 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center z-20">
                  <button
                    onClick={(e) => handleReadClick(e, story.story_id)}
                    className="transform scale-75 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                    </svg>
                    Read Story
                  </button>
                </div>

                {/* Bottom Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                  {/* Meta Information */}
                  <div className="flex flex-wrap items-center gap-2 mb-2 text-white text-xs">
                    <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12,6 12,12 16,14"/>
                      </svg>
                      <span className="font-medium">{story.read_time_minutes}m</span>
                    </div>
                    <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                      <span className="font-medium">{formatNumber(story.views)}</span>
                    </div>
                    <div className="flex items-center gap-1 bg-yellow-500/90 backdrop-blur-sm px-2 py-1 rounded-full">
                      <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      <span className="font-bold text-white">{story.rating}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-lg font-bold text-white mb-1 leading-tight line-clamp-2 drop-shadow-lg">
                    {story.title}
                  </h2>

                  {/* Sub-category */}
                  <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full bg-${color}-400`}></div>
                    <span className="text-xs font-medium text-white/90">
                      {story.sub_category}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-4">
                {/* Tags */}
                {story.tags && story.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {story.tags.slice(0, 2).map((tag, i) => (
                      <span 
                        key={i}
                        className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full font-medium border border-gray-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Trailer/Excerpt */}
                <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-2">
                  {story.trailer}
                </p>

                {/* Engagement Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-3 text-gray-600 text-sm">
                    <button
                      className="flex items-center gap-1 transition-colors duration-200 hover:text-pink-600"
                      onClick={(e) => handleEngagementClick(e, 'like', story._id)}
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                      </svg>
                      <span className="font-semibold">{formatNumber(story.likes)}</span>
                    </button>
                    <button
                      className="flex items-center gap-1 transition-colors duration-200 hover:text-blue-600"
                      onClick={(e) => handleEngagementClick(e, 'bookmark', story._id)}
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                      </svg>
                      <span className="font-semibold">{formatNumber(story.bookmarks)}</span>
                    </button>
                  </div>

                  {/* Quick action button */}
                  <button
                    onClick={(e) => handleReadClick(e, story.story_id)}
                    className="p-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 shadow-sm"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="5" y1="12" x2="19" y2="12"/>
                      <polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="text-center mt-12 md:mt-16 relative z-10">
        <button className="group inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-7 py-3.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <span>Explore All Stories</span>
          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </button>
      </div>
    </section>
  );
};

export default TrendingStories;