'use client';
import Link from 'next/link';

export default function ThemesGrid() {
  const themes = [
    { label: "Prophet Names", slug: "prophet-names" },
    { label: "Names from Hadith", slug: "hadith-names" },
    { label: "Spiritual Names", slug: "spiritual-names" },
    { label: "Modern Islamic", slug: "modern-islamic" },
    { label: "Nature-Inspired", slug: "nature-names" },
    { label: "Quranic Themes", slug: "quranic-themes" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 mt-12">
      <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">
        🕌 Categories / Islamic Themes
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {themes.map((theme) => (
          <Link
            key={theme.slug}
            href={`/themes/${theme.slug}`}
            className="block text-center bg-white border border-gray-200 rounded-xl shadow-sm px-4 py-3 hover:bg-yellow-50 transition"
          >
            <span className="text-md font-medium text-yellow-700">{theme.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
