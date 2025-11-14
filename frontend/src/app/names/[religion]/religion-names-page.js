// Shared constants and configurations
export const RELIGIONS_CONFIG = [
  {
    value: 'christian',
    label: 'Christian',
    icon: '✝️'
  },
  {
    value: 'muslim',
    label: 'Muslim', 
    icon: '☪️'
  },
  {
    value: 'hindu',
    label: 'Hindu',
    icon: '🕉️'
  },
  {
    value: 'jewish',
    label: 'Jewish',
    icon: '✡️'
  },
  {
    value: 'buddhist',
    label: 'Buddhist',
    icon: '☸️'
  }
];

export const GENDER_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'male', label: 'Boy' },
  { value: 'female', label: 'Girl' },
  { value: 'unisex', label: 'Unisex' }
];

export const GENDER_COLORS = {
  male: 'bg-blue-100 text-blue-800 border-blue-200',
  female: 'bg-pink-100 text-pink-800 border-pink-200', 
  unisex: 'bg-purple-100 text-purple-800 border-purple-200'
};

export const RELIGION_DESCRIPTIONS = {
  christian: 'Christian names often have biblical origins, honoring saints, apostles, and figures from the Bible. These names carry deep spiritual meaning and reflect Christian values and heritage.',
  muslim: 'Muslim names are typically derived from Arabic origins and often reflect the attributes of Allah, honor prophets, or carry beautiful meanings that inspire virtuous qualities.',
  hindu: 'Hindu names are deeply rooted in Sanskrit and often derived from gods, goddesses, sacred texts, and natural elements. They carry spiritual significance and cultural heritage.',
  jewish: 'Jewish names often honor ancestors and biblical figures, with many names having Hebrew origins that reflect Jewish history, culture, and religious traditions.',
  buddhist: 'Buddhist names are inspired by the teachings of Buddha, virtues like compassion and wisdom, and often have origins in Pali and Sanskrit languages.'
};

export const DEFAULT_LIMIT = 24;
export const DEFAULT_PAGE = 1;
export const DEFAULT_SORT = 'asc';
export const SEARCH_DEBOUNCE_MS = 300;
export const INFINITE_SCROLL_THRESHOLD = 100;
export const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Enhanced data fetching with caching and error handling
const namesCache = new Map();

export async function getNamesData(religion, params = {}) {
  const {
    page = DEFAULT_PAGE,
    limit = DEFAULT_LIMIT,
    sort = DEFAULT_SORT,
    gender = '',
    search = ''
  } = params;

  const cacheKey = `${religion}-${page}-${limit}-${sort}-${gender}-${search}`;
  const cached = namesCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  try {
    // Simulate API call - replace with actual API endpoint
    const response = await fetch(`/api/names/${religion}?${new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sort,
      gender,
      search
    })}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch names: ${response.status}`);
    }

    const data = await response.json();
    
    // Enhanced data structure with analytics
    const enhancedData = {
      ...data,
      names: data.names.map(name => ({
        ...name,
        popularity: calculatePopularityScore(name),
        trending: isTrending(name),
        similarity: findSimilarNames(name, data.names)
      })),
      metadata: {
        fetchedAt: new Date().toISOString(),
        religion,
        filters: { gender, sort, search },
        analytics: {
          genderDistribution: calculateGenderDistribution(data.names),
          originDistribution: calculateOriginDistribution(data.names),
          popularityStats: calculatePopularityStats(data.names)
        }
      }
    };

    namesCache.set(cacheKey, {
      data: enhancedData,
      timestamp: Date.now()
    });

    return enhancedData;
  } catch (error) {
    console.error('Error fetching names:', error);
    
    // Fallback to mock data if API fails
    return getMockNamesData(religion, page, limit, sort, gender);
  }
}

// Enhanced utility functions
function calculatePopularityScore(name) {
  // Implement popularity algorithm based on:
  // - Search frequency
  // - User engagement
  // - Historical data
  return Math.floor(Math.random() * 100) + 1;
}

function isTrending(name) {
  // Implement trending detection logic
  return Math.random() > 0.7;
}

function findSimilarNames(currentName, allNames) {
  return allNames
    .filter(name => 
      name.id !== currentName.id && 
      (name.meaning.includes(currentName.meaning.substring(0, 3)) ||
       name.origin === currentName.origin)
    )
    .slice(0, 3)
    .map(name => ({ id: name.id, name: name.name, slug: name.slug }));
}

