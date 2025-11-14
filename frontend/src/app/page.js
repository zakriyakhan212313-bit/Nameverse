// src/app/page.js
import HomePageClient from "../components/HomePage/Homepage";

// ✅ 100/100 SEO SSR metadata
export const metadata = {
  title: "Islamic Names & Stories | Meaning, Origin, and Significance",
  description: "Find authentic Islamic names with deep meanings, historical origins, and virtues. Explore trending Muslim baby names, Quranic names, and inspiring stories.",
  keywords: [
    "Islamic names", "Muslim baby names", "Quranic names", "Urdu names", "Arabic names", 
    "Islamic stories", "Islamic origin names", "trending Islamic names", "boys names", 
    "girls names", "Muslim culture"
  ],
  openGraph: {
    title: "Islamic Names & Stories – Discover Meaning, Origin & History",
    description: "Explore authentic Islamic names and stories with meanings, origins and virtues. Perfect for parents and learners.",
    url: "https://yourdomain.com/",
    type: "website",
    images: [{ url: "https://yourdomain.com/images/og-image.jpg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Islamic Names & Stories — Meaning, Origin, and Virtues",
    description: "Discover meaningful Islamic names and fascinating stories behind them.",
    images: ["https://yourdomain.com/images/og-image.jpg"],
  },
  alternates: {
    canonical: "https://yourdomain.com/",
    languages: {
      ur: "https://yourdomain.com/ur/",
      ar: "https://yourdomain.com/ar/",
      hi: "https://yourdomain.com/hi/",
      fr: "https://yourdomain.com/fr/",
      de: "https://yourdomain.com/de/",
    },
  },
  robots: { index: true, follow: true },
  authors: [{ name: "Zakriya Khan", url: "https://yourdomain.com/" }],
  themeColor: "#0f766e",
};

export default function Page() {
  return <HomePageClient />;
}
