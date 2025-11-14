import { useState, useEffect, useCallback, memo, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Globe2, 
  BookOpen, 
  Search,
  Filter,
  TrendingUp,
  Heart,
  X
} from 'lucide-react';

// ==========================================
// CONFIGURATION & CONSTANTS
// ==========================================

const RELIGIONS_CONFIG = [
  { value: 'christian', label: 'Christian', icon: '✝️' },
  { value: 'muslim', label: 'Muslim', icon: '☪️' },
  { value: 'hindu', label: 'Hindu', icon: '🕉️' },
  { value: 'jewish', label: 'Jewish', icon: '✡️' },
  { value: 'buddhist', label: 'Buddhist', icon: '☸️' }
];

const GENDER_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'male', label: 'Boy' },
  { value: 'female', label: 'Girl' },
  { value: 'unisex', label: 'Unisex' }
];

const GENDER_COLORS = {
  male: 'bg-blue-50 text-blue-700',
  female: 'bg-pink-50 text-pink-700',
  unisex: 'bg-purple-50 text-purple-700'
};

// Generate mock data
function generateMockNames(religion, count = 200) {
  const bases = {
    christian: ['John', 'Mary', 'David', 'Sarah', 'Michael', 'Rebecca', 'James', 'Elizabeth'],
    muslim: ['Mohammed', 'Aisha', 'Ali', 'Fatima', 'Omar', 'Khadija', 'Hassan', 'Zainab'],
    hindu: ['Arjun', 'Priya', 'Krishna', 'Lakshmi', 'Rohan', 'Sita', 'Aditya', 'Ananya'],
    jewish: ['Abraham', 'Esther', 'Isaac', 'Rachel', 'Jacob', 'Leah', 'Noah', 'Hannah'],
    buddhist: ['Bodhi', 'Maya', 'Siddhartha', 'Tara', 'Ashoka', 'Pema', 'Karma', 'Dawa']
  };

  const meanings = [
    'Gift from God', 'Blessed one', 'Divine light', 'Noble spirit',
    'Peaceful soul', 'Brave warrior', 'Pure heart', 'Joyful one'
  ];

  const currentBase = bases[religion] || bases.christian;
  
  return Array.from({ length: count }, (_, i) => {
    const baseName = currentBase[i % currentBase.length];
    const gender = ['male', 'female', 'unisex'][Math.floor(Math.random() * 3)];
    
    return {
      id: `${religion}-${i}`,
      name: baseName,
      slug: `${baseName}-${i}`.toLowerCase(),
      gender,
      meaning: meanings[Math.floor(Math.random() * meanings.length)],
      pronunciation: baseName.toLowerCase(),
      origin: religion.charAt(0).toUpperCase() + religion.slice(1),
      popularity: Math.floor(Math.random() * 100) + 1,
      trending: Math.random() > 0.85
    };
  });
}

// ==========================================
// OPTIMIZED SKELETON (Mobile-First)
// ==========================================

const NamesSkeleton = memo(function NamesSkeleton() {
  return (
    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg p-4 border animate-pulse">
          <div className="h-5 bg-gray-200 rounded w-2/3 mb-2" />
          <div className="h-3 bg-gray-100 rounded w-1/2 mb-3" />
          <div className="h-3 bg-gray-100 rounded mb-2" />
          <div className="h-3 bg-gray-100 rounded w-4/5" />
        </div>
      ))}
    </div>
  );
});

// ==========================================
// OPTIMIZED NAME CARD (Minimal, Fast)
// ==========================================

