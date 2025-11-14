'use client';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Menu, X, Search, Sparkles } from 'lucide-react';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const searchRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        setSearchOpen(false);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
        setTimeout(() => searchRef.current?.focus(), 100);
      }
    };

    const handleClickOutside = (e) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const navLinks = [
    { label: 'Names', href: '/names' },
    { label: 'Blog', href: '/blog' },
    { label: 'Stories', href: '/stories' },
    { label: 'About Us', href: '/about' },
  ];

  const handleSearch = (query) => {
    console.log('Searching for:', query);
    setSearchOpen(false);
  };

  const toggleMobileMenu = () => {
    setMenuOpen(prev => !prev);
    setSearchOpen(false);
  };

  const toggleSearch = () => {
    setSearchOpen(prev => !prev);
    setMenuOpen(false);
    setTimeout(() => searchRef.current?.focus(), 100);
  };

  if (!isClient) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-3xl border-b border-gray-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 flex items-center justify-center text-white font-black text-xl shadow-2xl shadow-blue-500/30">
                <span className="relative z-10">N</span>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400 to-purple-500 opacity-0 blur-xl"></div>
              </div>
              <span className="text-2xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 bg-clip-text text-transparent tracking-tight">
                NameVerse
              </span>
            </Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out ${
          scrolled 
            ? 'bg-white/95 backdrop-blur-3xl border-b border-gray-100/60 shadow-2xl shadow-black/5' 
            : 'bg-white/90 backdrop-blur-3xl border-b border-gray-100/40'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-6">
            
            {/* Premium Logo */}
            <Link href="/" className="flex items-center gap-3 group flex-shrink-0 relative">
              <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 flex items-center justify-center text-white font-black text-xl shadow-2xl shadow-blue-500/30 transition-all duration-700 group-hover:shadow-blue-500/60 group-hover:scale-110 group-hover:rotate-6">
                <span className="relative z-10">N</span>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl"></div>
              </div>
              <span className="text-2xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 bg-clip-text text-transparent tracking-tight hidden sm:inline transition-all duration-500 group-hover:tracking-wide">
                NameVerse
              </span>
            </Link>

            {/* Desktop Navigation - Enterprise Grade */}
            <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
              {navLinks.map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-6 py-2.5 text-[15px] font-semibold text-gray-700 hover:text-blue-600 transition-all duration-500 group"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span className="relative z-10">{link.label}</span>
                  <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-all duration-500 scale-75 group-hover:scale-100"></span>
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 group-hover:w-3/4 transition-all duration-700 ease-out rounded-full shadow-lg shadow-blue-500/50"></span>
                </Link>
              ))}
            </nav>

            {/* Desktop Search - Premium */}
            <div className="hidden md:flex items-center gap-3 flex-shrink-0">
              <div className="relative">
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search..."
                  className="w-64 pl-11 pr-4 py-2.5 rounded-2xl bg-gray-50/80 backdrop-blur-xl border border-gray-200/60 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-white transition-all duration-500 text-sm font-medium shadow-sm hover:shadow-md"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.target.value) {
                      handleSearch(e.target.value);
                      e.target.value = '';
                    }
                  }}
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 text-xs font-semibold text-gray-500 bg-white border border-gray-200 rounded-lg shadow-sm">
                  ⌘K
                </kbd>
              </div>
            </div>

            {/* Mobile Controls - Touch Optimized */}
            <div className="flex items-center gap-2 md:hidden ml-auto" ref={mobileMenuRef}>
              <button
                onClick={toggleSearch}
                className={`p-3 rounded-2xl transition-all duration-500 active:scale-95 ${
                  searchOpen 
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/40' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 active:bg-gray-200'
                }`}
                aria-label="Search"
                suppressHydrationWarning
              >
                <Search className="w-5 h-5" />
              </button>

              <button
                onClick={toggleMobileMenu}
                className={`p-3 rounded-2xl transition-all duration-500 active:scale-95 ${
                  menuOpen 
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/40' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 active:bg-gray-200'
                }`}
                aria-label="Menu"
                suppressHydrationWarning
              >
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Search - Elegant Slide */}
          <div 
            className={`md:hidden border-t border-gray-100/60 overflow-hidden transition-all duration-500 ease-out ${
              searchOpen ? 'max-h-24 py-4 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Search NameVerse..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-gray-50/80 backdrop-blur-xl border border-gray-200/60 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-white transition-all duration-500 text-base font-medium shadow-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.target.value) {
                    handleSearch(e.target.value);
                    e.target.value = '';
                  }
                }}
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Mobile Menu - Luxurious Animation */}
          <div 
            className={`md:hidden border-t border-gray-100/60 overflow-hidden transition-all duration-700 ease-out ${
              menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <nav className="py-3 flex flex-col gap-1">
              {navLinks.map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-5 py-4 text-base font-semibold text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-500 rounded-2xl group overflow-hidden"
                  onClick={() => setMenuOpen(false)}
                  style={{ 
                    animationDelay: `${index * 50}ms`,
                    transform: menuOpen ? 'translateX(0)' : 'translateX(-20px)',
                    opacity: menuOpen ? 1 : 0,
                    transition: `all 0.5s ease-out ${index * 50}ms`
                  }}
                >
                  <span className="relative z-10 flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                    {link.label}
                  </span>
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:translate-x-0 translate-x-2">
                    →
                  </span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Premium Mobile Overlay */}
      {(menuOpen || searchOpen) && (
        <div 
          className="fixed inset-0 bg-gradient-to-br from-blue-900/10 via-indigo-900/10 to-purple-900/10 backdrop-blur-sm z-40 md:hidden transition-opacity duration-500"
          onClick={() => {
            setMenuOpen(false);
            setSearchOpen(false);
          }}
          style={{
            opacity: menuOpen || searchOpen ? 1 : 0
          }}
        />
      )}

      {/* Content Spacer */}
      <div className="h-20"></div>

      <style jsx global>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        @media (hover: hover) {
          .group:hover .group-hover\:scale-110 {
            transform: scale(1.1) rotate(6deg);
          }
        }
        
        @media (max-width: 768px) {
          * {
            -webkit-tap-highlight-color: transparent;
          }
        }
      `}</style>
    </>
  );
}