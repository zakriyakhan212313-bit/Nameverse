'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { Heart, Share2, ChevronLeft, Star, Hash, Gem, Palette, Calendar, Users } from 'lucide-react'

export default function NameClient({ data, initialLanguage }) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState(initialLanguage)

  const languageConfig = useMemo(() => ({
    arabic: { name: 'العربية', flag: '🇸🇦', dir: 'rtl' },
    urdu: { name: 'اردو', flag: '🇵🇰', dir: 'rtl' },
    hindi: { name: 'हिन्दी', flag: '🇮🇳', dir: 'ltr' },
    pashto: { name: 'پښتو', flag: '🇦🇫', dir: 'rtl' },
    english: { name: 'English', flag: '🇺🇸', dir: 'ltr' },
    hebrew: { name: 'עברית', flag: '🇮🇱', dir: 'rtl' },
    greek: { name: 'Ελληνικά', flag: '🇬🇷', dir: 'ltr' },
    latin: { name: 'Latina', flag: '🏛️', dir: 'ltr' },
    sanskrit: { name: 'संस्कृत', flag: '🇮🇳', dir: 'ltr' },
    tamil: { name: 'தமிழ்', flag: '🇮🇳', dir: 'ltr' },
    telugu: { name: 'తెలుగు', flag: '🇮🇳', dir: 'ltr' }
  }), [])

  const availableLanguages = useMemo(() => {
    const languages = new Set()
    const languageFields = ['in_arabic', 'in_urdu', 'in_hindi', 'in_pashto', 'in_english', 'in_hebrew', 'in_greek', 'in_latin', 'in_sanskrit', 'in_tamil', 'in_telugu']
    languageFields.forEach(field => {
      if (data[field]?.name) languages.add(field.replace('in_', ''))
    })
    if (data.language) data.language.forEach(lang => languages.add(lang.toLowerCase()))
    return Array.from(languages)
  }, [data])

  const translation = useMemo(() => {
    const langField = `in_${selectedLanguage}`
    if (data[langField]?.name) return { name: data[langField].name, meaning: data[langField].meaning, longMeaning: data[langField].long_meaning }
    if (data.meanings_by_language?.[selectedLanguage]) return { name: data.meanings_by_language[selectedLanguage].name || data.name, meaning: data.meanings_by_language[selectedLanguage].meaning || data.short_meaning, longMeaning: data.meanings_by_language[selectedLanguage].long_meaning || data.long_meaning }
    return { name: data.name, meaning: data.short_meaning, longMeaning: data.long_meaning }
  }, [data, selectedLanguage])

  const religion = data.religion?.toLowerCase() || 'islamic'
  const religionConfig = useMemo(() => ({
    islamic: { gradient: 'from-emerald-500 to-teal-600', emoji: '☪️' },
    hindu: { gradient: 'from-orange-500 to-red-600', emoji: '🕉️' },
    christian: { gradient: 'from-blue-500 to-indigo-600', emoji: '✝️' },
  }), [])
  const config = religionConfig[religion] || religionConfig.islamic

  const getReligionPath = useCallback(() => {
    const rel = data.religion?.toLowerCase() || 'islamic'
    // Map religion names to correct path format
    if (rel === 'islam') return 'islamic'
    if (rel === 'hinduism') return 'hindu'
    if (rel === 'christianity') return 'christian'
    return rel
  }, [data.religion])

  const handleLanguageChange = useCallback((lang) => {
    const religionPath = getReligionPath()
    const namePath = window.location.pathname.split('/').pop()
    
    if (lang === 'english') {
      window.location.href = `/names/${religionPath}/${namePath}`
    } else {
      window.location.href = `/names/${religionPath}/${lang}/${namePath}`
    }
  }, [data.religion, getReligionPath])

  const StatCard = ({ value, label, icon: Icon }) => (
    <div className="bg-white rounded-xl p-4 border border-gray-200">
      <div className={`w-10 h-10 mb-3 rounded-lg bg-gradient-to-br ${config.gradient} flex items-center justify-center`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-xs font-medium text-gray-500 uppercase">{label}</div>
    </div>
  )

  const InfoSection = ({ title, icon: Icon, children }) => (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${config.gradient} flex items-center justify-center`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        </div>
      </div>
      <div className="p-5">{children}</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => window.history.back()} className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <button onClick={() => setIsFavorite(!isFavorite)} className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${isFavorite ? `bg-gradient-to-r ${config.gradient}` : 'bg-gray-100 hover:bg-gray-200'}`}>
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-white text-white' : 'text-gray-700'}`} />
            </button>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {availableLanguages.map(lang => {
              const cfg = languageConfig[lang] || { name: lang, flag: '🌐' }
              return (
                <button key={lang} onClick={() => handleLanguageChange(lang)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${selectedLanguage === lang ? `bg-gradient-to-r ${config.gradient} text-white` : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                  <span>{cfg.flag}</span>
                  <span>{cfg.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Hero Section */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <div className="flex flex-col items-center text-center">
            <div className={`w-20 h-20 mb-5 rounded-2xl bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-lg`}>
              <span className="text-3xl font-bold text-white">{translation.name.charAt(0)}</span>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-2" dir={languageConfig[selectedLanguage]?.dir}>{translation.name}</h1>
            <p className="text-lg text-gray-600 mb-6">{translation.meaning}</p>
            
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-gradient-to-r ${config.gradient} text-white`}>
                {config.emoji} {religion.charAt(0).toUpperCase() + religion.slice(1)}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-700">
                {data.gender === 'female' ? '👧' : '👦'} {data.gender}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-700">
                📍 {data.origin}
              </span>
            </div>

            <div className="flex gap-3 w-full max-w-sm">
              <button onClick={() => setIsFavorite(!isFavorite)} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${isFavorite ? `bg-gradient-to-r ${config.gradient} text-white` : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
                {isFavorite ? 'Saved' : 'Save Name'}
              </button>
              <button className="px-4 py-2.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <Share2 className="w-4 h-4 text-gray-700" />
              </button>
            </div>
          </div>
        </div>

        {/* Long Meaning */}
        {translation.longMeaning && (
          <InfoSection title="Deep Meaning" icon={Heart}>
            <p className="text-sm text-gray-700 leading-relaxed">{translation.longMeaning}</p>
          </InfoSection>
        )}

        {/* Lucky Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {data.lucky_number && <StatCard value={data.lucky_number} label="Lucky Number" icon={Hash} />}
          {data.lucky_day && <StatCard value={data.lucky_day} label="Lucky Day" icon={Calendar} />}
          {data.lucky_stone && <StatCard value={data.lucky_stone} label="Lucky Stone" icon={Gem} />}
          {data.lucky_colors?.length > 0 && (
            <StatCard value={data.lucky_colors.length} label={`Lucky Color${data.lucky_colors.length > 1 ? 's' : ''}`} icon={Palette} />
          )}
        </div>

        {/* Lucky Colors */}
        {data.lucky_colors?.length > 0 && (
          <InfoSection title="Lucky Colors" icon={Palette}>
            <div className="flex flex-wrap gap-5">
              {data.lucky_colors.map((color, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className="w-20 h-20 rounded-xl shadow-md border-2 border-white ring-1 ring-gray-200" style={{ backgroundColor: color }} />
                  <span className="text-xs font-medium text-gray-600">Color {i + 1}</span>
                </div>
              ))}
            </div>
          </InfoSection>
        )}

        {/* Celebrity Usage */}
        {data.celebrity_usage?.length > 0 && (
          <InfoSection title="Notable Personalities" icon={Users}>
            <div className="space-y-3">
              {data.celebrity_usage.map((celebrity, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-yellow-400 flex items-center justify-center flex-shrink-0">
                    <Star className="w-5 h-5 text-white fill-white" />
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed pt-1">{celebrity}</p>
                </div>
              ))}
            </div>
          </InfoSection>
        )}

        {/* Related Names */}
        {data.related_names?.length > 0 && (
          <InfoSection title="Related Names" icon={Users}>
            <div className="flex flex-wrap gap-2">
              {data.related_names.map((name, i) => (
                <span
                  key={i}
                  className={`px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r ${config.gradient} text-white shadow-sm`}
                >
                  {name}
                </span>
              ))}
            </div>
          </InfoSection>
        )}
      </main>
    </div>
  )
}