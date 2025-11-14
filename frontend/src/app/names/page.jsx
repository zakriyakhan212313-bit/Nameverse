// ============================================
// FILE: app/names/page.js
// Global Baby Names Page — SEO + Structured Data (Dynamic)
// ============================================

import BabyNamesClient from './ClientComponent';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nameverse.com';
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api';

// ✅ Generate Dynamic Metadata (for Google, social, and rich snippets)
export async function generateMetadata({ searchParams }) {
  // Collect applied filters (like ?gender=boy&origin=arabic)
  const filters = Object.entries(searchParams)
    .filter(([key, value]) => value && key !== 'page')
    .map(([key, value]) => `${key}: ${value}`)
    .join(', ');

  // Dynamic title and meta
  const baseTitle = `All Baby Names`;
  const title = filters
    ? `${baseTitle} (${filters}) | Meaning, Origins & Lucky Traits`
    : `${baseTitle} with Meanings, Origins & Lucky Traits`;

  const description = filters
    ? `Discover beautiful baby names filtered by ${filters}. Each name includes meaning, origin, numerology, and lucky details.`
    : `Explore thousands of baby names from all religions and cultures with meanings, origins, numerology, and lucky traits. Find unique boy and girl names for your baby.`;

  const keywords = [
    'baby names',
    'boy names',
    'girl names',
    'unique baby names',
    'modern baby names',
    'baby name meanings',
    'baby name origins',
    'baby name finder',
    'baby name list'
  ].join(', ');

  const canonicalUrl = `${SITE_URL}/names`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "NameVerse — Baby Names & Meanings",
      type: "website",
      locale: "en_US",
      images: [
        {
          url: `${SITE_URL}/names-image.png`,
          width: 1200,
          height: 630,
          alt: "All Baby Names with Meanings and Origins",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: "@NameVerse",
      creator: "@NameVerse",
      images: [`${SITE_URL}/names-image.png`],
    },
    other: {
      "robots": "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
      "author": "NameVerse Team",
    },
  };
}

// ✅ Fetch Data from API (with caching for performance)
async function fetchInitialData(searchParams) {
  try {
    // Get filters (no religion limit for /names)
    const filtersRes = await fetch(`${API_BASE}/filters`, {
      cache: 'force-cache',
      next: { revalidate: 3600 },
    });
    const filtersData = await filtersRes.json();

    const params = new URLSearchParams({
      page: searchParams.page || '1',
      limit: '20',
    });

    // Append optional filters
    ['religion', 'origin', 'language', 'category', 'theme', 'luckyDay', 'luckyColor', 'alphabet', 'luckyStone', 'gender'].forEach(key => {
      if (searchParams[key]) params.append(key, searchParams[key]);
    });

    // Fetch all names
    const namesRes = await fetch(`${API_BASE}/names?${params}`, {
      cache: 'no-store',
    });
    const namesData = await namesRes.json();

    return {
      filters: filtersData.success ? filtersData.filters : null,
      names: namesData.success ? namesData.data.names : [],
      pagination: namesData.success ? namesData.data.pagination : null,
    };
  } catch (error) {
    console.error('❌ Error fetching initial data:', error);
    return { filters: null, names: [], pagination: null };
  }
}

// ✅ Rich Structured Data (schema.org for Google Rich Results)
function generateStructuredData(names) {
  const nameItems = (names || []).slice(0, 20).map((n, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: n.name,
    url: `${SITE_URL}/names/${n.slug}`,
  }));

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "All Baby Names — Meanings & Origins",
    "description": "Browse the top baby names from all cultures with meanings, numerology, and origin details.",
    "url": `${SITE_URL}/names`,
    "isPartOf": {
      "@type": "WebSite",
      "name": "NameVerse",
      "url": SITE_URL
    },
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": nameItems
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${SITE_URL}/search?query={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
}

// ✅ Main Page
export default async function AllNamesPage({ searchParams }) {
  const initialData = await fetchInitialData(searchParams);
  const structuredData = generateStructuredData(initialData.names || []);

  return (
    <>
      {/* Inject structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <BabyNamesClient initialData={initialData} initialReligion="all" />
    </>
  );
}
