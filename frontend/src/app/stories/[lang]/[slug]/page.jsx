export const revalidate = 3600;
export const dynamicParams = true;

import { notFound } from "next/navigation";
import { Suspense } from "react";
import StoryClient from "./../ClientComponent";
const APIBASE = process.env.NEXT_PUBLIC_API_BASE1
// --- Data Fetch ---
async function getStoryData(lang, storySlug) {
  try {
    // Fetch story with language parameter
    const apiUrl = `${APIBASE}/stories/${storySlug}?lang=${lang}`;
    console.log('Fetching from:', apiUrl);
    
    const response = await fetch(apiUrl, {
      next: { revalidate: 3600 },
      headers: {
        "Cache-Control": "public, s-maxage=7200, stale-while-revalidate=604800",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      console.error(`[getStoryData] API returned status: ${response.status}`);
      return null;
    }

    const data = await response.json();
    console.log('API Response:', data);
    
    if (!data?.success || !data?.data) {
      console.error("[getStoryData] Invalid data structure:", data);
      return null;
    }

    return data.data;
  } catch (error) {
    console.error("[getStoryData] Error:", error);
    return null;
  }
}

// --- Loading Skeleton ---
function StorySkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50" role="status" aria-label="Loading story">
      {/* Header Skeleton */}
      <div className="h-20 bg-white/80 backdrop-blur-lg border-b border-slate-200/60 animate-pulse" />
      
      {/* Hero Skeleton */}
      <div className="relative h-[500px] bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-6 px-4 max-w-4xl">
            <div className="h-16 bg-white/10 rounded-lg w-full mx-auto animate-pulse" />
            <div className="h-8 bg-white/5 rounded-lg w-3/4 mx-auto animate-pulse" />
            <div className="flex gap-3 justify-center">
              <div className="h-12 w-32 bg-white/10 rounded-lg animate-pulse" />
              <div className="h-12 w-32 bg-white/5 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Skeleton */}
          <div className="hidden lg:block">
            <div className="sticky top-24 bg-white rounded-2xl p-6 shadow-xl border border-slate-200/60 animate-pulse">
              <div className="h-6 bg-gradient-to-r from-slate-200 to-slate-100 rounded w-32 mb-6" />
              <div className="space-y-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-12 bg-slate-100 rounded-xl" />
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Skeleton */}
          <div className="lg:col-span-3 space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-xl border border-slate-200/60 animate-pulse">
                <div className="h-8 bg-gradient-to-r from-slate-200 to-slate-100 rounded w-3/4 mb-4" />
                <div className="space-y-3">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="h-4 bg-slate-100 rounded" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Page Component ---
export default async function StoryPage({ params: paramsPromise }) {
  const params = await paramsPromise;
  const lang = params.lang || 'english';
  const storySlug = params.slug;

  if (!storySlug) {
    return notFound();
  }
  
  console.log('Page params:', { lang, storySlug });

  const apiData = await getStoryData(lang, storySlug);

  if (!apiData) {
    console.error('No data returned from API');
    return notFound();
  }

  console.log('Server data', apiData);

  // Transform API data to match StoryClient expected format
  const transformedData = {
    // Meta information from root level
    story_id: apiData.story_id,
    author: apiData.author || "Unknown Author",
    read_time_minutes: apiData.read_time_minutes || 0,
    difficulty_level: apiData.difficulty_level || "easy",
    tags: apiData.tags || [],
    category: apiData.category || "General",
    sub_category: apiData.sub_category || "",
    views: apiData.views || 0,
    likes: apiData.likes || 0,
    bookmarks: apiData.bookmarks || 0,
    rating: apiData.rating || 0,
    publishedAt: apiData.publishedAt,
    
    // Translation data - properly extract from translation object
    translation: {
      language: apiData.translation?.language || "English",
      lang_code: apiData.translation?.lang_code || lang,
      title: apiData.translation?.title || apiData.title || "Untitled Story",
      subtitle: apiData.translation?.subtitle || apiData.subtitle || "",
      description: apiData.translation?.description || "",
      trailer: apiData.translation?.trailer || apiData.trailer || "",
      seo_title: apiData.translation?.seo_title || apiData.translation?.title || "Story",
      seo_meta_description: apiData.translation?.seo_meta_description || apiData.translation?.subtitle || "",
      cover_image: apiData.translation?.cover_image || apiData.cover_image || "default-cover",
      cover_alt_text: apiData.translation?.cover_alt_text || "",
      thumbnail_image: apiData.translation?.thumbnail_image || "",
      // CRITICAL: Properly pass chapters array
      chapters: apiData.translation?.chapters || apiData.chapters || [],
      faq: apiData.translation?.faq || apiData.faq || [],
    }
  };

  console.log('Transformed data:', transformedData);
  console.log('Chapters count:', transformedData.translation.chapters.length);

  // Validate chapters exist
  if (!transformedData.translation.chapters || transformedData.translation.chapters.length === 0) {
    console.warn('No chapters found in transformed data');
  }

  return (
    <Suspense fallback={<StorySkeleton />}>
      <StoryClient 
        storyData={transformedData}
        slug={storySlug}
        lang={lang}
      />
    </Suspense>
  );
}

// --- Generate Metadata for SEO ---
export async function generateMetadata({ params: paramsPromise }) {
  const params = await paramsPromise;
  const lang = params.lang || 'english';
  const storySlug = params.slug;
  
  if (!storySlug) {
    return {
      title: 'Story Not Found',
      description: 'The requested story could not be found.',
    };
  }

  const storyData = await getStoryData(lang, storySlug);
  
  if (!storyData) {
    return {
      title: 'Story Not Found',
      description: 'The requested story could not be found.',
    };
  }

  return {
    title: storyData.translation?.seo_title || storyData.translation?.title || 'Story',
    description: storyData.translation?.seo_meta_description || storyData.translation?.subtitle || '',
    keywords: storyData.translation?.seo_keywords || [],
    openGraph: {
      title: storyData.translation?.title,
      description: storyData.translation?.subtitle,
      images: storyData.translation?.cover_image ? [`/${storyData.translation.cover_image}.jpg`] : [],
    },
  };
}