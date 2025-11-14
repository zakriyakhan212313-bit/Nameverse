'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Bebas_Neue } from 'next/font/google';

const bebasNeue = Bebas_Neue({ subsets: ['latin'], weight: '400' });

import API from '../apiInstance/apiInstance';
import TrendingSection from './TrendingSection';
import NewReleasesSection from './NewReleasesSection';
import StoriesGrid from './storyCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

gsap.registerPlugin(ScrollTrigger);

const Skeleton = dynamic(
  () => import('@/components/ui/skeleton').then((mod) => mod.Skeleton),
  { ssr: false }
);

export default function SearchEngine() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const [page, setPage] = useState(pageParam);

  const [query, setQuery] = useState(queryParam);
  const [trending, setTrending] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState({});
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    setPage(1);
    router.push(trimmed ? `/?q=${encodeURIComponent(trimmed)}&page=1` : '/?page=1');
    setActiveCategory(null);
  };

  const clearSearch = () => {
    setQuery('');
    setPage(1);
    router.push('/?page=1');
    setActiveCategory(null);
  };

  const fetchStories = async () => {
    setLoading(true);
    setError('');
    try {
      const [trendingRes, newReleasesRes] = await Promise.all([
        API.get('/stories/trending'),
        API.get('/stories/new'),
      ]);

      setTrending(trendingRes.data || []);
      setNewReleases(newReleasesRes.data || []);

      let storiesEndpoint = '/stories';
      if (activeCategory) {
        storiesEndpoint = `/stories/category/${encodeURIComponent(activeCategory)}`;
      } else if (queryParam) {
        storiesEndpoint = `/stories/search?q=${encodeURIComponent(queryParam)}`;
      }

      const storiesRes = await API.get(`${storiesEndpoint}`);
      setStories((storiesRes.data || []).slice(0, 17));

      // Initialize selectedLanguages for all stories
      const langs = {};
      [...trendingRes.data, ...newReleasesRes.data, ...(storiesRes.data || [])].forEach((story) => {
        const defaultTrans =
          story.translations.find((t) => t.lang_code === 'en') || story.translations[0];
        langs[story.story_id] = defaultTrans.lang_code;
      });
      setSelectedLanguages(langs);
    } catch (err) {
      console.error(err);
      setError('Failed to load stories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, [queryParam, page, activeCategory]);

  useEffect(() => {
    API.get('stories/categories?limit=50')
      .then((res) => setCategories(res.data || []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.story-grid-item', {
        scrollTrigger: {
          trigger: '.story-grid-item',
          start: 'top 85%',
          toggleActions: 'play none none reset',
        },
        opacity: 0,
        y: 25,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power2.out',
      });
    });

    return () => ctx.revert();
  }, [stories]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    router.push(
      `/?${query ? `q=${encodeURIComponent(query)}&` : ''}${
        activeCategory ? `category=${encodeURIComponent(activeCategory)}&` : ''
      }page=${newPage}`
    );
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4 px-[10px] w-full">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-1 rounded-full shadow-sm">
              {activeCategory || 'All Categories'}
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="max-h-64 overflow-y-auto">
            <DropdownMenuItem onClick={() => setActiveCategory(null)}>All Categories</DropdownMenuItem>
            {categories.map((cat) => (
              <DropdownMenuItem key={cat} onClick={() => setActiveCategory(cat)}>
                {cat}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2 max-w-md w-full"
        >
          <div className="relative flex-grow">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search stories..."
              className="w-full pr-10 rounded-full shadow-sm"
            />
            {query && (
              <X
                className="absolute right-3 top-3 w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600"
                onClick={clearSearch}
              />
            )}
          </div>
          <Button type="submit" className="flex items-center gap-1 whitespace-nowrap rounded-full">
            <Search className="w-4 h-4" />
            Search
          </Button>
        </motion.form>
      </div>

      {/* Stories Grid */}
      {!loading && stories.length > 0 && (
        <StoriesGrid
          stories={stories}
          selectedLanguages={selectedLanguages}
          setSelectedLanguages={setSelectedLanguages} // passed here
          router={router}
        />
      )}

      {/* Trending Stories Section */}
      {trending.length > 0 && (
        <TrendingSection
          stories={trending}
          selectedLanguages={selectedLanguages}
          setSelectedLanguages={setSelectedLanguages} // passed here
        />
      )}

      {/* New Releases Section */}
      {newReleases.length > 0 && (
        <NewReleasesSection
          stories={newReleases}
          selectedLanguages={selectedLanguages}
          setSelectedLanguages={setSelectedLanguages} // passed here
        />
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="flex flex-col gap-10 px-[10px] min-h-[600px] w-full">
          {Array.from({ length: 6 }).map((_, idx) => (
            <Skeleton key={idx} className="h-[260px] w-full rounded-lg" />
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center gap-4 mt-8 mb-12 px-[10px]">
        <Button variant="outline" disabled={page <= 1} onClick={() => handlePageChange(page - 1)}>
          Previous
        </Button>
        <Button variant="outline" onClick={() => handlePageChange(page + 1)}>
          Next
        </Button>
      </div>

      {/* Error */}
      {!loading && error && (
        <p className="text-red-500 text-center mt-8 px-[10px] w-full">{error}</p>
      )}
    </>
  );
}
