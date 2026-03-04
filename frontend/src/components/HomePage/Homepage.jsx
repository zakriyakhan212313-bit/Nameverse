"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
const TrendingNames = dynamic(() => import("./TrendingNames"), { ssr: false });
const HeroSection = dynamic(() => import("./HeroSection"), { ssr: false });
import { Button } from "@/components/ui/button";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.7, ease: "easeOut" },
  }),
};

export default function HomePageClient() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <link rel="preload" as="image" href="/images/hero.jpg" />
      {/* Structured data is provided globally in the root layout to avoid duplication */}

      <main
        role="main"
        className="min-h-screen flex flex-col items-center justify-start bg-gray-50"
      >
        
        <HeroSection />
        <TrendingNames />
      </main>
    </>
  );
}