const NameCard = memo(function NameCard({ name }) {
  return (
    <article className="bg-white rounded-lg p-4 border hover:border-blue-300 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-gray-900 text-lg">{name.name}</h3>
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${GENDER_COLORS[name.gender]}`}>
          {name.gender}
        </span>
      </div>
      
      {name.pronunciation && (
        <p className="text-xs text-gray-500 mb-2">/{name.pronunciation}/</p>
      )}
      
      <p className="text-sm text-gray-600 mb-3">{name.meaning}</p>
      
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <Globe2 className="w-3 h-3" />
          {name.origin}
        </span>
        {name.trending && (
          <span className="flex items-center gap-1 text-orange-600 font-medium">
            <TrendingUp className="w-3 h-3" />
            Trending
          </span>
        )}
      </div>
    </article>
  );
});

// ==========================================
// COMPACT FILTER BAR (Mobile-First)
// ==========================================

const FilterBar = memo(function FilterBar({ 
  religion, 
  gender, 
  sort, 
  search,
  onReligionChange, 
  onGenderChange, 
  onSortChange,
  onSearchChange,
  totalCount 
}) {
  const [showFilters, setShowFilters] = useState(false);
  const [localSearch, setLocalSearch] = useState(search);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearchChange(localSearch);
  };

  return (
    <div className="sticky top-0 z-30 bg-white border-b mb-4 shadow-sm">
      <div className="max-w-6xl mx-auto px-3 py-3">
        {/* Mobile: Compact Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{RELIGIONS_CONFIG.find(r => r.value === religion)?.icon}</span>
            <div>
              <h1 className="text-lg font-bold text-gray-900">
                {RELIGIONS_CONFIG.find(r => r.value === religion)?.label} Names
              </h1>
              <p className="text-xs text-gray-500">{totalCount.toLocaleString()} names</p>
            </div>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden p-2 rounded-lg border hover:bg-gray-50"
          >
            {showFilters ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
          </button>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="mb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search names..."
              className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </form>

        {/* Filters (Collapsible on Mobile) */}
        <div className={`space-y-3 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          {/* Religion Tabs - Horizontal Scroll on Mobile */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-3 px-3 scrollbar-hide">
            {RELIGIONS_CONFIG.map((r) => (
              <button
                key={r.value}
                onClick={() => onReligionChange(r.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  religion === r.value
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{r.icon}</span>
                <span>{r.label}</span>
              </button>
            ))}
          </div>

          {/* Gender & Sort Filters */}
          <div className="flex flex-wrap gap-2">
            {GENDER_OPTIONS.map((g) => (
              <button
                key={g.value || 'all'}
                onClick={() => onGenderChange(g.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  gender === g.value
                    ? 'bg-gray-900 text-white'
                    : 'bg-white border hover:bg-gray-50'
                }`}
              >
                {g.label}
              </button>
            ))}
            <div className="w-px bg-gray-200" />
            <button
              onClick={() => onSortChange('asc')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                sort === 'asc' ? 'bg-gray-900 text-white' : 'bg-white border hover:bg-gray-50'
              }`}
            >
              A→Z
            </button>
            <button
              onClick={() => onSortChange('desc')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                sort === 'desc' ? 'bg-gray-900 text-white' : 'bg-white border hover:bg-gray-50'
              }`}
            >
              Z→A
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

// ==========================================
// SIMPLIFIED PAGINATION
// ==========================================

const Pagination = memo(function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <nav className="flex items-center justify-center gap-1 mt-6 mb-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {start > 1 && (
        <>
          <button onClick={() => onPageChange(1)} className="px-3 py-1.5 text-sm rounded-lg border hover:bg-gray-50">
            1
          </button>
          {start > 2 && <span className="px-2 text-gray-400">...</span>}
        </>
      )}

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1.5 text-sm rounded-lg font-medium ${
            page === currentPage
              ? 'bg-blue-600 text-white'
              : 'border hover:bg-gray-50'
          }`}
        >
          {page}
        </button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="px-2 text-gray-400">...</span>}
          <button onClick={() => onPageChange(totalPages)} className="px-3 py-1.5 text-sm rounded-lg border hover:bg-gray-50">
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
});

// ==========================================
// MAIN APP COMPONENT
// ==========================================

export default function ReligionNamesApp() {
  const [religion, setReligion] = useState('christian');
  const [gender, setGender] = useState('');
  const [sort, setSort] = useState('asc');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const itemsPerPage = 24;
  
  // Generate all names for selected religion
  const allNames = generateMockNames(religion, 200);
  
  // Filter and sort
  const filteredNames = allNames
    .filter(name => {
      const matchesGender = !gender || name.gender === gender;
      const matchesSearch = !search || 
        name.name.toLowerCase().includes(search.toLowerCase()) ||
        name.meaning.toLowerCase().includes(search.toLowerCase());
      return matchesGender && matchesSearch;
    })
    .sort((a, b) => {
      return sort === 'asc' 
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    });

  // Paginate
  const totalPages = Math.ceil(filteredNames.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedNames = filteredNames.slice(startIndex, startIndex + itemsPerPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [religion, gender, sort, search]);

  // Simulate loading for filter changes
  const handleFilterChange = (callback) => {
    setIsLoading(true);
    callback();
    setTimeout(() => setIsLoading(false), 300);
  };

  // Scroll to top on page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <FilterBar
        religion={religion}
        gender={gender}
        sort={sort}
        search={search}
        onReligionChange={(val) => handleFilterChange(() => setReligion(val))}
        onGenderChange={(val) => handleFilterChange(() => setGender(val))}
        onSortChange={(val) => handleFilterChange(() => setSort(val))}
        onSearchChange={(val) => handleFilterChange(() => setSearch(val))}
        totalCount={filteredNames.length}
      />

      <main className="max-w-6xl mx-auto px-3 pb-8">
        {isLoading ? (
          <NamesSkeleton />
        ) : displayedNames.length > 0 ? (
          <>
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {displayedNames.map((name) => (
                <NameCard key={name.id} name={name} />
              ))}
            </div>
            
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg border">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">No names found</h3>
            <p className="text-sm text-gray-600 mb-4">Try adjusting your filters</p>
            <button
              onClick={() => {
                setGender('');
                setSearch('');
                setSort('asc');
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Info Section */}
        <section className="mt-8 bg-white rounded-lg p-6 border">
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            About {RELIGIONS_CONFIG.find(r => r.value === religion)?.label} Names
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            Discover meaningful names with authentic cultural significance. Each name in our collection 
            has been carefully researched for accurate meanings, origins, and pronunciation guides.
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <BookOpen className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-sm mb-1">Verified</h3>
              <p className="text-xs text-gray-600">Accurate meanings</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Globe2 className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-sm mb-1">Cultural</h3>
              <p className="text-xs text-gray-600">Rich heritage</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Sparkles className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold text-sm mb-1">Updated</h3>
              <p className="text-xs text-gray-600">Fresh additions</p>
            </div>
          </div>
        </section>
      </main>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}