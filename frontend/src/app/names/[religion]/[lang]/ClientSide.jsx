'use client'

import { useState, useEffect, useMemo } from 'react'
import { Heart, Share2, Bookmark, ChevronLeft, Sparkles, Star, Moon, Globe, Book, TrendingUp, Users, Gem, Palette, Calendar, Hash, Languages, ChevronDown } from 'lucide-react'

// Sample data for demonstration
const sampleNameData = {
  name: "Alia",
  slug: "alia",
  language: ["Arabic", "English"],
  gender: "Female",
  origin: "Arabic",
  religion: "Islam",
  themes: ["Light", "Moon"],
  short_meaning: "Exalted, Noble, Sublime",
  long_meaning: "Exalted, Noble, Sublime\nA noble, exalted name for girls.",
  spiritual_meaning: "Signifies the exaltedness and nobility of the soul, and its divine connection to the Creator.",
  emotional_traits: ["Elevated", "Exalted", "Noble", "Sublime"],
  hidden_personality_traits: ["Introspective", "Meditative", "Reflective"],
  lucky_colors: ["Silver", "White"],
  lucky_number: 1,
  lucky_day: "Moon Day",
  lucky_stone: "Moonstone",
  life_path_number: 1,
  numerology_meaning: "A leader, independent, and a trailblazer.",
  pronunciation: {
    english: "ahl-ee-ah",
    urdu: "اردو میں تلفظ کی تفصیل: اَلِیہ",
    hindi: "हिन्दी में उच्चारण विवरण: अली",
    pashto: "په پښتو کې د تلفظ تفصیل: اَلِیه",
    ipa: "/ˈɑː.liːm/"
  },
  celebrity_usage: ["Alyia Jasmine", "Alya Manasa"],
  related_names: ["Aisha", "Fatima", "Zainab"],
  similar_sounding_names: ["Aalia", "Aayla", "Aleea"],
  cultural_impact: "The name Alia is of Arabic origin and carries a rich cultural history. In many Muslim communities, this name is cherished for its meaning which evokes ideas of nobility, excellence, and exaltation.",
  historical_references: [],
  modern_usage: {
    trends: ["popularity in certain regions"],
    platforms: ["social media, dating apps"],
    modern_context: "Alia is a common name in the Islamic world, particularly in countries such as Pakistan, India, and Bangladesh."
  },
  spiritual_significance: "From a spiritual perspective, the name Alia holds deep significance as it reflects the divine attributes of excellence and nobility.",
  in_english: {
    name: "Alia",
    meaning: "meaning: elevated, high, noble, virtuous, generosity, goodness,",
    long_meaning: "Alia name meaning: elevated, high, noble, virtuous, generous, good, exalted, lofty, high-minded, generous, good, virtuous, noble, elevated, high, noble, virtuous, generous, good,"
  },
  in_arabic: {
    name: "العليا",
    meaning: "المعنى: المعنى العالي، الأعلى، الفضيلة، الجود، الخير،",
    long_meaning: "المرادفات: العليا، الفاضلة، الجودية، الخيِّرة، العليّة، الأُخويّة، الفاضلة، الطيبة، العطاء، الخيرية، الفضيلة، الجود، الخير، العلو، الأعلى، المرتفع،"
  },
  in_urdu: {
    name: "علاء",
    meaning: "معنى: اعلیٰ، بلند، فضیلت، جود، خیر،",
    long_meaning: "علاء نام کے معانی: علاء، فاضل، جودی، خیرہ، بلند، فضیلت والی، جواب دینے والی، خیرmand، خیر، اعلیٰ، بلند، عطا کرنے والی، جود کرنے والی،"
  },
  in_hindi: {
    name: "अलिया",
    meaning: "अर्थ: उच्च, श्रेष्ठ, पराक्रम, वीरता, पुण्य,",
    long_meaning: "अलिया नाम के अर्थ: अलिया, श्रेष्ठ, पराक्रमी, वीर, पुण्यशाली, उच्च, श्रेष्ठ, पराक्रमी, वीर, पुण्यशाली, उच्च, श्रेष्ठ, वीर, पुण्यशाली, उच्च, श्रेष्ठ,"
  },
  in_pashto: {
    name: "علۍ",
    meaning: "معني: لوى، لوى، لوى، لوى، لوى،",
    long_meaning: "علۍ نام کې معنا: لوى، لوى، لوى، لوى، لوى، لوى، لوى، لوى، لوى،"
  }
}

