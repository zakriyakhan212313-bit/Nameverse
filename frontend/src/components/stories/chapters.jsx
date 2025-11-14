"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import API from "../apiInstance/apiInstance";
import {
  Loader2,
  ArrowLeft,
  Bookmark,
  Share2,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ChapterPage() {
  const { locale, chapterId } = useParams();
  const router = useRouter();

  const [chapterData, setChapterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const fetchChapter = async () => {
      setLoading(true);
      try {
        const { data } = await API.get(
          `/stories/${locale}/chapter/${chapterId}`
        );
        setChapterData(data);
      } catch (err) {
        console.error("Error fetching chapter:", err);
        setChapterData(null);
      } finally {
        setLoading(false);
      }
    };

    if (locale && chapterId) {
      fetchChapter();
    }
  }, [locale, chapterId]);

  const handleBookmark = () => setIsBookmarked((prev) => !prev);

  const handleShare = () => {
    if (!chapterData) return;
    if (navigator.share) {
      navigator
        .share({
          title: chapterData.chapter.title,
          text: chapterData.story_title,
          url: window.location.href,
        })
        .catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  // --- Loading ---
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
        <p className="text-gray-500">Loading chapter...</p>
      </div>
    );
  }

  // --- Chapter Not Found ---
  if (!chapterData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-3 text-gray-500">
        <h2 className="text-xl font-semibold">Chapter not found</h2>
        <Button variant="secondary" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4" /> Go back
        </Button>
      </div>
    );
  }

  const { story_title, chapter } = chapterData;

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="container mx-auto px-4 sm:px-8 py-10 space-y-12"
    >
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>

        <Badge variant="outline" className="text-indigo-600 font-medium">
          {locale?.toUpperCase()}
        </Badge>
      </div>

      {/* Hero Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Left - Title & Intro */}
        <motion.div
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-snug">
            {story_title}
          </h1>
          <h2 className="text-xl text-gray-700">{chapter.title}</h2>

          {/* Short excerpt/intro before image */}
          {chapter.content && (
            <p className="text-gray-600 text-lg line-clamp-4">
              {chapter.content
                .replace(/<[^>]+>/g, "") // strip HTML
                .slice(0, 250)}
              ...
            </p>
          )}

          <div className="flex gap-3 mt-6">
            <Button
              onClick={handleBookmark}
              variant={isBookmarked ? "default" : "outline"}
            >
              <Bookmark
                className="w-5 h-5 mr-1"
                fill={isBookmarked ? "currentColor" : "none"}
              />
              {isBookmarked ? "Bookmarked" : "Bookmark"}
            </Button>
            <Button variant="outline" onClick={handleShare}>
              <Share2 className="w-5 h-5 mr-1" /> Share
            </Button>
          </div>
        </motion.div>

        {/* Right - Image */}
        {chapter.image && (
          <motion.div
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="overflow-hidden rounded-2xl shadow-xl">
              <CardContent className="p-0">
                <img
                  src={chapter.image}
                  alt={chapter.title}
                  className="w-full h-[400px] object-cover"
                />
              </CardContent>
            </Card>
          </motion.div>
        )}
      </section>

      {/* Full-width Content after hero */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="max-w-4xl mx-auto"
      >
        <article className="prose prose-lg md:prose-xl prose-indigo max-w-none text-gray-800 leading-relaxed">
          <div dangerouslySetInnerHTML={{ __html: chapter.content }} />
        </article>
      </motion.section>

      {/* Next Chapter Button */}
      {chapter.next_chapter_slug && (
        <div className="flex justify-center mt-12">
          <Button
            size="lg"
            onClick={() =>
              router.push(`/${locale}/chapter/${chapter.next_chapter_slug}`)
            }
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg rounded-2xl px-8 py-3"
          >
            Continue Reading <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      )}
    </motion.main>
  );
}
