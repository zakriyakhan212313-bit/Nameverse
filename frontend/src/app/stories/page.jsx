// ============= PAGE.JSX (SERVER COMPONENT - FULLY SSR/SEO OPTIMIZED) =============
import { Suspense } from 'react';
import StoryPageUI from '../../components/stories/storyPage'; // your client file
import StoryPageSeo from '../../components/stories/StoryPageSeo'; // your SSR SEO/schema file
import TrendingSection from '../../components/stories/TrendingSection';
import TrendingSeo from '../../components/stories/TrendingSeo';

const API_BASE = process.env.NEXT_PUBLIC_API_URL1 || 'http://localhost:5001/api';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';

// Force dynamic rendering for real-time data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getInitialData(searchParams) {
  try {
    const params = await searchParams;
    const [filtersRes, storiesRes, popularRes, trendingRes] = await Promise.all([
      fetch(`${API_BASE}/stories/categories`, {
        next: { revalidate: 3600 },
        cache: 'force-cache'
      }),
      fetch(`${API_BASE}/stories?${buildQueryParams(params)}`, {
        cache: 'no-store'
      }),
      fetch(`${API_BASE}/stories/popular?limit=5`, {
        next: { revalidate: 300 },
        cache: 'force-cache'
      }),
      fetch(`${API_BASE}/stories/trending?limit=5`, {
        next: { revalidate: 300 },
        cache: 'force-cache'
      })
    ]);
    const [filtersData, storiesData, popularData, trendingData] = await Promise.all([
      filtersRes.json(),
      storiesRes.json(),
      popularRes.json(),
      trendingRes.json()
    ]);
    return {
      filters: filtersData.success ? filtersData.data : getEmptyFilters(),
      stories: storiesData.success ? storiesData.data : [],
      popularStories: popularData.success ? popularData.data : [],
      trendingStories: trendingData.success ? trendingData.data : [],
      initialParams: params,
      totalCount: storiesData.total || storiesData.data?.length || 0
    };
  } catch (error) {
    console.error('Failed to fetch data:', error);
    return {
      filters: getEmptyFilters(),
      stories: [],
      popularStories: [],
      trendingStories: [],
      initialParams: {},
      totalCount: 0
    };
  }
}

function buildQueryParams(params) {
  const queryParams = new URLSearchParams();
  queryParams.append('sort', params?.sort || '-views');
  queryParams.append('page', params?.page || '1');
  queryParams.append('limit', params?.limit || '12');
  if (params?.search) queryParams.append('search', params.search);
  if (params?.category) queryParams.append('category', params.category);
  if (params?.sub_category) queryParams.append('sub_category', params.sub_category);
  if (params?.mood) queryParams.append('mood', params.mood);
  if (params?.location) queryParams.append('location', params.location);
  if (params?.difficulty_level) queryParams.append('difficulty_level', params.difficulty_level);
  if (params?.length_type) queryParams.append('length_type', params.length_type);
  if (params?.minRating) queryParams.append('minRating', params.minRating);
  if (params?.featured) queryParams.append('featured', params.featured);
  if (params?.trending) queryParams.append('trending', params.trending);
  return queryParams.toString();
}

function getEmptyFilters() {
  return {
    moods: [],
    locations: [],
    difficulty_levels: [],
    categories: [],
    sub_categories: []
  };
}

