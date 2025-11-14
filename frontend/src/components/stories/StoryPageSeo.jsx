// StoryFilterSEO.jsx
import React from 'react';

/**
 * SSR-only SEO snippets for your filter page. Use inside a Layout, not in-page <body>.
 * Returns <meta>, <link>, and <script> tags (NO <head>).
 */
export default function StoryFilterSEO({
  initialFilters,
  initialStories,
  initialParams,
  totalCount = 0,
  SITE_URL = "https://yourdomain.com",
  LANGUAGES = ["en", "es", "fr"]
}) {
  const category = initialParams?.category || 'All';
  const search = initialParams?.search || '';
  const currentPage = parseInt(initialParams?.page || '1');
  const canonicalParams = new URLSearchParams();
  if (category && category !== 'All') canonicalParams.set('category', category);
  if (search) canonicalParams.set('search', search);
  if (currentPage && currentPage !== 1) canonicalParams.set('page', currentPage);
  const canonicalPath = canonicalParams.toString()
    ? `/stories?${canonicalParams.toString()}`
    : '/stories';
  const canonicalUrl = `${SITE_URL}${canonicalPath}`;

  // CollectionPage JSON-LD
  const collectionStructuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${category} Stories Collection`,
    description: `Browse ${category.toLowerCase()} stories on our platform`,
    url: canonicalUrl,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: totalCount,
      itemListElement: (initialStories || []).slice(0, 50).map((story, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        item: {
          "@type": "Article",
          "@id": `${SITE_URL}/story/${story.slug}`,
          url: `${SITE_URL}/story/${story.slug}`,
          headline: story.title,
          description: story.subtitle,
          articleSection: story.category,
          image: `${SITE_URL}${story.thumbnail_image || story.cover_image}.jpg`,
          author: {
            "@type": "Person",
            name: story.author || "Anonymous"
          },
          datePublished: story.published_at,
          dateModified: story.updated_at || story.published_at,
          aggregateRating: story.rating ? {
            "@type": "AggregateRating",
            ratingValue: story.rating,
            bestRating: 5,
            worstRating: 0
          } : undefined,
          interactionStatistic: [
            {
              "@type": "InteractionCounter",
              interactionType: "https://schema.org/ReadAction",
              userInteractionCount: story.views || 0
            },
            {
              "@type": "InteractionCounter",
              interactionType: "https://schema.org/LikeAction",
              userInteractionCount: story.likes || 0
            }
          ]
        }
      }))
    }
  };

  // BreadcrumbList JSON-LD
  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Stories",
        item: `${SITE_URL}/stories`
      },
      ...(category !== "All" ? [{
        "@type": "ListItem",
        position: 3,
        name: category,
        item: `${SITE_URL}/stories?category=${category}`
      }] : [])
    ]
  };

  // Website JSON-LD
  const websiteStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Your Story Platform",
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/stories?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  // OpenGraph/Twitter meta
  const topStory = (initialStories && initialStories[0]) || null;
  const ogTitle = topStory
    ? topStory.title
    : `${category} Stories | Your Story Platform`;
  const ogDesc = topStory
    ? topStory.subtitle || topStory.title
    : `Browse ${category === "All" ? "all" : category.toLowerCase()} stories. Curated, popular, trending, and featured narratives.`;
  const ogImage = topStory
    ? `${SITE_URL}${topStory.thumbnail_image || topStory.cover_image}.jpg`
    : `${SITE_URL}/og-stories.jpg`;

  // Hreflang alternates
  const hreflangs = [
    <link key="canonical" rel="canonical" href={canonicalUrl} />,
    ...LANGUAGES.map((lang) => (
      <link
        key={lang}
        rel="alternate"
        hrefLang={lang}
        href={
          lang === "en"
            ? canonicalUrl
            : canonicalUrl.replace("/stories", `/${lang}/stories`)
        }
      />
    ))
  ];

  // Output NO head/body tags!
  return (
    <>
      {hreflangs}
      <meta name="description" content={ogDesc} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDesc} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Your Story Platform" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogTitle} />
      <meta name="twitter:description" content={ogDesc} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content="@yourstoryplatform" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteStructuredData),
        }}
      />
    </>
  );
}
