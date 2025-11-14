"use client"
import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import { 
  Heart, Share2, Copy, Facebook, Twitter, MessageCircle, 
  ChevronDown, ChevronUp, ChevronRight, Star, Calendar, 
  Gem, Hash, Globe, BookOpen, Users, TrendingUp, Menu, 
  X, Search, Filter, Download, Eye, Bookmark, ArrowUp,
  Info, Clock, Award, Sparkles, Shield, Crown, Moon, Sun,
  Sparkle, Zap, Target, Palette, Compass, Castle, Rocket,
  Languages, Music, DollarSign, Palette as PaletteIcon, Hash as HashIcon,
  Calendar as CalendarIcon, Gem as GemIcon, Users as UsersIcon,
  Zap as ZapIcon, Crown as CrownIcon, TrendingUp as TrendingUpIcon,
  Award as AwardIcon, Shield as ShieldIcon
} from 'lucide-react';

// Field configuration mapping
const fieldConfig = {
  // Basic Information
  name: { icon: Crown, label: 'Name', type: 'text', priority: 1 },
  slug: { icon: BookOpen, label: 'Slug', type: 'text', priority: 99, hidden: true },
  language: { icon: Languages, label: 'Languages', type: 'array', priority: 2 },
  gender: { icon: Users, label: 'Gender', type: 'text', priority: 2 },
  origin: { icon: Globe, label: 'Origin', type: 'text', priority: 2 },
  religion: { icon: Shield, label: 'Religion', type: 'text', priority: 2 },
  category: { icon: BookOpen, label: 'Categories', type: 'array', priority: 3 },
  themes: { icon: Sparkles, label: 'Themes', type: 'array', priority: 3 },

  // Meanings
  short_meaning: { icon: Zap, label: 'Short Meaning', type: 'text', priority: 1 },
  long_meaning: { icon: BookOpen, label: 'Long Meaning', type: 'text', priority: 2 },
  spiritual_meaning: { icon: Sparkle, label: 'Spiritual Meaning', type: 'text', priority: 3 },

  // Personality & Traits
  emotional_traits: { icon: Heart, label: 'Emotional Traits', type: 'array', priority: 3 },
  hidden_personality_traits: { icon: Eye, label: 'Hidden Personality', type: 'special-array', priority: 4 },

  // Numerology & Luck
  lucky_number: { icon: HashIcon, label: 'Lucky Number', type: 'number', priority: 3 },
  lucky_day: { icon: CalendarIcon, label: 'Lucky Day', type: 'text', priority: 3 },
  lucky_colors: { icon: PaletteIcon, label: 'Lucky Colors', type: 'array', priority: 3 },
  lucky_stone: { icon: GemIcon, label: 'Lucky Stone', type: 'text', priority: 3 },
  life_path_number: { icon: HashIcon, label: 'Life Path Number', type: 'number', priority: 3 },
  numerology_meaning: { icon: Star, label: 'Numerology Meaning', type: 'text', priority: 3 },

  // Language Specific
  in_arabic: { icon: Globe, label: 'Arabic Meaning', type: 'object', priority: 4 },
  in_urdu: { icon: Globe, label: 'Urdu Meaning', type: 'object', priority: 4 },
  in_hindi: { icon: Globe, label: 'Hindi Meaning', type: 'object', priority: 4 },
  in_pashto: { icon: Globe, label: 'Pashto Meaning', type: 'object', priority: 4 },

  // Pronunciation
  pronunciation: { icon: Languages, label: 'Pronunciation', type: 'object', priority: 4 },

  // Cultural & Modern
  celebrity_usage: { icon: Award, label: 'Celebrity Usage', type: 'array', priority: 5 },
  related_names: { icon: Users, label: 'Related Names', type: 'array', priority: 5 },
  similar_sounding_names: { icon: Music, label: 'Similar Names', type: 'array', priority: 5 },
  cultural_impact: { icon: Globe, label: 'Cultural Impact', type: 'text', priority: 5 },
  historical_references: { icon: Clock, label: 'Historical References', type: 'array-object', priority: 5 },
  modern_usage: { icon: TrendingUpIcon, label: 'Modern Usage', type: 'object', priority: 5 },
  spiritual_significance: { icon: Sparkles, label: 'Spiritual Significance', type: 'text', priority: 4 },
  spiritual_symbolism: { icon: Zap, label: 'Spiritual Symbolism', type: 'text', priority: 4 },

  // Additional Language Meanings
  meanings_by_language: { icon: Languages, label: 'Meanings by Language', type: 'object', priority: 4 },
  in_english: { icon: Globe, label: 'English Meaning', type: 'object', priority: 4 },

  // SEO & Social
  social_tags: { icon: Hash, label: 'Social Tags', type: 'array', priority: 99, hidden: true },
  seo: { icon: Search, label: 'SEO', type: 'object', priority: 99, hidden: true },
  share_options: { icon: Share2, label: 'Share Options', type: 'object', priority: 99, hidden: true },
  monetization: { icon: DollarSign, label: 'Monetization', type: 'object', priority: 99, hidden: true },

  // Technical Fields
  _id: { icon: Hash, label: 'ID', type: 'text', priority: 99, hidden: true },
  created_at: { icon: Calendar, label: 'Created', type: 'date', priority: 99, hidden: true },
  updated_at: { icon: Calendar, label: 'Updated', type: 'date', priority: 99, hidden: true },
  __v: { icon: Hash, label: 'Version', type: 'number', priority: 99, hidden: true },
};

