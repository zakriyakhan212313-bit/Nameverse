// StorySliderSEO.jsx
import React from "react";

/**
 * All SEO logic/server markup extracted as a pure SSR Server Component
 * No UI, state, or interactivity—only SEO, JSON-LD, links, and markup.
 * Accepts: popularStories and trendingStories.
 */
export default function StorySliderSEO({ popularStories = [], trendingStories = [] }) {
  // Compute stories array from initialTab ("popular" on SSR)
  const stories = popularStories;
  const firstStory = stories.length ? stories[0] : null;

  // Canonical and image urls
  const canonicalUrl = firstStory
    ? `https://yourdomain.com/stories/${firstStory._id}`
    : "https://yourdomain.com/stories";
  const heroImageUrl = firstStory?.thumbnail_image
    ? `${firstStory.thumbnail_image}.jpg`
    : "/default-cover.jpg";
  const FONT_PRECONNECT = "https://fonts.googleapis.com";
  const IMAGE_PRECONNECT = "https://yourdomain.com";

  // CollectionPage JSON-LD for all visible stories
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Stories Collection",
    about: "Popular and Trending Stories",
    url: "https://yourdomain.com/stories",
    itemListElement: [
      ...(popularStories || []).map((story) => ({
        "@type": "CreativeWork",
        "@id": `https://yourdomain.com/stories/${story._id}`,
        url: `https://yourdomain.com/stories/${story._id}`,
        headline: story.title,
        image: `${story.thumbnail_image || "default"}.jpg`,
        author: {
          "@type": "Person",
          name: story.author || "Anonymous",
        },
        datePublished: story.published_at,
      })),
      ...(trendingStories || []).map((story) => ({
        "@type": "CreativeWork",
        "@id": `https://yourdomain.com/stories/${story._id}`,
        url: `https://yourdomain.com/stories/${story._id}`,
        headline: story.title,
        image: `${story.thumbnail_image || "default"}.jpg`,
        author: {
          "@type": "Person",
          name: story.author || "Anonymous",
        },
        datePublished: story.published_at,
      })),
    ],
  };

  // Organization schema
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Story Platform",
    url: "https://yourdomain.com",
    logo: "/logo.png",
    sameAs: [
      "https://facebook.com/storyplatform",
      "https://twitter.com/storyplatform",
    ],
  };

  // Breadcrumb schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Stories",
        item: "https://yourdomain.com/stories",
      },
      ...(firstStory
        ? [
            {
              "@type": "ListItem",
              position: 2,
              name: firstStory.title,
              item: canonicalUrl,
            },
          ]
        : []),
    ],
  };

  // FAQPage schema - sample Q&As
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How can I view more details about a story?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Click on any story card or thumbnail to navigate to the full detail page for that story with its complete information.",
        },
      },
      {
        "@type": "Question",
        name: "Does the slider support both popular and trending stories?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes, you can switch between popular and trending stories using the provided tab buttons. The slider instantly changes to display your selected category.",
        },
      },
    ],
  };

  // Article schema for first visible story
  const schemaData = firstStory
    ? {
        "@context": "https://schema.org",
        "@type": "Article",
        "@id": canonicalUrl,
        headline: firstStory.title,
        description: firstStory.subtitle || firstStory.title,
        image: {
          "@type": "ImageObject",
          url: heroImageUrl,
          width: 1200,
          height: 800,
        },
        author: {
          "@type": "Person",
          name: firstStory.author || "Anonymous",
        },
        publisher: {
          "@type": "Organization",
          name: "Story Platform",
          logo: {
            "@type": "ImageObject",
            url: "/logo.png",
            width: 300,
            height: 80,
          },
        },
        datePublished: firstStory.published_at,
        dateModified: firstStory.updated_at || firstStory.published_at,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": canonicalUrl,
        },
        articleSection: firstStory.category,
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: firstStory.rating || 0,
          reviewCount: firstStory.likes || 0,
        },
      }
    : null;

  // SSR markup only, no UI
  return (
    <>
      <link rel="preconnect" href={FONT_PRECONNECT} crossOrigin="anonymous" />
      <link rel="preconnect" href={IMAGE_PRECONNECT} crossOrigin="anonymous" />
      <link rel="canonical" href={canonicalUrl} />
      <link rel="preload" as="image" href={heroImageUrl} fetchPriority="high" />
      <link rel="alternate" href={canonicalUrl} hrefLang="en" />
      <link rel="alternate" href={canonicalUrl.replace("/stories", "/es/stories")} hrefLang="es" />
      <link rel="alternate" href={canonicalUrl.replace("/stories", "/fr/stories")} hrefLang="fr" />
      {firstStory && (
        <meta
          name="description"
          content={firstStory.subtitle || firstStory.title || "Read our stories"}
        />
      )}
      {firstStory && (
        <meta property="og:type" content="article" />
      )}
      {firstStory && (
        <meta property="og:title" content={firstStory.title} />
      )}
      {firstStory && (
        <meta property="og:description" content={firstStory.subtitle || firstStory.title} />
      )}
      {firstStory && (
        <meta property="og:url" content={canonicalUrl} />
      )}
      {firstStory && (
        <meta property="og:image" content={heroImageUrl} />
      )}
      {firstStory && (
        <meta property="og:image:width" content="1200" />
      )}
      {firstStory && (
        <meta property="og:image:height" content="800" />
      )}
      <meta property="og:site_name" content="Story Platform" />
      <meta name="twitter:card" content="summary_large_image" />
      {firstStory && (
        <meta name="twitter:title" content={firstStory.title} />
      )}
      {firstStory && (
        <meta name="twitter:description" content={firstStory.subtitle || firstStory.title} />
      )}
      {firstStory && (
        <meta name="twitter:image" content={heroImageUrl} />
      )}
      <meta name="twitter:site" content="@storyplatform" />
      {/* Hidden semantic headings for SEO/crawlers */}
      <h1 className="sr-only" aria-hidden="true">
        Featured Stories Slider | Popular & Trending
      </h1>
      <h2 className="sr-only" id="SliderRegionHeading">
        Stories Carousel
      </h2>
      {/* JSON-LD schemas for SEO */}
      {schemaData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
