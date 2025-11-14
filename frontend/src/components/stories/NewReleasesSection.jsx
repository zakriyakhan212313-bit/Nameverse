"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Eye } from "lucide-react";
import { Bebas_Neue } from "next/font/google";

const bebasNeue = Bebas_Neue({ subsets: ["latin"], weight: "400" });

export default function NewReleasesSection({
  stories,
  selectedLanguages,
  setSelectedLanguages,
}) {
  if (!stories || stories.length === 0) return null;

  const handleLanguageChange = (storyId, langCode) => {
    setSelectedLanguages((prev) => ({ ...prev, [storyId]: langCode }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mb-8 px-4 w-full"
    >
      <div className="relative">
        <div
          className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth px-1 pb-2"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {stories.map((story) => {
            const safeLang =
              selectedLanguages?.[story.story_id] ||
              story.translations?.[0]?.lang_code ||
              "en";

            const translation =
              story.translations?.find((t) => t.lang_code === safeLang) ||
              story.translations?.[0];

            return (
              <motion.div
                key={story.story_id}
                whileHover={{ scale: 1.03, y: -6 }}
                transition={{ type: "spring", stiffness: 200, damping: 18 }}
                tabIndex={0}
                className="flex-none w-[250px] rounded-2xl overflow-hidden relative group cursor-pointer shadow-xl shadow-black/40 bg-[#121212] hover:shadow-[#f5c518]/40 transition-all duration-500"
                style={{ scrollSnapAlign: "start" }}
              >
                {/* Language Switcher */}
                {story.translations.length > 1 && (
                  <div className="absolute top-3 right-3 z-20">
                    <select
                      value={safeLang}
                      onChange={(e) =>
                        handleLanguageChange(story.story_id, e.target.value)
                      }
                      className="bg-black/70 text-white text-xs px-2 py-1 rounded-md shadow-md backdrop-blur-md border border-white/10 focus:outline-none"
                    >
                      {story.translations.map((t) => (
                        <option key={t.lang_code} value={t.lang_code}>
                          {t.lang_code.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {translation?.cover_image ? (
                  <div className="relative w-full h-80">
                    {/* Cover */}
                    <Image
                      src={translation.cover_image}
                      alt={translation.title || "Story cover"}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, 250px"
                    />

                    {/* Info Overlay */}
                    <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                      <h3
                        className={`${bebasNeue.className} text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-white font-bold text-xl line-clamp-2`}
                      >
                        {translation.title || "Untitled Story"}
                      </h3>

                      {translation.subtitle && (
                        <p className="text-gray-300 text-sm line-clamp-2 mb-2">
                          {translation.subtitle}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>By {story.author || "Unknown"}</span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4 text-yellow-400" />{" "}
                          {story.views?.toLocaleString() || 0}
                        </span>
                      </div>

                      {translation.word_count && (
                        <p className="text-xs text-gray-500">
                          {translation.word_count.toLocaleString()} words
                        </p>
                      )}
                    </div>

                    {/* Read Button Overlay */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                      <button className="px-5 py-2 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold shadow-lg hover:shadow-yellow-500/50 transition-all duration-300">
                        Read Now
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-80 bg-gray-800 flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Hide Scrollbar */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </motion.div>
  );
}
