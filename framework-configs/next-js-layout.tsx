/**
 * Next.js (App Router) - app/layout.tsx
 * Modern, SEO-friendly metadata configuration for Ionity
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  // Basic Metadata
  title: "Ionity | AI, IoT & Power-Saving Hardware Ecosystems | Antwerp Designs",
  description: "Ionity designs secure Cloud, Edge, AI, and IoT ecosystems. We build power-saving hardware units, SCADA systems, and custom software for global automation. Precision, performance, and long-term stability.",
  keywords: [
    "IoT",
    "Internet of Things",
    "AI",
    "Artificial Intelligence",
    "Hardware Design",
    "Power Saving Units",
    "Edge Computing",
    "Cloud Integration",
    "SCADA Systems",
    "Predictive Maintenance",
    "Industrial Automation",
    "South Africa",
    "Antwerp Designs",
    "AEDI",
    "Ionity",
    "Johan Wilhelm van Antwerp"
  ],
  authors: [
    {
      name: "Johan Wilhelm van Antwerp",
      url: "https://www.ionity.world"
    }
  ],
  creator: "Johan Wilhelm van Antwerp",
  publisher: "Ionity (Pty) Ltd",
  formatDetection: {
    telephone: true,
    email: true,
    address: true
  },
  metadataBase: new URL('https://www.ionity.today'),
  alternates: {
    canonical: '/',
    languages: {
      'en': '/en',
      'af': '/af'
    }
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1
    }
  },
  category: 'Technology, Engineering, Industrial Automation',
  classification: 'Business, Technology',
  
  // Open Graph
  openGraph: {
    title: "Ionity | Building Tomorrow, Today",
    description: "Ecosystems Solutionist. Connecting Cloud, Edge, AI, and Hardware. Creator of power-saving units and secure automation systems.",
    url: 'https://www.ionity.today/',
    siteName: 'Ionity | Antwerp Designs',
    locale: 'en_US',
    alternateLocale: ['af_ZA'],
    type: 'website',
    images: [
      {
        url: '/assets/images/ionity-social-card.png',
        width: 1200,
        height: 630,
        alt: 'Ionity Ecosystems - Hardware and Software Integration'
      },
      {
        url: '/assets/images/logo.png',
        width: 500,
        height: 500,
        alt: 'Ionity Logo'
      }
    ],
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: "Ionity | IoT & AI Hardware Systems",
    description: "Developing the future of Edge Computing, SCADA, and Power-Saving Hardware.",
    creator: "@AntwerpDesigns",
    images: ['/assets/images/ionity-social-card.png'],
    site: '@AntwerpDesigns'
  },

  // Verification
  verification: {
    google: 'your-google-verification-code',
    other: {
      'msvalidate.01': 'your-bing-verification-code',
    }
  },

  // Icons
  icons: {
    icon: '/assets/images/favicon.ico',
    apple: '/assets/images/apple-touch-icon.png',
    other: [
      {
        rel: 'icon',
        url: '/assets/images/icon-192.png',
        sizes: '192x192'
      },
      {
        rel: 'icon',
        url: '/assets/images/icon-512.png',
        sizes: '512x512'
      }
    ]
  },

  // Manifest
  manifest: '/manifest.json',

  // Geo Targeting
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Ionity'
  },
};

// JSON-LD Schema Component
export function JsonLdSchema() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://www.ionity.today/#organization",
        "name": "Ionity",
        "alternateName": ["Antwerp Designs", "AEDI", "Antwerp Ecosystems Designs Ionity"],
        "url": "https://www.ionity.today/",
        "logo": "https://www.ionity.today/assets/images/logo.png",
        "foundingDate": "2018",
        "founder": { "@id": "https://www.ionity.today/#author" },
        "description": "Designers and builders of secure systems connecting devices, automating operations, and unlocking real-time intelligence.",
        "email": "johan@ionity.today",
        "telephone": "+27-64-699-9877",
        "location": {
          "@type": "Place",
          "name": "Pretoria, Gauteng",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Pretoria",
            "addressRegion": "Gauteng",
            "addressCountry": "ZA"
          }
        },
        "sameAs": [
          "https://www.linkedin.com/in/ionity",
          "https://github.com/AntwerpDesignsIonity",
          "https://www.ionity.world"
        ],
        "knowsAbout": [
          { "@type": "Thing", "name": "IoT", "sameAs": "https://www.wikidata.org/wiki/Q11030" },
          { "@type": "Thing", "name": "Edge AI", "sameAs": "https://en.wikipedia.org/wiki/Edge_computing" }
        ]
      },
      {
        "@type": "Person",
        "@id": "https://www.ionity.today/#author",
        "name": "Johan Wilhelm van Antwerp",
        "jobTitle": "Ecosystems Solutionist & IoT Engineer",
        "url": "https://www.ionity.world",
        "affiliation": { "@id": "https://www.ionity.today/#organization" },
        "sameAs": [
          "https://orcid.org/0009-0005-7181-0347",
          "https://www.linkedin.com/in/ionity"
        ],
        "knowsLanguage": ["English", "Afrikaans"]
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
