import { notFound } from 'next/navigation';
import ChapterClient from '../../[slug]/chapters/[chapterId]/ClientComponent';
import APIInstance from '../../../../../components/apiInstance/apiInstance2';
const APIBASE = process.env.NEXT_PUBLIC_API_BASE1

// 🚀 Fetch Chapter Data
async function getChapterData(lang, chapterId) {
  try {
    const res = await APIInstance.get(
      `${APIBASE}/${lang}/chapters/${chapterId}?lang=${lang}`,
      {
        headers: { 'Content-Type': 'application/json' },
        next: { revalidate: 120 },
      }
    );

    const data = res?.data;
    return data?.success ? data : null;
  } catch {
    return null;
  }
}

// 🧠 SEO Metadata
export async function generateMetadata({ params }) {
  const resolvedParams = await params; // ✅ Await params
  const { lang, chapterId } = resolvedParams;

  const data = await getChapterData(lang, chapterId);

  if (!data) return { title: 'Chapter Not Found' };

  return {
    title: `${data.chapter.title} | ${data.story.category}`,
    description: data.chapter.summary,
    openGraph: {
      title: data.chapter.title,
      description: data.chapter.summary,
      type: 'article',
    },
  };
}

// 📘 Server Page
export default async function ChapterPage({ params }) {
  const resolvedParams = await params; // ✅ Await params
  const { lang, chapterId } = resolvedParams;

  const data = await getChapterData(lang, chapterId);

  if (!data) notFound();

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

export const dynamic = 'force-dynamic';
export const revalidate = 120;
