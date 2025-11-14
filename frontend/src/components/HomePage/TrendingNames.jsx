import React, { useState, useMemo } from 'react';
import { TrendingUp, Sparkles, Heart, ChevronRight, Globe, BookOpen, Award, Zap, Crown } from 'lucide-react';

// Manually curated trending names data
const namesData = {
  global: [
    { _id: 'g1', name: 'Noah', gender: 'Male', origin: 'Hebrew', short_meaning: 'Rest and comfort. A name symbolizing peace and tranquility.', lucky_number: 7, lucky_colors: ['#4A90E2', '#7CB342'], slug: 'noah' },
    { _id: 'g2', name: 'Aarav', gender: 'Male', origin: 'Sanskrit', short_meaning: 'Peaceful and wise. Represents wisdom and serenity.', lucky_number: 3, lucky_colors: ['#FF9800', '#E91E63'], slug: 'aarav' },
    { _id: 'g3', name: 'Muhammad', gender: 'Male', origin: 'Arabic', short_meaning: 'Praiseworthy and admirable. The most honored name.', lucky_number: 1, lucky_colors: ['#4CAF50', '#00BCD4'], slug: 'muhammad' },
    { _id: 'g4', name: 'Grace', gender: 'Female', origin: 'Latin', short_meaning: 'Divine grace and elegance. Blessed with beauty.', lucky_number: 6, lucky_colors: ['#E91E63', '#9C27B0'], slug: 'grace' },
    { _id: 'g5', name: 'Zahra', gender: 'Female', origin: 'Arabic', short_meaning: 'Radiant and blooming. Shining like a flower.', lucky_number: 9, lucky_colors: ['#FF5722', '#FFC107'], slug: 'zahra' },
    { _id: 'g6', name: 'Arjun', gender: 'Male', origin: 'Sanskrit', short_meaning: 'Bright and shining. A legendary warrior name.', lucky_number: 5, lucky_colors: ['#FF6B6B', '#4ECDC4'], slug: 'arjun' },
    { _id: 'g7', name: 'Hannah', gender: 'Female', origin: 'Hebrew', short_meaning: 'Grace and favor. Blessed with divine kindness.', lucky_number: 8, lucky_colors: ['#A78BFA', '#EC4899'], slug: 'hannah' },
    { _id: 'g8', name: 'Vihaan', gender: 'Male', origin: 'Sanskrit', short_meaning: 'Dawn and new beginning. The break of a new day.', lucky_number: 2, lucky_colors: ['#F59E0B', '#10B981'], slug: 'vihaan' },
  ],
  islamic: [
    { _id: 'i1', name: 'Muhammad', gender: 'Male', origin: 'Arabic', short_meaning: 'Praiseworthy and admirable. The most honored name in Islam.', lucky_number: 1, lucky_colors: ['#4CAF50', '#00BCD4'], slug: 'muhammad' },
    { _id: 'i2', name: 'Ayaan', gender: 'Male', origin: 'Arabic', short_meaning: 'Gift of God. A blessing from the divine.', lucky_number: 7, lucky_colors: ['#2196F3', '#009688'], slug: 'ayaan' },
    { _id: 'i3', name: 'Zayan', gender: 'Male', origin: 'Arabic', short_meaning: 'Beautiful and graceful. Adorned with elegance.', lucky_number: 5, lucky_colors: ['#673AB7', '#3F51B5'], slug: 'zayan' },
    { _id: 'i4', name: 'Raihan', gender: 'Male', origin: 'Arabic', short_meaning: 'Heavenly flower. A fragrant blossom from paradise.', lucky_number: 9, lucky_colors: ['#8BC34A', '#CDDC39'], slug: 'raihan' },
    { _id: 'i5', name: 'Eshaal', gender: 'Female', origin: 'Arabic', short_meaning: 'Flower of paradise. A divine beauty.', lucky_number: 3, lucky_colors: ['#E91E63', '#F06292'], slug: 'eshaal' },
    { _id: 'i6', name: 'Musa', gender: 'Male', origin: 'Arabic', short_meaning: 'Saved from water. The prophet who led his people.', lucky_number: 6, lucky_colors: ['#00BCD4', '#0097A7'], slug: 'musa' },
    { _id: 'i7', name: 'Inaya', gender: 'Female', origin: 'Arabic', short_meaning: 'Divine care and concern. Blessed with protection.', lucky_number: 8, lucky_colors: ['#9C27B0', '#AB47BC'], slug: 'inaya' },
    { _id: 'i8', name: 'Aliza', gender: 'Female', origin: 'Arabic', short_meaning: 'Joyful and happy. Filled with delight.', lucky_number: 4, lucky_colors: ['#FF9800', '#FFB74D'], slug: 'aliza' },
  ],
  hindu: [
    { _id: 'h1', name: 'Aarav', gender: 'Male', origin: 'Sanskrit', short_meaning: 'Peaceful and wise. Represents wisdom and tranquility.', lucky_number: 3, lucky_colors: ['#FF9800', '#E91E63'], slug: 'aarav' },
    { _id: 'h2', name: 'Vihaan', gender: 'Male', origin: 'Sanskrit', short_meaning: 'Dawn and new beginning. The break of a new day.', lucky_number: 2, lucky_colors: ['#F59E0B', '#10B981'], slug: 'vihaan' },
    { _id: 'h3', name: 'Reyansh', gender: 'Male', origin: 'Sanskrit', short_meaning: 'Ray of light. First ray of sun, part of Lord Vishnu.', lucky_number: 7, lucky_colors: ['#FFC107', '#FF5722'], slug: 'reyansh' },
    { _id: 'h4', name: 'Advait', gender: 'Male', origin: 'Sanskrit', short_meaning: 'Unique and unparalleled. One without a second.', lucky_number: 1, lucky_colors: ['#9C27B0', '#673AB7'], slug: 'advait' },
    { _id: 'h5', name: 'Arjun', gender: 'Male', origin: 'Sanskrit', short_meaning: 'Bright and shining. The legendary warrior from Mahabharata.', lucky_number: 5, lucky_colors: ['#FF6B6B', '#4ECDC4'], slug: 'arjun' },
    { _id: 'h6', name: 'Akash', gender: 'Male', origin: 'Sanskrit', short_meaning: 'Sky and limitless. Vast like the heavens above.', lucky_number: 9, lucky_colors: ['#2196F3', '#03A9F4'], slug: 'akash' },
    { _id: 'h7', name: 'Atharv', gender: 'Male', origin: 'Sanskrit', short_meaning: 'The first Veda. Ancient knowledge and wisdom.', lucky_number: 6, lucky_colors: ['#4CAF50', '#8BC34A'], slug: 'atharv' },
    { _id: 'h8', name: 'Ayush', gender: 'Male', origin: 'Sanskrit', short_meaning: 'Long life and blessing. Gifted with longevity.', lucky_number: 8, lucky_colors: ['#00BCD4', '#009688'], slug: 'ayush' },
  ],
  christian: [
    { _id: 'c1', name: 'Noah', gender: 'Male', origin: 'Hebrew', short_meaning: 'Rest and comfort. The righteous man who built the ark.', lucky_number: 7, lucky_colors: ['#4A90E2', '#7CB342'], slug: 'noah' },
    { _id: 'c2', name: 'Elijah', gender: 'Male', origin: 'Hebrew', short_meaning: 'My God is Yahweh. A powerful prophet of the Lord.', lucky_number: 3, lucky_colors: ['#5C6BC0', '#7E57C2'], slug: 'elijah' },
    { _id: 'c3', name: 'Ezra', gender: 'Male', origin: 'Hebrew', short_meaning: 'Helper and aid. A scribe who led Israel\'s return.', lucky_number: 5, lucky_colors: ['#26A69A', '#66BB6A'], slug: 'ezra' },
    { _id: 'c4', name: 'Levi', gender: 'Male', origin: 'Hebrew', short_meaning: 'Joined and attached. From the priestly tribe.', lucky_number: 6, lucky_colors: ['#42A5F5', '#29B6F6'], slug: 'levi' },
    { _id: 'c5', name: 'Abigail', gender: 'Female', origin: 'Hebrew', short_meaning: 'Father\'s joy. A woman of wisdom and beauty.', lucky_number: 2, lucky_colors: ['#EC407A', '#F06292'], slug: 'abigail' },
    { _id: 'c6', name: 'Grace', gender: 'Female', origin: 'Latin', short_meaning: 'Divine grace and favor. Blessed with elegance.', lucky_number: 9, lucky_colors: ['#E91E63', '#9C27B0'], slug: 'grace' },
    { _id: 'c7', name: 'Hannah', gender: 'Female', origin: 'Hebrew', short_meaning: 'Grace and favor. Mother of the prophet Samuel.', lucky_number: 8, lucky_colors: ['#A78BFA', '#EC4899'], slug: 'hannah' },
    { _id: 'c8', name: 'Faith', gender: 'Female', origin: 'English', short_meaning: 'Trust and belief. Complete confidence in God.', lucky_number: 4, lucky_colors: ['#BA68C8', '#CE93D8'], slug: 'faith' },
  ],
};