export async function generateMetadata({ searchParams }) {
  const params = await searchParams;
  const category = params?.category || 'All';
  const search = params?.search;
  const page = params?.page || '1';
  const mood = params?.mood;
  const location = params?.location;
  let title = '';
  if (search) {
    title = `"${search}" Stories - Search Results`;
  } else if (category !== 'All') {
    title = `${category} Stories`;
  } else {
    title = 'Browse All Stories';
  }
  if (page !== '1') {
    title += ` - Page ${page}`;
  }
  title += ' | Your Story Platform';
  let description = '';
  if (search) {
    description = `Search results for "${search}". Discover curated stories, trending content, and popular narratives matching your search.`;
  } else if (category !== 'All') {
    description = `Explore ${category.toLowerCase()} stories. Browse popular, trending, and featured ${category.toLowerCase()} content with rich narratives and engaging plots.`;
  } else {
    description = 'Browse our complete collection of stories. Discover trending, popular, and featured narratives across all categories and genres.';
  }
  if (mood) description += ` Mood: ${mood}.`;
  if (location) description += ` Location: ${location}.`;
  const queryParams = new URLSearchParams();
  if (category && category !== 'All') queryParams.set('category', category);
  if (search) queryParams.set('search', search);
  if (page !== '1') queryParams.set('page', page);
  const canonicalPath = queryParams.toString()
    ? `/stories?${queryParams.toString()}`
    : '/stories';
  const keywords = [
    category !== 'All' ? category : 'stories',
    'online stories',
    'trending stories',
    'popular stories',
    'featured stories',
    search || '',
    mood || '',
    location || '',
    'read stories online',
    'story platform'
  ].filter(Boolean);
  return {
    title,
    description,
    keywords: keywords.join(', '),
    authors: [{ name: 'Your Story Platform' }],
    creator: 'Your Story Platform',
    publisher: 'Your Story Platform',
    alternates: {
      canonical: `${SITE_URL}${canonicalPath}`
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${canonicalPath}`,
      siteName: 'Your Story Platform',
      type: 'website',
      locale: 'en_US',
      images: [
        {
          url: `${SITE_URL}/og-stories.jpg`,
          width: 1200,
          height: 630,
          alt: title,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      site: '@yourstoryplatform',
      creator: '@yourstoryplatform',
      images: [`${SITE_URL}/og-stories.jpg`],
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: 'your-google-verification-code',
    },
  };
}

function LoadingSlider() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded-lg mb-4 w-48 mx-auto"></div>
        <div className="h-80 bg-gray-200 rounded-2xl"></div>
      </div>
    </div>
  );
}

function LoadingFilters() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      <div className="animate-pulse">
        <div className="flex gap-4">
          <div className="w-56 space-y-4">
            <div className="h-12 bg-gray-200 rounded-lg"></div>
            <div className="h-12 bg-gray-200 rounded-lg"></div>
            <div className="h-12 bg-gray-200 rounded-lg"></div>
          </div>
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function AllStoriesPage({ searchParams }) {
  const { filters, stories, popularStories, trendingStories, initialParams, totalCount } = await getInitialData(searchParams);
  const params = await searchParams;
  const currentPage = parseInt(params?.page || '1');
  const category = params?.category || 'All';
  const search = params?.search || '';

  return (
    <>
      {/* Trending Section SEO (SSR) */}
      <TrendingSeo
        popularStories={popularStories}
        trendingStories={trendingStories}
      />
      {/* Story Filter SEO (SSR) */}
      <StoryPageSeo
        initialFilters={filters}
        initialStories={stories}
        initialParams={initialParams}
        totalCount={totalCount}
        SITE_URL={SITE_URL}
      />

      <Suspense fallback={<LoadingSlider />}>
        <TrendingSection
          popularStories={popularStories}
          trendingStories={trendingStories}
        />
      </Suspense>
      <Suspense fallback={<LoadingFilters />}>
        <StoryPageUI
          initialFilters={filters}
          initialStories={stories}
          initialParams={initialParams}
        />
      </Suspense>
      {/* Hidden semantic content for crawlers */}
      <aside className="sr-only" role="complementary" aria-label="Story catalog">
        <nav aria-label="Story list">
          <h2>Complete Story Index</h2>
          <ul>
            {stories.map((story) => (
              <li key={story._id}>
                <a
                  href={`/story/${story.slug}`}
                  itemProp="url"
                >
                  <span itemProp="name">{story.title}</span>
                </a>
                <p itemProp="description">{story.subtitle}</p>
                <div>
                  <span>Category: {story.category}</span>
                  <span>Rating: {story.rating}/5</span>
                  <span>Views: {story.views}</span>
                  {story.difficulty_level && <span>Level: {story.difficulty_level}</span>}
                  {story.length_type && <span>Length: {story.length_type}</span>}
                </div>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Story categories">
          <h2>Browse by Category</h2>
          <ul>
            {filters.categories.map((cat) => (
              <li key={cat}>
                <a href={`/stories?category=${cat}`}>{cat}</a>
              </li>
            ))}
          </ul>
        </nav>
        {totalCount > 12 && (
          <nav aria-label="Pagination">
            <h2>Pages</h2>
            <ul>
              {currentPage > 1 && (
                <li>
                  <a
                    href={`/stories?${new URLSearchParams({ ...initialParams, page: (currentPage - 1).toString() }).toString()}`}
                    rel="prev"
                  >
                    Previous Page
                  </a>
                </li>
              )}
              {(currentPage * 12) < totalCount && (
                <li>
                  <a
                    href={`/stories?${new URLSearchParams({ ...initialParams, page: (currentPage + 1).toString() }).toString()}`}
                    rel="next"
                  >
                    Next Page
                  </a>
                </li>
              )}
            </ul>
          </nav>
        )}
      </aside>
    </>
  );
}
