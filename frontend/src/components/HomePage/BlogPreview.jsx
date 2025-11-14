'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function BlogPreview() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // 🧪 Mock blog posts (replace with real fetch later)
    const mockPosts = [
      {
        title: "Top 20 Timeless Islamic Baby Names",
        excerpt: "Explore a hand-picked list of meaningful and spiritual names rooted in Islamic tradition.",
        slug: "top-20-islamic-names"
      },
      {
        title: "How to Choose a Culturally Strong Name",
        excerpt: "Tips for picking names that reflect identity, meaning, and modern relevance.",
        slug: "choose-strong-cultural-name"
      },
      {
        title: "Names from the Quran: Meanings and Origins",
        excerpt: "Discover beautiful names directly inspired by the Holy Quran, with detailed meanings.",
        slug: "quranic-names-meanings"
      }
    ];

    setPosts(mockPosts.slice(0, 3));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 mt-14">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">📝 Blog Insights</h2>
        <Link
          href="/blog"
          className="text-sm text-blue-600 hover:underline"
        >
          View All
        </Link>
      </div>
      <div className="grid gap-4">
        {posts.map((post, index) => (
          <Link
            key={index}
            href={`/blog/${post.slug}`}
            className="block bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:bg-gray-50 transition"
          >
            <h3 className="text-md font-bold text-gray-800 mb-1">{post.title}</h3>
            <p className="text-sm text-gray-600">{post.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
