// src/app/page.js
import HomePageClient from "../components/HomePage/Homepage";

// ✅ 100/100 SEO SSR metadata
export const metadata = {
  title: "NameVerse — Baby Names, Meanings & Origins (Islamic, Hindu, Christian)",
  description: "Browse 65,000+ baby names with meanings, origins, translations and cultural stories. Fast, curated search for Islamic, Hindu and Christian names with verified meanings.",
  keywords: [
    "baby names", "baby names with meanings", "name meanings", "Islamic baby names", "Hindu baby names", "Christian baby names", "unique baby names", "names a to z", "name translations"
  ],
  openGraph: {
    title: "NameVerse — Baby Names & Meanings | Search 65,000+ Names",
    description: "Discover the perfect baby name with verified meanings, origins and cultural context across religions and languages.",
    url: "https://nameverse.vercel.app/",
    type: "website",
    images: [{ url: "https://nameverse.vercel.app/og-image.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "NameVerse — Baby Names & Meanings",
    description: "Search thousands of baby names with meanings, origins and stories.",
    images: ["https://nameverse.vercel.app/og-image.png"],
  },
  alternates: {
    canonical: "https://nameverse.vercel.app/",
    languages: {
      ur: "https://nameverse.vercel.app/ur/",
      ar: "https://nameverse.vercel.app/ar/",
      hi: "https://nameverse.vercel.app/hi/",
    },
  },
  robots: { index: true, follow: true },
  authors: [{ name: "NameVerse", url: "https://nameverse.vercel.app/" }],
  themeColor: "#0f766e",
};

export default function Page() {
  return <HomePageClient />;
}
