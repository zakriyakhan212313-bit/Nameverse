'use client';

import React, { useEffect, useState, useRef } from 'react';
import API from '../apiInstance/apiInstance'; // adjust import path
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

// Adjust card width + visible count
const VISIBLE_CARDS = 4;
const AUTO_PLAY_INTERVAL = 6000;

export default function LatestStoriesSlider() {
  const [stories, setStories] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef(null);

  // Fetch latest 20 stories sorted by updatedAt descending
  useEffect(() => {
    async function fetchLatest() {
      try {
        const res = await API.get('/stories', {
          params: { page: 1, limit: 100 }, // fetch more for safety
        });
        const allStories = res.data.stories || res.data;

        // Filter published and sort by updatedAt descending
        const latest20 = allStories
          .filter((s) => s.status === 'published')
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
          .slice(0, 20);

        setStories(latest20);
      } catch (error) {
        console.error('Failed to fetch latest stories', error);
      }
    }

    fetchLatest();
  }, []);

  // Auto advance slider every AUTO_PLAY_INTERVAL ms
  useEffect(() => {
    if (stories.length <= VISIBLE_CARDS) return; // no sliding needed

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) =>
        prev + VISIBLE_CARDS >= stories.length ? 0 : prev + VISIBLE_CARDS
      );
    }, AUTO_PLAY_INTERVAL);

    return () => clearInterval(timerRef.current);
  }, [stories]);

  if (!stories.length) return <p>Loading latest stories...</p>;

  // Calculate slice of visible stories
  const visibleStories = stories.slice(
    currentIndex,
    currentIndex + VISIBLE_CARDS
  );

  // If at the end and less than VISIBLE_CARDS left, wrap around to start
  if (visibleStories.length < VISIBLE_CARDS) {
    visibleStories.push(...stories.slice(0, VISIBLE_CARDS - visibleStories.length));
  }

  return (
    <div className="w-full overflow-hidden relative select-none">
      <div
        className="flex gap-6"
        style={{
          transform: `translateX(-${(currentIndex / stories.length) * 100}%)`,
          transition: 'transform 0.6s ease-in-out',
          width: `${(stories.length / VISIBLE_CARDS) * 100}%`,
        }}
      >
        {stories.map((story) => {
          const trans = story.translations.find((t) => t.lang_code === 'en') || story.translations[0];
          return (
            <div
              key={story.story_id}
              className="flex-shrink-0 w-[24%] bg-white dark:bg-zinc-900 rounded-lg shadow-md overflow-hidden cursor-pointer"
              // you can add onClick to navigate to story.slug
              style={{ minWidth: '24%' }}
            >
              <div className="relative h-40 w-full">
                <Image
                  src={trans.cover_image}
                  alt={trans.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 25vw"
                  priority={false}
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-sm dark:text-white line-clamp-2">
                  {trans.title}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                  {trans.subtitle}
                </p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-2">
                  {story.read_time_minutes} min read &bull; {story.views.toLocaleString()} views
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