const religionFilters = [
  { 
    value: "global", 
    label: "All Names", 
    icon: Globe,
    color: "indigo-600",
    hoverColor: "indigo-700"
  },
  { 
    value: "islamic", 
    label: "Islamic", 
    icon: BookOpen,
    color: "emerald-600",
    hoverColor: "emerald-700"
  },
  { 
    value: "hindu", 
    label: "Hindu", 
    icon: Zap,
    color: "orange-600",
    hoverColor: "orange-700"
  },
  { 
    value: "christian", 
    label: "Christian", 
    icon: Award,
    color: "blue-600",
    hoverColor: "blue-700"
  },
];

const genderColors = {
  Male: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    dot: "bg-blue-500"
  },
  Female: {
    bg: "bg-pink-50",
    text: "text-pink-700",
    border: "border-pink-200",
    dot: "bg-pink-500"
  },
  Unisex: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
    dot: "bg-purple-500"
  }
};

export default function TrendingNames() {
  const [selectedReligion, setSelectedReligion] = useState("global");
  const [favorites, setFavorites] = useState([]);
  const [selectedName, setSelectedName] = useState(null);

  const names = useMemo(() => namesData[selectedReligion] || [], [selectedReligion]);

  const toggleFavorite = (nameId) => {
    setFavorites(prev => 
      prev.includes(nameId) 
        ? prev.filter(id => id !== nameId)
        : [...prev, nameId]
    );
  };

  const handleViewDetails = (name) => {
    // Instead of router navigation, set the selected name
    setSelectedName(name);
    // You can also show a modal or detailed view here
    console.log('View details for:', name);
    alert(`Viewing details for ${name.name} (${name.origin}) - ${name.short_meaning}`);
  };

  const selectedFilter = religionFilters.find(f => f.value === selectedReligion);

  return (
    <section className="w-full bg-gray-50 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 md:mb-16 gap-6">
          <div className="flex items-center gap-4">
            <div className={`bg-${selectedFilter.color} p-3 rounded-xl shadow-md`}>
              <TrendingUp className="text-white" size={28} />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                Trending Names
              </h2>
              <p className="text-base text-gray-600 mt-1">
                Discover the most popular choices worldwide
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-xl shadow-md border border-gray-200">
            <Crown className="text-amber-500" size={22} />
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-gray-500 uppercase">Total</span>
              <span className="text-xl font-bold text-gray-900">
                {names.length}
              </span>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-3 mb-12">
          {religionFilters.map((filter) => {
            const FilterIcon = filter.icon;
            const isSelected = selectedReligion === filter.value;
            
            return (
              <button
                key={filter.value}
                onClick={() => setSelectedReligion(filter.value)}
                className={`
                  flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm
                  transition-all duration-200
                  ${isSelected
                    ? `bg-${filter.color} text-white shadow-md`
                    : `bg-white text-gray-700 hover:bg-gray-100 border border-gray-200`
                  }
                `}
              >
                <FilterIcon size={18} />
                <span>{filter.label}</span>
              </button>
            );
          })}
        </div>

        {/* Names Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {names.map((name, index) => {
            const isFavorite = favorites.includes(name._id);
            const genderStyle = genderColors[name.gender] || genderColors.Unisex;
            
            return (
              <article
                key={name._id}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-gray-300 flex flex-col"
                style={{
                  animation: `fadeInUp 0.5s ease-out ${index * 0.05}s both`
                }}
              >
                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                  
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0 pr-3">
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900 truncate">
                        {name.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-0.5">{name.origin}</p>
                    </div>
                    <button
                      onClick={() => toggleFavorite(name._id)}
                      className={`
                        p-2 rounded-lg transition-all duration-200
                        ${isFavorite 
                          ? 'bg-pink-100 text-pink-600' 
                          : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                        }
                      `}
                    >
                      <Heart size={18} className={isFavorite ? 'fill-current' : ''} />
                    </button>
                  </div>

                  {/* Gender Badge */}
                  <div className="mb-4">
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${genderStyle.bg} border ${genderStyle.border}`}>
                      <div className={`w-2 h-2 rounded-full ${genderStyle.dot}`}></div>
                      <span className={`text-xs font-semibold ${genderStyle.text}`}>{name.gender}</span>
                    </div>
                  </div>

                  {/* Meaning */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-100 flex-1">
                    <div className="flex items-start gap-2">
                      <Sparkles size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {name.short_meaning}
                      </p>
                    </div>
                  </div>

                  {/* Lucky Stats */}
                  <div className="flex items-center justify-between px-3 py-2.5 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 font-medium">Lucky #</span>
                      <span className="font-bold text-lg text-gray-900">
                        {name.lucky_number}
                      </span>
                    </div>
                    <div className="flex gap-1.5">
                      {name.lucky_colors?.map((color, i) => (
                        <div
                          key={i}
                          className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleViewDetails(name)}
                  className={`
                    w-full bg-gray-900 hover:bg-gray-800
                    text-white font-semibold py-3.5 text-sm
                    transition-colors duration-200
                    flex items-center justify-center gap-2
                    border-t border-gray-200
                  `}
                >
                  <span>View Details</span>
                  <ChevronRight size={18} />
                </button>
              </article>
            );
          })}
        </div>

        {/* Selected Name Display (Optional) */}
        {selectedName && (
          <div className="mt-8 p-6 bg-white rounded-xl shadow-md border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Selected: {selectedName.name}
            </h3>
            <p className="text-gray-600">
              Origin: {selectedName.origin} | Gender: {selectedName.gender}
            </p>
            <p className="text-gray-700 mt-2">{selectedName.short_meaning}</p>
            <button
              onClick={() => setSelectedName(null)}
              className="mt-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 font-medium"
            >
              Close
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}