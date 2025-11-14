import { notFound } from 'next/navigation';
import ChapterClient from '../../../[slug]/chapters/[chapterId]/ClientComponent';
import APIInstance from './../../../../../../components/apiInstance/apiInstance2'; // ✅ Ensure this exists
const APIBASE = process.env.NEXT_PUBLIC_API_BASE1
// 🚀 Fetch Chapter Data
async function getChapterData(slug, chapterId, lang) {
  try {
    const res = await APIInstance.get(
      `${APIBASE}/${slug}/chapters/${chapterId}?lang=${lang}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: 120 }, // Hybrid cache for 2 minutes
      }
    );

    const data = res?.data;
console.log(data)

    return data?.success ? data : null;
  } catch {
    return null;
  }
}
// 🧠 Generate Dynamic SEO Metadata
export async function generateMetadata({ params }) {
  const { slug, chapterId, lang } = params;
  const data = await getChapterData(slug, chapterId, lang);
 console.log(data)
  if (!data) {
    return { title: 'Chapter Not Found' };
  }

  const localeMap = {
    hindi: 'hi_IN',
    spanish: 'es_ES',
    french: 'fr_FR',
    german: 'de_DE',
    arabic: 'ar_SA',
    urdu: 'ur_PK',
    english: 'en_US',
  };

  return {
    title: `${data.chapter.title} | ${data.story.category}`,
    description: data.chapter.summary,
    openGraph: {
      title: data.chapter.title,
      description: data.chapter.summary,
      type: 'article',
      locale: localeMap[lang] || 'en_US',
    },
  };
}

// 📘 Multi-language Chapter Page (SSR)
export default async function MultiLangChapterPage({ params }) {
  const { slug, chapterId, lang } = params;
  console.log(slug,chapterId,lang)
  const data = await getChapterData(slug, chapterId, lang);

  if (!data) {
    notFound();
  }

  return (
    <ChapterClient
      story={{
        title: data.story?.category || 'Story',
        category: data.story?.category,
        sub_category: data.story?.sub_category,
      }}
      chapter={{
        ...data.chapter,
        theme_color: data.story?.theme_color || '#3b82f6',
      }}
      faq={data.chapter?.faq || []}
      navigation={data.navigation}
      storyId={data.story?.story_id}
      chapterId={data.chapter?.chapter_id}
      langCode={data.language || lang}
      currentLang={lang}
    />
  );
}

// ⚙️ Optional: Allow ISR for short-term caching
export const dynamic = 'force-dynamic';
export const revalidate = 120;
