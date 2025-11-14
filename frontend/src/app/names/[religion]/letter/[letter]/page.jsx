import NamesDatabaseClient from './NameClientComponent';
import React from 'react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function NamesDatabaseServer({ params, searchParams }) {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api/name';
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';

  // Get all current context values
  const selectedReligion = params?.religion || "islamic";
  const selectedLetter = params?.letter?.toUpperCase() || "A";
  const currentPage = parseInt(searchParams?.page || 1);
  const perPage = parseInt(searchParams?.perPage || 20);
  const sortBy = searchParams?.sort || "popularity";

  // Server fetch (SSR friendly)
  let names = [];
  let totalResults = 0;
  try {
    const apiUrl = `${API_BASE}/name/letter/${selectedLetter.toLowerCase()}?religion=${selectedReligion}&page=${currentPage}&perPage=${perPage}&sort=${sortBy}`;
    const response = await fetch(apiUrl, { cache: 'no-store' });
    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        names = data.names || [];
        totalResults = data.total || 0;
      }
    }
  } catch {}

  // Canonical URL & variants for SEO
  const canonicalUrl = `${SITE_URL}/names/${selectedReligion}/letter/${selectedLetter.toLowerCase()}?page=${currentPage}&perPage=${perPage}&sort=${sortBy}`;
  const prevPageUrl = currentPage > 1
    ? `${SITE_URL}/names/${selectedReligion}/letter/${selectedLetter.toLowerCase()}?page=${currentPage - 1}&perPage=${perPage}&sort=${sortBy}` : null;
  const nextPageUrl = totalResults > (currentPage * perPage)
    ? `${SITE_URL}/names/${selectedReligion}/letter/${selectedLetter.toLowerCase()}?page=${currentPage + 1}&perPage=${perPage}&sort=${sortBy}` : null;

  // Social share image (replace with real image if possible)
  const ogImage = `${SITE_URL}/static/og-names-${selectedReligion}-${selectedLetter}.png`;

  // JSON-LD structured data
  const namesListLD = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Names List`,
    itemListOrder: "http://schema.org/ItemListOrderAscending",
    itemListElement: names.map((name, idx) => ({
      "@type": "ListItem",
      position: idx + 1 + ((currentPage-1)*perPage),
      item: {
        "@type": "Person",
        name: name.name,
        description: name.short_meaning,
        url: `${SITE_URL}/names/${selectedReligion}/letter/${selectedLetter.toLowerCase()}`,
        gender: name.gender,
        nationality: name.origin
      }
    }))
  };

  const breadcrumbLD = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", position: 1, name: "Names", item: `${SITE_URL}/names` },
      { "@type": "ListItem", position: 2, name: selectedReligion.charAt(0).toUpperCase() + selectedReligion.slice(1), item: `${SITE_URL}/names/${selectedReligion}` },
      { "@type": "ListItem", position: 3, name: selectedLetter, item: canonicalUrl }
    ]
  };

  return (
    <>
      {/* Canonical & Pagination Links */}
      <link rel="canonical" href={canonicalUrl} />
      {prevPageUrl && <link rel="prev" href={prevPageUrl} />}
      {nextPageUrl && <link rel="next" href={nextPageUrl} />}
      {/* Alternate languages/hreflang sample */}
      <link rel="alternate" hrefLang="en" href={canonicalUrl} />
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />

      {/* Title & Description */}
      <title>{`Names starting with ${selectedLetter} - ${selectedReligion} | Baby Names`}</title>
      <meta name="description" content={`Discover ${selectedReligion} baby names beginning with the letter ${selectedLetter}. Meanings, origins, and more.`} />
      <meta name="keywords" content={`baby names, ${selectedReligion} baby names, names with ${selectedLetter}, ${selectedLetter} baby names, name meanings`} />

      {/* OG + Twitter Card */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={`Names starting with ${selectedLetter} (${selectedReligion})`} />
      <meta property="og:description" content={`Discover ${selectedReligion} baby names beginning with the letter ${selectedLetter}. Meanings, origins, and more.`} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={`Names starting with ${selectedLetter} (${selectedReligion})`} />
      <meta name="twitter:description" content={`Discover ${selectedReligion} baby names beginning with the letter ${selectedLetter}. Meanings, origins, and more.`} />
      <meta name="twitter:image" content={ogImage} />

      {/* JSON-LD structured data */}
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{__html: JSON.stringify(namesListLD)}} />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{__html: JSON.stringify(breadcrumbLD)}} />

      {/* Accessibility: Page h1/description for SR/SEO */}
      <h1 style={{display:'none'}}>
        {`${selectedReligion.charAt(0).toUpperCase() + selectedReligion.slice(1)} Baby Names Starting with ${selectedLetter}`}
      </h1>
      <p style={{display:'none'}}>
        {`Find beautiful and meaningful names for babies. View their meanings, origins, genders and details for ${selectedReligion} tradition starting with ${selectedLetter}.`}
      </p>

      {/* Pass state to client */}
      <NamesDatabaseClient
        initialNames={names}
        initialTotal={totalResults}
        initialReligion={selectedReligion}
        initialLetter={selectedLetter}
        initialPage={currentPage}
        perPageDefault={perPage}
        initialSort={sortBy}
      />
    </>
      
  );
}
