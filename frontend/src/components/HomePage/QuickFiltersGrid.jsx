'use client';
import Link from 'next/link';

export default function QuickFiltersGrid() {
  const filters = [
    { label: "Boys", href: "/boys" },
    { label: "Girls", href: "/girls" },
    { label: "Quranic", href: "/quranic" },
    { label: "Rare", href: "/rare" },
    { label: "Urdu", href: "/urdu" },
    { label: "Pashto", href: "/pashto" },
  ];

  return (
    <div className="mt-6 grid grid-cols-3 sm:grid-cols-6 gap-4 max-w-3xl mx-auto px-4">
      {filters.map((filter) => (
        <Link
          key={filter.label}
          href={filter.href}
          className="block text-sm text-center font-medium bg-gray-100 hover:bg-blue-100 text-gray-800 py-2 rounded-full transition"
        >
          {filter.label}
        </Link>
      ))}
    </div>
  );
}