function calculateGenderDistribution(names) {
  const distribution = { male: 0, female: 0, unisex: 0 };
  names.forEach(name => distribution[name.gender]++);
  return distribution;
}

function calculateOriginDistribution(names) {
  const origins = {};
  names.forEach(name => {
    origins[name.origin] = (origins[name.origin] || 0) + 1;
  });
  return origins;
}

function calculatePopularityStats(names) {
  const scores = names.map(name => name.popularity || 0);
  return {
    average: scores.reduce((a, b) => a + b, 0) / scores.length,
    max: Math.max(...scores),
    min: Math.min(...scores)
  };
}

// Enhanced mock data generator
function getMockNamesData(religion, page, limit, sort, gender) {
  const mockNames = generateMockNames(religion, 1000);
  
  let filteredNames = mockNames;
  if (gender) {
    filteredNames = mockNames.filter(name => name.gender === gender);
  }

  // Apply sorting
  filteredNames.sort((a, b) => {
    if (sort === 'desc') {
      return b.name.localeCompare(a.name);
    }
    return a.name.localeCompare(b.name);
  });

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedNames = filteredNames.slice(startIndex, endIndex);

  return {
    names: paginatedNames,
    page: parseInt(page),
    total: filteredNames.length,
    totalPages: Math.ceil(filteredNames.length / limit),
    hasMore: endIndex < filteredNames.length
  };
}

function generateMockNames(religion, count) {
  const bases = {
    christian: ['John', 'Mary', 'David', 'Sarah', 'Michael', 'Rebecca'],
    muslim: ['Mohammed', 'Aisha', 'Ali', 'Fatima', 'Omar', 'Khadija'],
    hindu: ['Arjun', 'Priya', 'Krishna', 'Lakshmi', 'Rohan', 'Sita'],
    jewish: ['Abraham', 'Esther', 'Isaac', 'Rachel', 'Jacob', 'Leah'],
    buddhist: ['Bodhi', 'Maya', 'Siddhartha', 'Tara', 'Ashoka', 'Pema']
  };

  const religions = Object.keys(bases);
  const currentBase = bases[religion] || bases.christian;

  return Array.from({ length: count }, (_, i) => {
    const baseName = currentBase[i % currentBase.length];
    const variations = ['', 'a', 'el', 'ia', 'ius', 'ana'];
    const variation = variations[Math.floor(Math.random() * variations.length)];
    
    return {
      id: `${religion}-${i}`,
      name: `${baseName}${variation}`,
      slug: `${baseName}${variation}-${i}`.toLowerCase(),
      gender: ['male', 'female', 'unisex'][Math.floor(Math.random() * 3)],
      meaning: `Beautiful ${religion} name meaning "blessed" or "divine"`,
      pronunciation: `${baseName.toLowerCase()}-${variation}`,
      origin: religion.charAt(0).toUpperCase() + religion.slice(1),
      popularity: Math.floor(Math.random() * 100) + 1,
      trending: Math.random() > 0.8
    };
  });
}

// New enhanced utility functions
export function filterNamesByCriteria(names, criteria) {
  return names.filter(name => {
    if (criteria.gender && name.gender !== criteria.gender) return false;
    if (criteria.origin && !name.origin.includes(criteria.origin)) return false;
    if (criteria.search) {
      const searchTerm = criteria.search.toLowerCase();
      return (
        name.name.toLowerCase().includes(searchTerm) ||
        name.meaning.toLowerCase().includes(searchTerm) ||
        name.origin.toLowerCase().includes(searchTerm)
      );
    }
    return true;
  });
}

export function sortNames(names, sortBy) {
  const sorted = [...names];
  switch (sortBy) {
    case 'popularity':
      return sorted.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    case 'name-desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case 'trending':
      return sorted.sort((a, b) => (b.trending ? 1 : 0) - (a.trending ? 1 : 0));
    default: // 'name-asc'
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
  }
}

export function validateReligion(religion) {
  return RELIGIONS_CONFIG.some(r => r.value === religion);
}

export function getReligionConfig(religion) {
  return RELIGIONS_CONFIG.find(r => r.value === religion) || RELIGIONS_CONFIG[0];
}