export default function NameDetails({ nameData = sampleNameData, religion = "Islam", initialLanguage = "en" }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [isFavorite, setIsFavorite] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState(initialLanguage)

  const tabs = useMemo(() => [
    { id: 'overview', label: 'Overview', icon: Sparkles },
    { id: 'spiritual', label: 'Spiritual', icon: Moon },
    { id: 'cultural', label: 'Cultural', icon: Globe },
    { id: 'details', label: 'Details', icon: Book },
  ], [])

  const availableLanguages = useMemo(() => {
    const languages = []
    
    // Always add English first
    languages.push({ 
      code: 'en', 
      label: 'English', 
      fullLabel: 'English',
      data: nameData.in_english || nameData.meanings_by_language?.en || nameData 
    })
    
    // Check for all possible language translation fields
    const languageFields = [
      { field: 'in_arabic', code: 'ar', label: 'Arabic', fullLabel: 'Arabic' },
      { field: 'in_urdu', code: 'ur', label: 'Urdu', fullLabel: 'Urdu' },
      { field: 'in_hindi', code: 'hi', label: 'Hindi', fullLabel: 'Hindi' },
      { field: 'in_pashto', code: 'ps', label: 'Pashto', fullLabel: 'Pashto' },
      { field: 'in_sanskrit', code: 'sa', label: 'Sanskrit', fullLabel: 'Sanskrit' },
      { field: 'in_tamil', code: 'ta', label: 'Tamil', fullLabel: 'Tamil' },
      { field: 'in_telugu', code: 'te', label: 'Telugu', fullLabel: 'Telugu' },
      { field: 'in_hebrew', code: 'he', label: 'Hebrew', fullLabel: 'Hebrew' },
      { field: 'in_greek', code: 'el', label: 'Greek', fullLabel: 'Greek' },
      { field: 'in_latin', code: 'la', label: 'Latin', fullLabel: 'Latin' },
    ]

    languageFields.forEach(({ field, code, label, fullLabel }) => {
      if (nameData[field]) {
        languages.push({ 
          code, 
          label, 
          fullLabel,
          data: nameData[field] 
        })
      }
    })

    // Also check meanings_by_language for additional translations
    if (nameData.meanings_by_language) {
      Object.keys(nameData.meanings_by_language).forEach(langCode => {
        // Skip English as we already added it
        if (langCode === 'en') return;
        
        const langMap = {
          'ar': { label: 'Arabic', fullLabel: 'Arabic' },
          'ur': { label: 'Urdu', fullLabel: 'Urdu' },
          'hi': { label: 'Hindi', fullLabel: 'Hindi' },
          'ps': { label: 'Pashto', fullLabel: 'Pashto' },
          'fa': { label: 'Persian', fullLabel: 'Persian' },
          'de': { label: 'German', fullLabel: 'German' },
          'fr': { label: 'French', fullLabel: 'French' },
          'es': { label: 'Spanish', fullLabel: 'Spanish' },
          'it': { label: 'Italian', fullLabel: 'Italian' },
          'pt': { label: 'Portuguese', fullLabel: 'Portuguese' },
          'ru': { label: 'Russian', fullLabel: 'Russian' },
          'zh': { label: 'Chinese', fullLabel: 'Chinese' },
          'ja': { label: 'Japanese', fullLabel: 'Japanese' },
          'ko': { label: 'Korean', fullLabel: 'Korean' },
          'he': { label: 'Hebrew', fullLabel: 'Hebrew' },
          'el': { label: 'Greek', fullLabel: 'Greek' },
          'la': { label: 'Latin', fullLabel: 'Latin' },
          'sa': { label: 'Sanskrit', fullLabel: 'Sanskrit' },
          'ta': { label: 'Tamil', fullLabel: 'Tamil' },
          'te': { label: 'Telugu', fullLabel: 'Telugu' }
        }
        
        const langInfo = langMap[langCode] || { label: langCode.toUpperCase(), fullLabel: langCode.toUpperCase() }
        
        // Only add if not already in the list
        if (!languages.find(l => l.code === langCode)) {
          languages.push({ 
            code: langCode, 
            label: langInfo.label, 
            fullLabel: langInfo.fullLabel,
            data: nameData.meanings_by_language[langCode] 
          })
        }
      })
    }

    console.log('Available languages:', languages)
    return languages
  }, [nameData])

  const currentLanguageData = useMemo(() => {
    const lang = availableLanguages.find(l => l.code === currentLanguage)
    console.log('Current language data:', currentLanguage, lang?.data)
    return lang?.data || nameData
  }, [currentLanguage, availableLanguages, nameData])

  const handleLanguageChange = (langCode) => {
    // Build the new URL
    let newUrl
    if (langCode === 'en') {
      // English: /names/[religion]/[name]
      newUrl = `/names/${religion.toLowerCase()}/${nameData.slug || nameData.name.toLowerCase()}`
    } else {
      // Other languages: /names/[religion]/[language]/[name]
      newUrl = `/names/${religion.toLowerCase()}/${langCode}/${nameData.slug || nameData.name.toLowerCase()}`
    }
    
    // Navigate to the new URL (full page navigation)
    window.location.href = newUrl
  }

  const handleNameClick = (name) => {
    window.location.href = `/names/${religion.toLowerCase()}/${name.toLowerCase()}`
  }

  const religionConfig = useMemo(() => ({
    hindu: {
      gradient: 'from-orange-500 to-red-500',
      bg: 'bg-orange-600',
      light: 'bg-orange-50',
      text: 'text-orange-600',
      border: 'border-orange-200',
      emoji: '🕉️'
    },
    islamic: {
      gradient: 'from-emerald-500 to-teal-600',
      bg: 'bg-emerald-600',
      light: 'bg-emerald-50',
      text: 'text-emerald-600',
      border: 'border-emerald-200',
      emoji: '☪️'
    },
    islam: {
      gradient: 'from-emerald-500 to-teal-600',
      bg: 'bg-emerald-600',
      light: 'bg-emerald-50',
      text: 'text-emerald-600',
      border: 'border-emerald-200',
      emoji: '☪️'
    },
    christian: {
      gradient: 'from-blue-500 to-indigo-600',
      bg: 'bg-blue-600',
      light: 'bg-blue-50',
      text: 'text-blue-600',
      border: 'border-blue-200',
      emoji: '✝️'
    },
    christianity: {
      gradient: 'from-blue-500 to-indigo-600',
      bg: 'bg-blue-600',
      light: 'bg-blue-50',
      text: 'text-blue-600',
      border: 'border-blue-200',
      emoji: '✝️'
    },
  }), [])

  const config = religionConfig[religion?.toLowerCase()] || religionConfig.islam

  const StatCard = ({ value, label, icon: Icon }) => (
    <div className="bg-white rounded-lg p-4 border border-gray-200">
      <div className="flex items-center gap-2 mb-2">
        {Icon && <Icon className="w-4 h-4 text-gray-400" />}
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</span>
      </div>
      <div className="text-xl font-bold text-gray-900">{value}</div>
    </div>
  )

  const InfoCard = ({ title, children, icon: Icon, accent = config.text }) => (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-5">
        <div className="flex items-center gap-3 mb-4">
          {Icon && (
            <div className={`w-8 h-8 rounded-lg ${config.light} flex items-center justify-center`}>
              <Icon className={`w-4 h-4 ${accent}`} />
            </div>
          )}
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        </div>
        {children}
      </div>
    </div>
  )

  const Badge = ({ children, variant = 'default', clickable = false, onClick }) => {
    const variants = {
      default: 'bg-gray-100 text-gray-700 border-gray-200',
      primary: `${config.light} ${config.text} ${config.border}`,
      gradient: `bg-gradient-to-r ${config.gradient} text-white border-transparent`,
    }
    const Component = clickable ? 'button' : 'span'
    return (
      <Component 
        onClick={onClick}
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${variants[variant]} ${
          clickable ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''
        }`}
      >
        {children}
      </Component>
    )
  }

  const renderOverview = () => (
    <div className="space-y-5">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-6">
          <div className="text-center mb-5">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {currentLanguageData.name || nameData.name}
            </h1>
            <p className="text-sm text-gray-600 leading-relaxed max-w-lg mx-auto">
              {currentLanguageData.meaning || nameData.short_meaning}
            </p>
          </div>

          <div className="flex justify-center gap-2 mb-5">
            <Badge variant="gradient">
              {config.emoji} {religion.charAt(0).toUpperCase() + religion.slice(1)}
            </Badge>
            <Badge variant="primary">
              {nameData.gender === 'male' || nameData.gender === 'Male' ? '👦' : nameData.gender === 'female' || nameData.gender === 'Female' ? '👧' : '👶'} {nameData.gender}
            </Badge>
          </div>

          {availableLanguages.length > 1 && (
            <div className="flex justify-center gap-2 mb-5 flex-wrap">
              {availableLanguages.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`flex items-center gap-2 px-3 py-2 rounded text-sm font-medium transition-colors ${
                    currentLanguage === lang.code 
                      ? `${config.bg} text-white` 
                      : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Languages className="w-4 h-4" />
                  {lang.fullLabel}
                </button>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <button 
              onClick={() => setIsFavorite(!isFavorite)}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded font-medium text-sm transition-all ${
                isFavorite 
                  ? `${config.bg} text-white` 
                  : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
              {isFavorite ? 'Saved' : 'Save'}
            </button>
            <button className="px-3 py-2 bg-gray-50 border border-gray-200 rounded hover:bg-gray-100 transition-all">
              <Share2 className="w-4 h-4 text-gray-700" />
            </button>
            <button className="px-3 py-2 bg-gray-50 border border-gray-200 rounded hover:bg-gray-100 transition-all">
              <Bookmark className="w-4 h-4 text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      {(nameData.lucky_number || nameData.lucky_day || nameData.life_path_number) && (
        <div className="grid grid-cols-3 gap-3">
          {nameData.lucky_number && <StatCard value={nameData.lucky_number} label="Lucky Number" icon={Hash} />}
          {nameData.lucky_day && <StatCard value={nameData.lucky_day} label="Lucky Day" icon={Calendar} />}
          {nameData.life_path_number && <StatCard value={nameData.life_path_number} label="Life Path" icon={TrendingUp} />}
        </div>
      )}

      {(currentLanguageData.long_meaning || nameData.long_meaning) && (
        <InfoCard title="Detailed Meaning" icon={Book} accent={config.text}>
          <div className={`${config.light} rounded p-3`}>
            <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-line">
              {currentLanguageData.long_meaning || nameData.long_meaning}
            </p>
          </div>
        </InfoCard>
      )}

      {nameData.emotional_traits?.length > 0 && (
        <InfoCard title="Personality Traits" icon={Sparkles} accent="text-purple-600">
          <div className="flex flex-wrap gap-2">
            {nameData.emotional_traits.map((trait, i) => (
              <Badge key={i} variant="default">{trait}</Badge>
            ))}
          </div>
        </InfoCard>
      )}

      {nameData.themes?.length > 0 && (
        <InfoCard title="Themes" icon={Star} accent="text-amber-600">
          <div className="flex flex-wrap gap-2">
            {nameData.themes.map((theme, i) => (
              <Badge key={i} variant="primary">{theme}</Badge>
            ))}
          </div>
        </InfoCard>
      )}
    </div>
  )

  const renderSpiritual = () => (
    <div className="space-y-5">
      {nameData.spiritual_meaning && (
        <InfoCard title="Spiritual Meaning" icon={Moon} accent="text-purple-600">
          <p className="text-gray-700 leading-relaxed text-sm">{nameData.spiritual_meaning}</p>
        </InfoCard>
      )}

      {nameData.spiritual_significance && (
        <InfoCard title="Spiritual Significance" icon={Sparkles} accent="text-indigo-600">
          <p className="text-gray-700 leading-relaxed text-sm">{nameData.spiritual_significance}</p>
        </InfoCard>
      )}

      {nameData.numerology_meaning && (
        <InfoCard title="Numerology Insights" icon={Hash} accent="text-emerald-600">
          <p className="text-gray-700 leading-relaxed text-sm mb-4">{nameData.numerology_meaning}</p>
          {(nameData.life_path_number || nameData.lucky_number) && (
            <div className="grid grid-cols-2 gap-3">
              {nameData.life_path_number && (
                <div className="bg-emerald-50 rounded p-3 text-center border border-emerald-100">
                  <div className="text-xs text-emerald-600 font-medium mb-1">Life Path</div>
                  <div className="text-xl font-bold text-emerald-700">{nameData.life_path_number}</div>
                </div>
              )}
              {nameData.lucky_number && (
                <div className="bg-blue-50 rounded p-3 text-center border border-blue-100">
                  <div className="text-xs text-blue-600 font-medium mb-1">Lucky Number</div>
                  <div className="text-xl font-bold text-blue-700">{nameData.lucky_number}</div>
                </div>
              )}
            </div>
          )}
        </InfoCard>
      )}

      {nameData.lucky_colors?.length > 0 && (
        <InfoCard title="Lucky Colors" icon={Palette} accent="text-pink-600">
          <div className="flex flex-wrap gap-3">
            {nameData.lucky_colors.map((color, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div 
                  className="w-12 h-12 rounded border border-gray-300"
                  style={{ backgroundColor: color.toLowerCase() }}
                />
                <span className="text-xs font-medium text-gray-600">{color}</span>
              </div>
            ))}
          </div>
        </InfoCard>
      )}

      {nameData.lucky_stone && (
        <InfoCard title="Lucky Gemstone" icon={Gem} accent="text-purple-600">
          <div className="flex items-center gap-3 p-3 bg-purple-50 rounded border border-purple-100">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-200 to-pink-200 rounded flex items-center justify-center">
              <Gem className="w-5 h-5 text-purple-700" />
            </div>
            <div>
              <div className="font-semibold text-gray-900 text-sm">{nameData.lucky_stone}</div>
              <div className="text-xs text-gray-600">Your lucky gemstone</div>
            </div>
          </div>
        </InfoCard>
      )}
    </div>
  )

  const renderCultural = () => (
    <div className="space-y-5">
      {nameData.cultural_impact && (
        <InfoCard title="Cultural Impact" icon={Globe} accent="text-blue-600">
          <p className="text-gray-700 leading-relaxed text-sm">{nameData.cultural_impact}</p>
        </InfoCard>
      )}

      {nameData.historical_references?.length > 0 && (
        <InfoCard title="Historical Significance" icon={Book} accent="text-amber-600">
          <div className="space-y-3">
            {nameData.historical_references.map((ref, i) => (
              <div key={i} className="pl-3 border-l-2 border-amber-400 py-1">
                <p className="text-gray-700 leading-relaxed text-sm mb-2">{ref.reference}</p>
                <div className="flex flex-wrap gap-2 text-xs">
                  {ref.time_period && (
                    <Badge variant="default">{ref.time_period}</Badge>
                  )}
                  {ref.context && (
                    <Badge variant="default">{ref.context}</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </InfoCard>
      )}

      {nameData.celebrity_usage?.length > 0 && (
        <InfoCard title="Famous Personalities" icon={Users} accent="text-rose-600">
          <div className="space-y-2">
            {nameData.celebrity_usage.map((celebrity, i) => (
              <div key={i} className="flex items-start gap-2 p-2 bg-rose-50 rounded border border-rose-100">
                <div className="w-5 h-5 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Star className="w-3 h-3 text-rose-600 fill-rose-600" />
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">{celebrity}</p>
              </div>
            ))}
          </div>
        </InfoCard>
      )}

      {nameData.modern_usage && (
        <InfoCard title="Modern Usage" icon={TrendingUp} accent="text-green-600">
          {nameData.modern_usage.trends?.length > 0 && (
            <div className="mb-3">
              <h4 className="font-medium text-gray-700 mb-2 text-xs">Current Trends</h4>
              <div className="flex flex-wrap gap-2">
                {nameData.modern_usage.trends.map((trend, i) => (
                  <Badge key={i} variant="primary">{trend}</Badge>
                ))}
              </div>
            </div>
          )}
          {nameData.modern_usage.platforms?.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-700 mb-2 text-xs">Popular On</h4>
              <div className="flex flex-wrap gap-2">
                {nameData.modern_usage.platforms.map((platform, i) => (
                  <Badge key={i} variant="default">{platform}</Badge>
                ))}
              </div>
            </div>
          )}
        </InfoCard>
      )}
    </div>
  )

  const renderDetails = () => (
    <div className="space-y-5">
      {nameData.pronunciation && (
        <InfoCard title="Pronunciation Guide" icon={Globe} accent="text-orange-600">
          <div className="space-y-2">
            {nameData.pronunciation.english && (
              <div className="flex justify-between items-center p-2 bg-orange-50 rounded border border-orange-100">
                <span className="text-gray-600 font-medium text-sm">English</span>
                <span className="font-semibold text-gray-900 text-sm">{nameData.pronunciation.english}</span>
              </div>
            )}
            {nameData.pronunciation.ipa && (
              <div className="flex justify-between items-center p-2 bg-blue-50 rounded border border-blue-100">
                <span className="text-gray-600 font-medium text-sm">IPA</span>
                <span className="font-mono font-semibold text-gray-900 text-sm">{nameData.pronunciation.ipa}</span>
              </div>
            )}
            {nameData.pronunciation.urdu && (
              <div className="flex justify-between items-center p-2 bg-emerald-50 rounded border border-emerald-100">
                <span className="text-gray-600 font-medium text-sm">Urdu</span>
                <span className="font-semibold text-gray-900 text-sm" dir="rtl">{nameData.pronunciation.urdu}</span>
              </div>
            )}
          </div>
        </InfoCard>
      )}

      <InfoCard title="Origin & Language" icon={Globe} accent="text-teal-600">
        <div className="space-y-2">
          {nameData.origin && (
            <div className="flex justify-between items-center p-2 bg-teal-50 rounded border border-teal-100">
              <span className="text-gray-600 font-medium text-sm">Origin</span>
              <span className="font-semibold text-gray-900 text-sm">{nameData.origin}</span>
            </div>
          )}
          {nameData.language?.length > 0 && (
            <div className="p-2 bg-gray-50 rounded border border-gray-200">
              <span className="text-gray-600 font-medium block mb-2 text-sm">Used in Languages</span>
              <div className="flex flex-wrap gap-2">
                {nameData.language.map((lang, i) => (
                  <Badge key={i} variant="default">{lang}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </InfoCard>

      {nameData.related_names?.length > 0 && (
        <InfoCard title="Related Names" icon={Users} accent="text-violet-600">
          <div className="flex flex-wrap gap-2">
            {nameData.related_names.map((name, i) => (
              <Badge 
                key={i} 
                variant="primary" 
                clickable={true}
                onClick={() => handleNameClick(name)}
              >
                {name}
              </Badge>
            ))}
          </div>
        </InfoCard>
      )}

      {nameData.similar_sounding_names?.length > 0 && (
        <InfoCard title="Similar Sounding" icon={Sparkles} accent="text-fuchsia-600">
          <div className="flex flex-wrap gap-2">
            {nameData.similar_sounding_names.map((name, i) => (
              <Badge 
                key={i} 
                variant="default" 
                clickable={true}
                onClick={() => handleNameClick(name)}
              >
                {name}
              </Badge>
            ))}
          </div>
        </InfoCard>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Simple Header - Not sticky */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <button 
              onClick={() => window.history.back()}
              className="w-8 h-8 rounded bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-all"
            >
              <ChevronLeft className="w-4 h-4 text-gray-700" />
            </button>
            
            <button 
              onClick={() => setIsFavorite(!isFavorite)}
              className={`w-8 h-8 rounded border flex items-center justify-center transition-all ${
                isFavorite 
                  ? `${config.bg} border-transparent` 
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white text-white' : 'text-gray-700'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4">
          <div className="overflow-x-auto">
            <div className="flex gap-1 py-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded font-medium text-sm whitespace-nowrap transition-all ${
                      activeTab === tab.id
                        ? `${config.bg} text-white`
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 pt-4">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'spiritual' && renderSpiritual()}
        {activeTab === 'cultural' && renderCultural()}
        {activeTab === 'details' && renderDetails()}
      </div>
    </div>
  )
}