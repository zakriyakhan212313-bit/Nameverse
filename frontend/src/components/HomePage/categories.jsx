import React from "react";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp, BookOpen, Star, Globe } from "lucide-react";

const QuickCategories = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        type: "spring",
        stiffness: 100
      }
    }
  };

  const categories = [
    {
      title: "Islamic Names",
      href: "/names/islamic",
      icon: <div className="text-4xl">🕌</div>,
      lucideIcon: <Star className="w-6 h-6" />,
      gradient: "from-emerald-500 via-teal-500 to-green-500",
      bgGradient: "from-emerald-50 to-teal-50",
      borderGradient: "from-emerald-200 to-teal-200",
      hoverShadow: "shadow-emerald-200/50",
      description: "Beautiful Arabic & Islamic names",
      pattern: "🌙✨🕌⭐"
    },
    {
      title: "Hindu Names", 
      href: "/names/hindu",
      icon: <div className="text-4xl">🕉️</div>,
      lucideIcon: <Globe className="w-6 h-6" />,
      gradient: "from-orange-500 via-amber-500 to-yellow-500",
      bgGradient: "from-orange-50 to-amber-50",
      borderGradient: "from-orange-200 to-amber-200",
      hoverShadow: "shadow-orange-200/50",
      description: "Sacred Hindu & Sanskrit names",
      pattern: "🪔🌺🕉️🙏"
    },
    {
      title: "Christian Names",
      href: "/names/christian", 
      icon: <div className="text-4xl">✝️</div>,
      lucideIcon: <BookOpen className="w-6 h-6" />,
      gradient: "from-blue-500 via-indigo-500 to-purple-500",
      bgGradient: "from-blue-50 to-indigo-50",
      borderGradient: "from-blue-200 to-indigo-200",
      hoverShadow: "shadow-blue-200/50",
      description: "Biblical & Christian names",
      pattern: "✝️🕊️⛪🌟"
    },
    {
      title: "Popular Names",
      href: "/names/popular",
      icon: <TrendingUp className="w-10 h-10 text-pink-600" />,
      lucideIcon: <TrendingUp className="w-6 h-6" />,
      gradient: "from-pink-500 via-rose-500 to-red-500",
      bgGradient: "from-pink-50 to-rose-50", 
      borderGradient: "from-pink-200 to-rose-200",
      hoverShadow: "shadow-pink-200/50",
      description: "Trending names worldwide",
      pattern: "🔥❤️💖🌹"
    },
    {
      title: "Latest Stories",
      href: "/stories",
      icon: <BookOpen className="w-10 h-10 text-purple-600" />,
      lucideIcon: <Sparkles className="w-6 h-6" />,
      gradient: "from-purple-500 via-violet-500 to-indigo-500",
      bgGradient: "from-purple-50 to-violet-50",
      borderGradient: "from-purple-200 to-violet-200", 
      hoverShadow: "shadow-purple-200/50",
      description: "Name origins & meanings",
      pattern: "📚✨📖🌟"
    }
  ];

  return (
    <section className="relative py-16 lg:py-24 bg-gradient-to-b from-white via-slate-50/30 to-white overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10">
        <motion.div 
          className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-2xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-emerald-200/20 to-teal-200/20 rounded-full blur-2xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full mb-6"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <span className="text-sm font-semibold text-indigo-700">Quick Categories</span>
          </motion.div>
          
          <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
            Explore by{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              Category
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Jump straight to what you're looking for with our curated collections
          </p>
        </motion.div>

        {/* Categories Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-8 max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {categories.map((category, index) => (
            <motion.a
              key={category.title}
              href={category.href}
              variants={itemVariants}
              className="group relative block"
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {/* Card Container */}
              <div className={`
                relative overflow-hidden rounded-3xl border-2 border-transparent
                bg-gradient-to-br ${category.bgGradient}
                hover:border-opacity-50 hover:${category.borderGradient}
                transition-all duration-300 ease-out
                hover:shadow-2xl hover:${category.hoverShadow}
                backdrop-blur-sm
              `}>
                {/* Animated Pattern Background */}
                <div className="absolute inset-0 opacity-5">
                  <motion.div 
                    className="text-6xl flex flex-wrap gap-4 p-4 rotate-12"
                    animate={{ 
                      rotate: [12, 18, 12],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 8, 
                      repeat: Infinity,
                      delay: index * 0.5 
                    }}
                  >
                    {category.pattern.split('').map((char, i) => (
                      <span key={i}>{char}</span>
                    ))}
                  </motion.div>
                </div>

                {/* Gradient Overlay */}
                <div className={`
                  absolute inset-0 bg-gradient-to-br ${category.gradient} 
                  opacity-0 group-hover:opacity-10 transition-opacity duration-300
                `} />

                {/* Content */}
                <div className="relative z-10 p-6 lg:p-8 text-center">
                  {/* Icon Container */}
                  <motion.div 
                    className="relative mb-6"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className={`
                      w-20 h-20 lg:w-24 lg:h-24 mx-auto rounded-2xl 
                      bg-gradient-to-br ${category.gradient}
                      flex items-center justify-center
                      shadow-lg group-hover:shadow-xl
                      transition-all duration-300
                      relative overflow-hidden
                    `}>
                      {/* Icon glow effect */}
                      <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Main icon */}
                      <div className="relative z-10 text-white">
                        {category.icon}
                      </div>

                      {/* Floating particles */}
                      <motion.div
                        className="absolute inset-0"
                        animate={{ 
                          opacity: [0, 1, 0],
                        }}
                        transition={{ 
                          duration: 3, 
                          repeat: Infinity,
                          delay: index * 0.3 
                        }}
                      >
                        {[...Array(3)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-white rounded-full"
                            style={{
                              left: `${20 + i * 25}%`,
                              top: `${15 + i * 20}%`
                            }}
                            animate={{
                              y: [-10, 10, -10],
                              opacity: [0, 1, 0],
                              scale: [0, 1, 0]
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              delay: i * 0.2
                            }}
                          />
                        ))}
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Title */}
                  <motion.h3 
                    className="text-xl lg:text-2xl font-bold text-gray-900 mb-3 group-hover:text-gray-800"
                    whileHover={{ scale: 1.05 }}
                  >
                    {category.title}
                  </motion.h3>

                  {/* Description */}
                  <p className="text-sm lg:text-base text-gray-600 mb-4 group-hover:text-gray-700 transition-colors duration-200">
                    {category.description}
                  </p>

                  {/* Action indicator */}
                  <motion.div 
                    className="flex items-center justify-center gap-2 text-sm font-semibold"
                    initial={{ opacity: 0, y: 10 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className={`bg-gradient-to-r ${category.gradient} bg-clip-text text-transparent`}>
                      Explore
                    </span>
                    <motion.div
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      {category.lucideIcon}
                    </motion.div>
                  </motion.div>
                </div>

                {/* Hover glow effect */}
                <div className={`
                  absolute -inset-1 bg-gradient-to-r ${category.gradient} 
                  rounded-3xl opacity-0 group-hover:opacity-20 
                  transition-opacity duration-300 blur-xl -z-10
                `} />
              </div>

              {/* External glow on hover */}
              <motion.div
                className={`
                  absolute -inset-2 bg-gradient-to-r ${category.gradient} 
                  rounded-3xl opacity-0 blur-2xl -z-20
                `}
                whileHover={{ opacity: 0.15 }}
                transition={{ duration: 0.3 }}
              />
            </motion.a>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div 
          className="text-center mt-12 lg:mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <p className="text-lg text-gray-600 flex items-center justify-center gap-2">
            <span>Can't find what you're looking for?</span>
            <motion.a 
              href="/search"
              className="text-indigo-600 hover:text-indigo-700 font-semibold underline decoration-2 underline-offset-2"
              whileHover={{ scale: 1.05 }}
            >
              Try advanced search
            </motion.a>
            <motion.span
              animate={{ rotate: [0, 20, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-xl"
            >
              🔍
            </motion.span>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default QuickCategories;