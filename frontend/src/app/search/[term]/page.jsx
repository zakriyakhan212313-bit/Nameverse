import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
const SearchResultsClient = dynamic(() => import('./ClientComponent'), { ssr: false });

// Load API URLs from environment variables
const API_NAMES_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api';
const API_STORIES_BASE = process.env.NEXT_PUBLIC_API_BASE1 || 'http://localhost:5001/api';

// Main fetch function, performance-oriented
const fetchSearchResults = async (term, lang = 'english') => {
  try {
    const [routesRes, storiesRes] = await Promise.allSettled([
      fetch(`${API_NAMES_BASE}/search?q=${encodeURIComponent(term.trim())}`, {
        next: { revalidate: 300 },
        timeout: 8000
      }).then(res => res.ok ? res.json() : null),

      fetch(`${API_STORIES_BASE}/stories/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: term.trim(), lang }),
        next: { revalidate: 300 },
        timeout: 8000
      }).then(res => res.ok ? res.json() : null)
    ]);

    const routeData = routesRes.status === 'fulfilled' ? routesRes.value : null;
    const storyData = storiesRes.status === 'fulfilled' ? storiesRes.value : null;

    return {
      names: routeData?.results || [],
      stories: storyData?.data || [],
      totalNames: routeData?.total || 0,
      totalStories: storyData?.data?.length || 0
    };
  } catch (error) {
    console.error('Search fetch error:', error);
    return { names: [], stories: [], totalNames: 0, totalStories: 0 };
  }
};

// Meta generation for SEO
export const generateMetadata = async ({ params }) => {
  const { term } = params;
  const decodedTerm = decodeURIComponent(term);
  const { names, stories, totalNames, totalStories } = await fetchSearchResults(decodedTerm);

  const totalResults = totalNames + totalStories;

  const seoTitle = `${decodedTerm} - Best Names & Stories | Top Travel Guides & Inspiration`;
  const seoDesc = `Discover ${totalResults} results for ${decodedTerm} including ${totalNames} top names and ${totalStories} engaging stories. Expert tips, guides, and local inspiration for your trip.`;

  return {
    title: seoTitle,
    description: seoDesc,
    keywords: [
      decodedTerm,
      `${decodedTerm} names`,
      `${decodedTerm} travel stories`,
      `best places in ${decodedTerm}`,
      'destination guides',
      'travel inspiration',
      'stories for travelers',
      'travel tips',
      'tourist attractions',
      'explore',
      'adventure',
      'guides',
      `${decodedTerm} attractions`,
    ].join(', '),
    authors: [{ name: 'Discovery' }],
    creator: 'Discovery',
    publisher: 'Discovery',
    openGraph: {
      title: seoTitle,
      description: seoDesc,
      type: 'website',
      url: `https://yourdomain.com/search/${encodeURIComponent(decodedTerm)}`,
      siteName: 'Discovery'
    },
    twitter: {
      card: 'summary_large_image',
      title: `${decodedTerm} Travel Names & Stories`,
      description: seoDesc
    },
    robots: { index: true, follow: true },
    alternates: { canonical: `https://yourdomain.com/search/${encodeURIComponent(decodedTerm)}` }
  };
};

// Static params for SSG
export async function generateStaticParams() {
  const popular = ['paris', 'tokyo', 'london', 'dubai', 'new york'];
  return popular.map(term => ({ term: encodeURIComponent(term) }));
}

export const revalidate = 300;

// Main Search Page
export default async function SearchPage({ params }) {
  const { term } = params;
  const decodedTerm = decodeURIComponent(term);
  const { names, stories, totalNames, totalStories } = await fetchSearchResults(decodedTerm);

  if (!names.length && !stories.length) {
    return notFound();
  }

  const totalResults = totalNames + totalStories;

  // JSON-LD Schemas
  const searchSchema = {
    '@context': 'https://schema.org',
    '@type': 'SearchResultsPage',
    name: `Results for ${decodedTerm}`,
    url: `https://yourdomain.com/search/${term}`,
    description: `${totalResults} results for "${decodedTerm}"`,
  };

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    numberOfItems: totalResults,
    itemListElement: [
      ...names.map((name, idx) => ({
        '@type': 'TouristAttraction',
        position: idx + 1,
        name: name.name || name.title,
        description: name.short_meaning || '',
        url: `https://yourdomain.com/${name.slug || ("names/" + name._id)}`,
      })),
      ...stories.map((story, idx) => ({
        '@type': 'Article',
        position: names.length + idx + 1,
        name: story.title,
        description: story.subtitle || story.trailer || '',
        url: `https://yourdomain.com/${story.slug || ("stories/" + story._id)}`,
      })),
    ]
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://yourdomain.com' },
      { '@type': 'ListItem', position: 2, name: 'Search', item: 'https://yourdomain.com/search' },
      { '@type': 'ListItem', position: 3, name: decodedTerm, item: `https://yourdomain.com/search/${term}` }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(searchSchema) }} suppressHydrationWarning />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} suppressHydrationWarning />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} suppressHydrationWarning />

      <SearchResultsClient
        initialRoutes={names}
        initialStories={stories}
        searchTerm={decodedTerm}
        totalRoutes={totalNames}
        totalStories={totalStories}
      />
    </>
  );
}