// Helper function to render different field types
const renderFieldValue = (fieldName, value, config) => {
  if (!value) return null;

  switch (config.type) {
    case 'array':
      return (
        <div className="flex flex-wrap gap-2">
          {value.map((item, index) => (
            <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm">
              {item}
            </span>
          ))}
        </div>
      );

    case 'special-array': // For hidden_personality_traits format
      return (
        <div className="space-y-2">
          {value.map((item, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <span className="font-semibold text-gray-600">{item.split(' = ')[0]}:</span>
              <span className="text-gray-700">{item.split(' = ')[1]}</span>
            </div>
          ))}
        </div>
      );

    case 'array-object': // For historical_references
      return (
        <div className="space-y-3">
          {value.map((item, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-lg">
              <div className="font-semibold text-gray-900">{item.reference}</div>
              <div className="text-sm text-gray-600 mt-1">{item.time_period} • {item.context}</div>
            </div>
          ))}
        </div>
      );

    case 'object':
      if (fieldName.startsWith('in_') || fieldName === 'in_english') {
        // Language meaning objects
        return (
          <div className="p-4 bg-gray-50 rounded-xl">
            {value.name && (
              <div className="mb-2">
                <div className="font-semibold text-gray-900">Name:</div>
                <div className="text-lg text-gray-700" dir={fieldName === 'in_arabic' || fieldName === 'in_urdu' || fieldName === 'in_pashto' ? 'rtl' : 'ltr'}>
                  {value.name}
                </div>
              </div>
            )}
            {value.meaning && (
              <div className="mb-2">
                <div className="font-semibold text-gray-900">Meaning:</div>
                <div className="text-gray-700">{value.meaning}</div>
              </div>
            )}
            {value.long_meaning && (
              <div>
                <div className="font-semibold text-gray-900">Detailed Meaning:</div>
                <div className="text-gray-700">{value.long_meaning}</div>
              </div>
            )}
          </div>
        );
      }
      
      if (fieldName === 'pronunciation') {
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(value).map(([lang, pron]) => (
              <div key={lang} className="p-3 bg-gray-50 rounded-lg">
                <div className="font-semibold text-gray-900 capitalize">{lang}:</div>
                <div className="text-gray-700">{pron}</div>
              </div>
            ))}
          </div>
        );
      }

      if (fieldName === 'modern_usage') {
        return (
          <div className="space-y-3">
            {value.trends && (
              <div>
                <div className="font-semibold text-gray-900">Trends:</div>
                <div className="flex flex-wrap gap-2 mt-1">
                  {value.trends.map((trend, index) => (
                    <span key={index} className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm">
                      {trend}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {value.platforms && (
              <div>
                <div className="font-semibold text-gray-900">Platforms:</div>
                <div className="flex flex-wrap gap-2 mt-1">
                  {value.platforms.map((platform, index) => (
                    <span key={index} className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-sm">
                      {platform}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {value.modern_context && (
              <div>
                <div className="font-semibold text-gray-900">Modern Context:</div>
                <div className="text-gray-700">{value.modern_context}</div>
              </div>
            )}
          </div>
        );
      }

      // Generic object display
      return (
        <div className="space-y-2">
          {Object.entries(value).map(([key, val]) => (
            <div key={key} className="flex justify-between">
              <span className="text-gray-600 capitalize">{key.replace(/_/g, ' ')}:</span>
              <span className="font-semibold text-gray-900">{val?.toString()}</span>
            </div>
          ))}
        </div>
      );

    case 'text':
      return <p className="text-gray-700 leading-relaxed">{value}</p>;

    case 'number':
      return <span className="text-2xl font-bold text-indigo-600">{value}</span>;

    case 'date':
      return <span className="text-gray-700">{new Date(value).toLocaleDateString()}</span>;

    default:
      return <span className="text-gray-700">{value?.toString()}</span>;
  }
};

// Group fields by category for tabs
const groupFieldsByCategory = (data) => {
  const categories = {
    overview: ['name', 'slug', 'short_meaning', 'long_meaning', 'language', 'gender', 'origin', 'religion', 'category', 'themes'],
    meanings: ['in_arabic', 'in_urdu', 'in_hindi', 'in_pashto', 'in_english', 'meanings_by_language', 'pronunciation'],
    spiritual: ['spiritual_meaning', 'spiritual_significance', 'spiritual_symbolism', 'emotional_traits', 'hidden_personality_traits'],
    numerology: ['lucky_number', 'lucky_day', 'lucky_colors', 'lucky_stone', 'life_path_number', 'numerology_meaning'],
    cultural: ['cultural_impact', 'historical_references', 'celebrity_usage', 'related_names', 'similar_sounding_names'],
    modern: ['modern_usage', 'social_tags', 'user_stories']
  };

  const result = {};
  
  Object.entries(categories).forEach(([category, fields]) => {
    result[category] = fields
      .map(fieldName => ({
        name: fieldName,
        value: data[fieldName],
        config: fieldConfig[fieldName]
      }))
      .filter(item => item.value !== undefined && item.value !== null && !item.config?.hidden);
  });

  return result;
};

export default function NameDetail({ data, faqData = [] }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [openFaq, setOpenFaq] = useState(null);
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const tabsContainerRef = useRef(null);
  const [touchStart, setTouchStart] = useState(0);

  // Fix hydration by ensuring this only runs on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Group fields by category
  const fieldCategories = groupFieldsByCategory(data || {});

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setShowScrollTop(window.scrollY > 400);
    };
    
    // Only add event listener on client side
    if (isClient) {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [isClient]);

  // Enhanced mobile tabs swipe functionality
  useEffect(() => {
    if (!isClient) return;

    const container = tabsContainerRef.current;
    if (!container) return;

    const handleTouchStart = (e) => {
      setTouchStart(e.touches[0].clientX);
    };

    const handleTouchMove = (e) => {
      if (!touchStart) return;
      
      const touchEnd = e.touches[0].clientX;
      const diff = touchStart - touchEnd;
      
      if (Math.abs(diff) > 50) {
        const tabs = Object.keys(fieldCategories);
        const currentIndex = tabs.indexOf(activeTab);
        
        if (diff > 0 && currentIndex < tabs.length - 1) {
          setActiveTab(tabs[currentIndex + 1]);
        } else if (diff < 0 && currentIndex > 0) {
          setActiveTab(tabs[currentIndex - 1]);
        }
        
        setTouchStart(0);
      }
    };

    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchmove', handleTouchMove);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
    };
  }, [activeTab, touchStart, fieldCategories, isClient]);

  // Fallback for missing data
  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <div className="text-center p-8 bg-white rounded-3xl shadow-xl border">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-100 to-pink-100 rounded-2xl flex items-center justify-center">
            <Search className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Name Not Found</h1>
          <p className="text-gray-600 mb-6">The requested name could not be found.</p>
          <a href="/names" className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
            Browse All Names
          </a>
        </div>
      </div>
    );
  }

  const handleShare = (platform) => {
    const url = isClient ? window.location.href : '';
    const text = `Discover the meaning of ${data.name}: ${data.short_meaning}`;
    
    switch(platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
        break;
      case 'copy':
        if (isClient) {
          navigator.clipboard.writeText(url).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          });
        }
        break;
    }
  };

  const scrollToTop = () => {
    if (isClient) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BookOpen, gradient: 'from-blue-500 to-cyan-500' },
    { id: 'meanings', label: 'Languages', icon: Globe, gradient: 'from-emerald-500 to-teal-500' },
    { id: 'spiritual', label: 'Spiritual', icon: Sparkles, gradient: 'from-purple-500 to-pink-500' },
    { id: 'numerology', label: 'Numerology', icon: Star, gradient: 'from-amber-500 to-orange-500' },
    { id: 'cultural', label: 'Cultural', icon: Users, gradient: 'from-rose-500 to-red-500' },
    { id: 'modern', label: 'Modern', icon: TrendingUp, gradient: 'from-indigo-500 to-blue-500' }
  ];

  // Remove problematic attributes that cause hydration errors
  const cleanProps = {
    suppressHydrationWarning: true
  };

  return (
    <>
      <Head>
        <title>{data.name} Name Meaning & Origin - NameVerse</title>
        <meta name="description" content={`Discover ${data.name}: ${data.short_meaning}. ${data.origin} origin, ${data.religion} significance. Complete name analysis.`} />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        {/* Hero Section */}
        <section className="pt-8 pb-8 lg:pt-12 lg:pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Action Buttons - Integrated in the page */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <Crown className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">NameVerse</span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setBookmarked(!bookmarked)}
                  className={`p-2 rounded-xl transition-all ${
                    bookmarked ? 'bg-yellow-400 text-white' : 'bg-white text-gray-600 shadow-md'
                  }`}
                  {...cleanProps}
                >
                  <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={() => setLiked(!liked)}
                  className={`p-2 rounded-xl transition-all ${
                    liked ? 'bg-red-500 text-white' : 'bg-white text-gray-600 shadow-md'
                  }`}
                  {...cleanProps}
                >
                  <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="lg:hidden p-2 rounded-xl bg-white text-gray-600 shadow-md"
                  {...cleanProps}
                >
                  {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="text-center space-y-6">
              <div className="flex flex-wrap justify-center gap-2">
                {data.religion && (
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-xl text-sm font-medium">
                    {data.religion}
                  </span>
                )}
                {data.gender && (
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-xl text-sm font-medium">
                    {data.gender}
                  </span>
                )}
                {data.origin && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-xl text-sm font-medium">
                    {data.origin}
                  </span>
                )}
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-gray-900">
                {data.name}
              </h1>
              
              <p className="text-xl sm:text-2xl text-gray-700 font-semibold max-w-2xl mx-auto">
                &quot;{data.short_meaning}&quot;
              </p>

              {/* Quick Stats */}
              <div className="flex flex-wrap justify-center gap-4 pt-4">
                {data.lucky_number && (
                  <div className="text-center">
                    <div className="w-12 h-12 bg-indigo-500 text-white rounded-xl flex items-center justify-center text-lg font-bold mx-auto mb-1">
                      {data.lucky_number}
                    </div>
                    <div className="text-xs text-gray-600">Lucky Number</div>
                  </div>
                )}
                {data.lucky_day && (
                  <div className="text-center">
                    <div className="w-12 h-12 bg-emerald-500 text-white rounded-xl flex items-center justify-center text-sm font-bold mx-auto mb-1">
                      {data.lucky_day.substring(0, 3)}
                    </div>
                    <div className="text-xs text-gray-600">Lucky Day</div>
                  </div>
                )}
                {data.lucky_stone && (
                  <div className="text-center">
                    <div className="w-12 h-12 bg-amber-500 text-white rounded-xl flex items-center justify-center mx-auto mb-1">
                      <Gem className="w-6 h-6" />
                    </div>
                    <div className="text-xs text-gray-600">Lucky Stone</div>
                  </div>
                )}
                {data.life_path_number && (
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-500 text-white rounded-xl flex items-center justify-center text-lg font-bold mx-auto mb-1">
                      {data.life_path_number}
                    </div>
                    <div className="text-xs text-gray-600">Life Path</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="fixed inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
            <div className="fixed top-20 right-4 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-4">
              <div className="space-y-3">
                <button
                  onClick={() => { setBookmarked(!bookmarked); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                    bookmarked ? 'bg-yellow-400 text-white' : 'bg-gray-50'
                  }`}
                  {...cleanProps}
                >
                  <Bookmark className="w-4 h-4" />
                  {bookmarked ? 'Bookmarked' : 'Bookmark'}
                </button>
                
                <button
                  onClick={() => { setLiked(!liked); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                    liked ? 'bg-red-500 text-white' : 'bg-gray-50'
                  }`}
                  {...cleanProps}
                >
                  <Heart className="w-4 h-4" />
                  {liked ? 'Liked' : 'Like'}
                </button>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  {['facebook', 'twitter', 'whatsapp', 'copy'].map((platform) => (
                    <button
                      key={platform}
                      onClick={() => { handleShare(platform); setMobileMenuOpen(false); }}
                      className="flex items-center justify-center gap-1 p-2 bg-gray-100 rounded-lg text-sm"
                      {...cleanProps}
                    >
                      {platform === 'facebook' && <Facebook className="w-3 h-3" />}
                      {platform === 'twitter' && <Twitter className="w-3 h-3" />}
                      {platform === 'whatsapp' && <MessageCircle className="w-3 h-3" />}
                      {platform === 'copy' && <Copy className="w-3 h-3" />}
                      {platform}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Mobile Tabs with Swipe */}
        <nav className="sticky top-0 z-30 bg-white/95 backdrop-blur-lg border-b" ref={tabsContainerRef}>
          <div className="max-w-7xl mx-auto">
            <div className="flex overflow-x-auto scrollbar-hide">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 font-semibold whitespace-nowrap border-b-2 transition-all min-w-max ${
                      activeTab === tab.id
                        ? `border-gradient ${tab.gradient} text-gray-900`
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                    {...cleanProps}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Mobile Tab Indicator */}
        <div className="lg:hidden bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center py-2 text-xs text-gray-500">
              <span>Swipe ← → to navigate</span>
              <span>{tabs.findIndex(tab => tab.id === activeTab) + 1} of {tabs.length}</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Content Area */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* Dynamically Render Tab Content */}
              {Object.entries(fieldCategories).map(([category, fields]) => (
                activeTab === category && (
                  <div key={category} className="bg-white rounded-2xl p-6 shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 capitalize">
                      {tabs.find(tab => tab.id === category)?.label || category}
                    </h2>
                    
                    <div className="space-y-6">
                      {fields.map(({ name, value, config }) => (
                        <div key={name} className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0">
                          <div className="flex items-center gap-3 mb-3">
                            {config.icon && (
                              <div className={`w-8 h-8 bg-gradient-to-br ${config.icon === Crown ? 'from-amber-500 to-orange-500' : 'from-blue-500 to-cyan-500'} rounded-lg flex items-center justify-center`}>
                                <config.icon className="w-4 h-4 text-white" />
                              </div>
                            )}
                            <h3 className="text-lg font-semibold text-gray-900 capitalize">
                              {config.label || name.replace(/_/g, ' ')}
                            </h3>
                          </div>
                          
                          <div className="ml-11">
                            {renderFieldValue(name, value, config)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              ))}

              {/* Fallback for empty categories */}
              {fieldCategories[activeTab]?.length === 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
                    <Info className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Information Available</h3>
                  <p className="text-gray-600">There&apos;s no {activeTab} information available for this name.</p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-1 space-y-6">
              
              {/* Quick Facts */}
              <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-32">
                <h3 className="font-bold text-gray-900 mb-4">Quick Facts</h3>
                <div className="space-y-3">
                  {data.origin && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Origin</span>
                      <span className="font-semibold">{data.origin}</span>
                    </div>
                  )}
                  {data.religion && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Religion</span>
                      <span className="font-semibold">{data.religion}</span>
                    </div>
                  )}
                  {data.gender && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gender</span>
                      <span className="font-semibold">{data.gender}</span>
                    </div>
                  )}
                  {data.language?.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Languages</span>
                      <span className="font-semibold">{data.language.length}</span>
                    </div>
                  )}
                  {data.category?.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Categories</span>
                      <span className="font-semibold">{data.category.length}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Share Card */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="font-bold text-gray-900 mb-4">Share This Name</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => handleShare('facebook')}
                          className="flex items-center gap-2 p-2 bg-blue-500 text-white rounded-lg text-sm justify-center"
                          {...cleanProps}>
                    <Facebook className="w-3 h-3" />
                    Facebook
                  </button>
                  <button onClick={() => handleShare('twitter')}
                          className="flex items-center gap-2 p-2 bg-sky-400 text-white rounded-lg text-sm justify-center"
                          {...cleanProps}>
                    <Twitter className="w-3 h-3" />
                    Twitter
                  </button>
                  <button onClick={() => handleShare('whatsapp')}
                          className="flex items-center gap-2 p-2 bg-green-500 text-white rounded-lg text-sm justify-center"
                          {...cleanProps}>
                    <MessageCircle className="w-3 h-3" />
                    WhatsApp
                  </button>
                  <button onClick={() => handleShare('copy')}
                          className="flex items-center gap-2 p-2 bg-gray-600 text-white rounded-lg text-sm justify-center"
                          {...cleanProps}>
                    <Copy className="w-3 h-3" />
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* Languages Card */}
              {data.language?.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="font-bold text-gray-900 mb-4">Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {data.language.map((lang, index) => (
                      <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-sm">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>

          {/* FAQ Section */}
          {faqData?.length > 0 && (
            <section className="mt-12 bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">FAQ</h2>
              <div className="space-y-3">
                {faqData.map((faq, index) => (
                  <div key={index} className="border rounded-xl overflow-hidden">
                    <button onClick={() => setOpenFaq(openFaq === index ? null : index)}
                            className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-50"
                            {...cleanProps}>
                      <span className="font-semibold">{faq.q}</span>
                      {openFaq === index ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    {openFaq === index && (
                      <div className="p-4 pt-0">
                        <p className="text-gray-700">{faq.a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>

        {/* Scroll to Top */}
        {showScrollTop && (
          <button onClick={scrollToTop}
                  className="fixed bottom-6 right-6 w-12 h-12 bg-indigo-500 text-white rounded-xl shadow-lg hover:bg-indigo-600 transition-all z-50 flex items-center justify-center"
                  {...cleanProps}>
            <ArrowUp className="w-5 h-5" />
          </button>
        )}
      </div>
    </>
  );
}