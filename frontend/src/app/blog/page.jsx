
// ==================== ArticleExplorer.jsx (Fixed) ====================
"use client";
import React, { useEffect, useState } from "react";
import {
  getLatestArticles,
  getAllCategories,
  getArticlesByCategory,
  searchArticles
} from "../supabase/controller";

import HeroSection from "./HeroSection";
import ArticleGrid from "./articlegrid";

export default function ArticleExplorer() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState("All Categories");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      const latest = await getLatestArticles(12);
      const allCats = await getAllCategories();
      
      // Remove duplicates from categories
      const uniqueCats = [...new Set(allCats)];
      
      setArticles(latest);
      setCategories(uniqueCats);
      setSelected("All Categories");
    } catch (error) {
      console.error("Error loading initial data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategory = async (cat) => {
    try {
      setSelected(cat);
      setIsLoading(true);
      
      if (cat === "All Categories") {
        const latest = await getLatestArticles(12);
        setArticles(latest);
      } else {
        const data = await getArticlesByCategory(cat, 12);
        setArticles(data);
      }
    } catch (error) {
      console.error("Error loading category:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (query) => {
    try {
      setIsLoading(true);
      console.log("Searching for:", query); // Debug log
      
      if (!query || query.trim() === "") {
        // If empty search, reload all articles
        const latest = await getLatestArticles(12);
        setArticles(latest);
        setSelected("All Categories");
      } else {
        const res = await searchArticles(query);
        console.log("Search results:", res); // Debug log
        setArticles(res);
        setSelected(`Search: "${query}"`);
      }
    } catch (error) {
      console.error("Error searching:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <HeroSection
        article={articles[0]}
        categories={["All Categories", ...categories]}
        selected={selected}
        onSelect={handleCategory}
        onSearch={handleSearch}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <ArticleGrid articles={articles} isLoading={isLoading} />
      </div>
    </main>
  );
}