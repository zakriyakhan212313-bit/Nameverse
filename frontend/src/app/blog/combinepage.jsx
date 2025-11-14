'use client';
import React, { useState, useEffect, useRef } from 'react';
import ArticlesHeroSearch from './articlegrid';
import ArticlesGrid from './Herosection';
import { 
  getLatestArticles, 
  getAllCategories, 
  getArticlesByCategory, 
  searchArticles 
} from '../supabase/controller';

const getCategoryIcon = (category) => {
  const iconMap = {
    'Parenting': '👨‍👩‍👧',
    'Culture': '🌍',
    'Lifestyle': '✨',
    'Technology': '💻',
    'Baby Names': '👶',
    'parenting': '👨‍👩‍👧',
    'culture': '🌍',
    'lifestyle': '✨',
    'technology': '💻',
    'baby-names': '👶',
  };
  return iconMap[category] || '📖';
};

export default function ArticlesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load categories and initial articles
  useEffect(() => {
    if (!isClient) return;
    
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        const categoryNames = await getAllCategories();
        const categoryObjects = [
          { id: 'all', label: 'All Articles', icon: '📚' },
          ...categoryNames.map(cat => ({
            id: cat.toLowerCase().replace(/\s+/g, '-'),
            label: cat,
            icon: getCategoryIcon(cat)
          }))
        ];
        setCategories(categoryObjects);

        const latestArticles = await getLatestArticles(12);
        setArticles(latestArticles);
      } catch (error) {
        console.error('Error loading initial data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [isClient]);

  // Handle category selection
  useEffect(() => {
    if (!isClient || selectedCategory === 'all') {
      if (isClient && selectedCategory === 'all' && !searchQuery) {
        setIsLoading(true);
        getLatestArticles(12).then(data => {
          setArticles(data);
          setIsLoading(false);
        });
      }
      return;
    }

    const loadCategoryArticles = async () => {
      setIsLoading(true);
      try {
        const categoryLabel = categories.find(cat => cat.id === selectedCategory)?.label;
        if (categoryLabel) {
          const categoryArticles = await getArticlesByCategory(categoryLabel, 12);
          setArticles(categoryArticles);
        }
      } catch (error) {
        console.error('Error loading category articles:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategoryArticles();
  }, [selectedCategory, isClient, categories]);

  // Handle search with debouncing
  useEffect(() => {
    if (!isClient) return;

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!searchQuery.trim()) {
      if (selectedCategory === 'all') {
        setIsLoading(true);
        getLatestArticles(12).then(data => {
          setArticles(data);
          setIsLoading(false);
        });
      }
      return;
    }

    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const searchResults = await searchArticles(searchQuery);
        setArticles(searchResults);
      } catch (error) {
        console.error('Error searching articles:', error);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, isClient, selectedCategory]);

  const handleBrowseClick = () => {
    document.querySelector('[data-section="articles-grid"]')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setIsLoading(true);
    getLatestArticles(12).then(data => {
      setArticles(data);
      setIsLoading(false);
    });
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setSearchQuery('');
  };

  if (!isClient) {
    return null;
  }

  return (
    <section 
      className="relative w-full bg-gradient-to-b from-white via-blue-50/30 to-white"
      aria-label="Articles section"
    >
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-0 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 left-0 w-72 h-72 bg-indigo-100/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-100/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Hero + Search Component */}
      <ArticlesHeroSearch
        searchQuery={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
        onClearFilters={handleClearFilters}
        isSearching={isSearching}
        onBrowseClick={handleBrowseClick}
      />

      {/* Articles Grid Component */}
      <ArticlesGrid 
        articles={articles}
        isLoading={isLoading}
        searchQuery={searchQuery}
      />
    </section>
  );
}