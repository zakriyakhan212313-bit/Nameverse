// app/[slug]/page.jsx
import { notFound } from 'next/navigation';
import ArticleClient from './Client';
import { getArticleBySlug, getLatestArticles } from '../../supabase/controller';

export const revalidate = 60; // ISR every 60 seconds

export default async function ArticlePage({ params }) {
  const { slug } = params;

  try {
    // 🟢 Fetch article by slug
    const article = await getArticleBySlug(slug);

    if (!article) {
      console.warn(`⚠️ Article not found for slug: ${slug}`);
      return notFound();
    }

    // 📰 Optionally fetch latest articles (for sidebar or footer)
    const latestArticles = await getLatestArticles(4);

    return (
      <ArticleClient
        slug={slug}
        article={article}
        latestArticles={latestArticles}
      />
    );
  } catch (error) {
    console.error('❌ Error fetching article or latest articles:', error);

    return (
      <div className="p-8 text-center text-red-600">
        <h1 className="text-2xl font-bold mb-2">Server Error</h1>
        <p>Something went wrong while loading the article. Please try again later.</p>
      </div>
    );
  }
}
