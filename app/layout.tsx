import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

/* Erode — self-hosted signature face. Chosen for its softly eroded, inked
   edges: the brand is a registry, and this is ink absorbed into paper. */
const erode = localFont({
  src: [
    { path: './fonts/Erode-Regular.woff2', weight: '400', style: 'normal' },
    { path: './fonts/Erode-Italic.woff2', weight: '400', style: 'italic' },
    { path: './fonts/Erode-Medium.woff2', weight: '500', style: 'normal' },
    { path: './fonts/Erode-Bold.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-display',
  display: 'swap',
  preload: true,
  fallback: ['Iowan Old Style', 'Georgia', 'serif'],
});

const SITE = 'https://zepaw.in';

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: 'ZePaw · A permanent digital identity for every pet',
    template: '%s · ZePaw',
  },
  description:
    'ZePaw issues every pet a permanent digital identity: lifelong health records, vaccination history and QR verification any vet can check in seconds. Join the beta.',
  applicationName: 'ZePaw',
  keywords: [
    'pet identity',
    'digital pet ID',
    'pet health records',
    'pet vaccination tracker',
    'pet passport India',
    'QR pet tag',
    'veterinary records',
    'ZePaw',
  ],
  authors: [{ name: 'ZePaw' }],
  creator: 'ZePaw',
  publisher: 'ZePaw',
  alternates: { canonical: '/' },
  category: 'Pet care',
  openGraph: {
    type: 'website',
    url: SITE,
    siteName: 'ZePaw',
    title: 'ZePaw · A permanent digital identity for every pet',
    description:
      'One record that follows your pet for life. Vaccination history, documents and QR verification any vet can check in seconds.',
    locale: 'en_IN',
    images: [
      {
        url: '/assets/pet-landscape.jpg',
        width: 1600,
        height: 1066,
        alt: 'A pug photographed for its ZePaw identity record',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZePaw · A permanent digital identity for every pet',
    description:
      'One record that follows your pet for life. Verifiable by any vet in seconds.',
    images: ['/assets/pet-landscape.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  icons: {
    icon: [
      { url: '/favicon/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    shortcut: '/favicon/favicon.ico',
    apple: '/favicon/apple-touch-icon.png',
  },
  manifest: '/favicon/site.webmanifest',
  appleWebApp: { title: 'ZePaw', capable: true },
};

export const viewport: Viewport = {
  themeColor: '#FAFBFC',
  colorScheme: 'light',
};

/* Structured data. FAQPage is answered verbatim on the page, so it is
   legitimate rich-result eligibility rather than markup for its own sake. */
const FAQ_SCHEMA = [
  [
    'What is a ZePaw identity?',
    'A permanent digital identity issued to a pet, like a passport. It holds their health record for life and can be verified by anyone the owner allows.',
  ],
  [
    'How does verification work?',
    'Any vet, boarding facility or shelter can enter the identity number or scan the QR tag. Only the fields the owner has published are shown; medical records stay private.',
  ],
  [
    'Is my pet’s data secure?',
    'Yes. Records are encrypted in transit and at rest. Medical history is never public, and the owner controls every sharing decision and can revoke access at any time.',
  ],
  [
    'When does the beta open?',
    'Invitations go out in waves. Join the beta list and we will email you when your access is ready.',
  ],
  [
    'Is ZePaw only for dogs and cats?',
    'No. ZePaw issues identities for dogs, cats, birds, rabbits, hamsters, turtles and exotic pets.',
  ],
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE}/#organization`,
      name: 'ZePaw',
      url: SITE,
      logo: `${SITE}/assets/mark.png`,
      email: 'hello@zepaw.in',
      sameAs: ['https://www.instagram.com/zepaw.official'],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE}/#website`,
      url: SITE,
      name: 'ZePaw',
      publisher: { '@id': `${SITE}/#organization` },
      inLanguage: 'en-IN',
    },
    {
      '@type': 'FAQPage',
      '@id': `${SITE}/#faq`,
      mainEntity: FAQ_SCHEMA.map(([q, a]) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a },
      })),
    },
  ],
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html lang="en-IN" className={erode.variable}>
      <body className="grain antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-sm focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-stock"
        >
          Skip to content
        </a>
        {children}
        <Toaster position="top-center" richColors />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
