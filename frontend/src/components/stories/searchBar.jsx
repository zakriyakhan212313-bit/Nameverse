'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/?q=${encodeURIComponent(trimmed)}`);
    } else {
      router.push('/');
    }
  };

  const clearSearch = () => {
    setQuery('');
    router.push('/');
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 p-4 max-w-2xl mx-auto w-full">
      <div className="relative flex-1">
        <input
          type="text"
          value={query}
          placeholder="Search stories..."
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 py-2 pr-10 border rounded-md shadow-sm focus:outline-none dark:bg-zinc-800 dark:border-zinc-700"
        />
        {query && (
          <X
            className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600"
            onClick={clearSearch}
          />
        )}
      </div>
      <button
        type="submit"
        className="flex items-center gap-1 px-4 py-2 bg-black text-white text-sm rounded-md hover:bg-gray-800"
      >
        <Search className="w-4 h-4" />
        Search
      </button>
    </form>
  );
}
