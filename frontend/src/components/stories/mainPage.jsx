'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

// Dynamically import SearchEngine with loading fallback
const SearchEngine = dynamic(() => import('./searchEngine'), {
  ssr: false,
  loading: () => (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-[300px] w-full rounded-md" />
      ))}
    </div>
  ),
});

const MainPage = () => {
  return (
    <main className="w-full min-h-screen">
      <div className="w-full max-w-[1400px] mx-auto px-4 py-6">
        <SearchEngine />
      </div>
    </main>
  );
};

export default MainPage;
