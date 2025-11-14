import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nameverse.vercel.app";

// ✅ Font optimization (Next.js handles preconnect automatically)
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// ✅ Global SEO Metadata
export const metadata = {
  title: "Baby Names, Meanings & Stories — Muslim, Hindu, Christian | NameVerse",
  description:
    "Explore 65,000+ baby names with meanings, origins, and numerology. Discover Islamic, Hindu, and Christian names in Urdu, Arabic, Hindi & English. Find Quranic, Biblical, and modern baby names A–Z with meanings and stories.",
  keywords:
    "baby names, baby names a to z, baby names muslim, baby names girl, baby names muslim boy, name meanings, name meanings in urdu, name meanings in islam, baby names with meanings, unique baby names, modern baby names, islamic boy names from quran, hindu girl names meaning love, christian baby names with meanings, nameverse meaning, nameverse website",
  robots: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
  authors: [{ name: "NameVerse", url: siteUrl }],
  creator: "NameVerse",
  publisher: "NameVerse",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: siteUrl,
    languages: { "en-US": siteUrl },
  },
  openGraph: {
    title: "NameVerse — Baby Names & Meanings (Islamic, Hindu, Christian, Modern)",
    description:
      "Discover baby names with meanings, origins, and numerology across religions — Islam, Hinduism, Christianity — in English, Urdu, Arabic & Hindi.",
    url: siteUrl,
    siteName: "NameVerse",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "NameVerse — Baby Names & Meanings from Around the World",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Baby Names & Meanings — Islamic, Hindu, Christian | NameVerse",
    description:
      "Explore thousands of baby names by religion and origin — Islamic, Hindu, and Christian — with detailed meanings, numerology, and stories.",
    images: [`${siteUrl}/og-image.png`],
    creator: "@NameVerseOfficial",
    site: "@NameVerseOfficial",
  },
  icons: {
    icon: `${siteUrl}/favicon.ico`,
    shortcut: `${siteUrl}/favicon.ico`,
    apple: `${siteUrl}/apple-touch-icon.png`,
  },
  manifest: `${siteUrl}/manifest.json`,
  themeColor: "#1E40AF",
  viewport: "width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover",
  category: "Baby Names, Culture, Religion, Stories",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <meta name="color-scheme" content="light dark" />
        <meta name="application-name" content="NameVerse" />
        <meta name="content-language" content="en-US" />

        {/* ✅ Preloads for key assets */}
        <link rel="preload" href={`${siteUrl}/og-image.png`} as="image" type="image/png" />
        <link rel="preload" href={`${siteUrl}/favicon.ico`} as="image" type="image/x-icon" />

        {/* ✅ Structured Data — Organization, Website, WebPage, ItemList */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": `${siteUrl}/#organization`,
                  name: "NameVerse",
                  url: siteUrl,
                  logo: {
                    "@type": "ImageObject",
                    url: `${siteUrl}/logo.png`,
                    width: 512,
                    height: 512,
                  },
                  sameAs: [
                    "https://twitter.com/NameVerseOfficial",
                    "https://facebook.com/NameVerse",
                    "https://instagram.com/NameVerse",
                    "https://www.linkedin.com/company/nameverse",
                  ],
                },
                {
                  "@type": "WebSite",
                  "@id": `${siteUrl}/#website`,
                  url: siteUrl,
                  name: "NameVerse",
                  description:
                    "Global baby name and story database — 65,000+ names with meanings, origins, and stories from Islam, Hinduism, and Christianity.",
                  inLanguage: "en",
                  publisher: { "@id": `${siteUrl}/#organization` },
                  potentialAction: {
                    "@type": "SearchAction",
                    target: `${siteUrl}/search?query={search_term_string}`,
                    "query-input": "required name=search_term_string",
                  },
                },
                {
                  "@type": "WebPage",
                  "@id": `${siteUrl}/#webpage`,
                  url: siteUrl,
                  name: "Baby Names, Meanings & Stories — Multi-Religion | NameVerse",
                  isPartOf: { "@id": `${siteUrl}/#website` },
                  description:
                    "Explore global baby names and their meanings across religions. Includes Islamic, Hindu, and Christian names with cultural stories and translations.",
                  inLanguage: "en",
                  about: [
                    "baby names a to z",
                    "islamic boy names from quran",
                    "baby names with meanings in urdu",
                    "unique baby names start with a",
                    "modern baby names inspired by lord shiva",
                    "christian baby names with meanings",
                  ],
                },
                {
                  "@type": "ItemList",
                  name: "Popular Baby Names by Religion",
                  description:
                    "Browse top baby names from different faiths — Muslim, Hindu, and Christian — with detailed meanings and translations.",
                  url: `${siteUrl}/names`,
                  numberOfItems: 65000,
                  itemListElement: [
                    "baby names with meanings",
                    "unique baby names",
                    "modern baby names",
                    "baby names muslim boy",
                    "hindu girl names meaning love",
                    "islamic boy names from quran",
                  ],
                },
              ],
            }),
          }}
        />

        {/* ✅ Breadcrumbs for Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: `${siteUrl}/`,
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Baby Names",
                  item: `${siteUrl}/names`,
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: "Islamic Baby Names",
                  item: `${siteUrl}/names/islamic`,
                },
              ],
            }),
          }}
        />
      </head>

      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
