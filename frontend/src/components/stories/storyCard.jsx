'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Eye, Timer } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Map of language codes to full English names
const LANG_NAMES = {
  en: 'English',
  es: 'Spanish',
  de: 'German',
  fr: 'French',
  hi: 'Hindi',
  ur: 'Urdu',
  ar: 'Arabic',
  // add more as needed
};

export default function StoriesGrid({
  stories,
  selectedLanguages,
  setSelectedLanguages,
  className = '',
  gridClassName = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6',
}) {
  const router = useRouter();
  if (!stories.length) return null;

  const featured = stories[0];
  const remainingStories = stories.slice(1);

  const getTranslation = (story) => {
    return (
      story.translations.find((t) => t.lang_code === selectedLanguages[story.story_id]) ||
      story.translations[0]
    );
  };

  const handleStoryClick = (story, langCode) => {
    const slugWithoutPrefix = story.slug.replace(/^stories\//, '');
    router.push(`/stories/${langCode}/${slugWithoutPrefix}`);
  };

  const handleLanguageChange = (storyId, langCode) => {
    setSelectedLanguages((prev) => ({ ...prev, [storyId]: langCode }));
  };

  const renderLanguageSwitcher = (story) => {
    if (!story.translations || story.translations.length <= 1) return null;
    return (
      <select
        value={selectedLanguages[story.story_id]}
        onChange={(e) => handleLanguageChange(story.story_id, e.target.value)}
        className="absolute top-2 right-2 bg-white text-black text-xs px-2 py-1 rounded shadow-sm focus:outline-none"
      >
        {story.translations.map((t) => (
          <option key={t.lang_code} value={t.lang_code}>
            {LANG_NAMES[t.lang_code] || t.lang_code.toUpperCase()}
          </option>
        ))}
      </select>
    );
  };

  return (
    <div className={className}>
      {/* Featured Story */}
      <motion.div
        key={featured.story_id}
        className="relative w-full flex flex-col md:flex-row rounded-lg overflow-hidden shadow-lg border border-gray-200 bg-white hover:border-[#f5c518] transition-all duration-300 mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Language Switcher Top-Right */}
        {renderLanguageSwitcher(featured)}

        <div className="relative w-full md:w-2/5 h-[300px] md:h-[500px]">
          <Image
            src={getTranslation(featured).cover_image}
            alt={getTranslation(featured).title}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex flex-col justify-center p-6 md:w-3/5 text-gray-900">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            {getTranslation(featured).title}
          </h2>

          {getTranslation(featured).subtitle && (
            <p className="text-lg text-gray-600 mb-6">{getTranslation(featured).subtitle}</p>
          )}

          <div className="flex flex-wrap gap-6 text-sm text-gray-500 mb-6">
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4 text-[#f5c518]" />
              {featured.views.toLocaleString()} views
            </span>
            {featured.read_time_minutes && (
              <span className="flex items-center gap-1">
                <Timer className="w-4 h-4" /> {featured.read_time_minutes} min read
              </span>
            )}
            {getTranslation(featured).word_count && (
              <span>{getTranslation(featured).word_count.toLocaleString()} words</span>
            )}
            <span>By {featured.author || 'Unknown'}</span>
          </div>

          <Button
            className="bg-[#f5c518] text-black font-semibold hover:bg-yellow-500"
            onClick={() => handleStoryClick(featured, getTranslation(featured).lang_code)}
          >
            Read Story
          </Button>
        </div>
      </motion.div>

      {/* Grid of Remaining Stories */}
      <div className={gridClassName}>
        {remainingStories.map((story, index) => {
          const trans = getTranslation(story);

          return (
            <motion.div
              key={story.story_id}
              className="relative flex flex-col rounded-lg overflow-hidden shadow-lg border border-gray-200 bg-white hover:border-[#f5c518] transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {/* Language Switcher Top-Right */}
              {renderLanguageSwitcher(story)}

              <div className="relative w-full h-[220px]">
                <Image src={trans.cover_image} alt={trans.title} fill className="object-cover" />
              </div>

              <div className="p-4 flex flex-col justify-between text-gray-900 flex-grow">
                <h3 className="text-xl font-bold mb-2 line-clamp-2">{trans.title}</h3>
                {trans.subtitle && (
                  <p className="text-gray-600 mb-3 line-clamp-3">{trans.subtitle}</p>
                )}

                <div className="flex flex-col gap-3 mt-auto">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>By {story.author || 'Unknown'}</span>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4 text-[#f5c518]" /> {story.views.toLocaleString()}
                      </span>
                      {story.read_time_minutes && (
                        <span className="flex items-center gap-1">
                          <Timer className="w-4 h-4" /> {story.read_time_minutes} min read
                        </span>
                      )}
                    </div>
                  </div>

                  <Button
                    className="bg-[#f5c518] text-black font-semibold hover:bg-yellow-500 mt-2"
                    onClick={() => handleStoryClick(story, trans.lang_code)}
                  >
                    Read Story
                  </Button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
