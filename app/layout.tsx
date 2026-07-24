import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "ZePaw — India's Digital Health Passport for Pets.",
  description:
    'ZePaw gives every pet a secure digital identity with lifelong health records, vaccinations, and QR verification. Join the beta today.',
  keywords: [
    'pet identity',
    'pet health records',
    'digital pet ID',
    'pet vaccination tracker',
    'ZePaw',
    'pet healthcare',
    'pet passport',
  ],
  openGraph: {
    title: "ZePaw — India's Digital Health Passport for Pets.",
    description:
      'Secure digital identity for every pet with lifelong health records and QR verification.',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
  },
  icons: [
    {
      rel: 'icon',
      type: 'image/png',
      url: '/favicon/favicon-96x96.png',
      sizes: '96x96',
    },
    {
      rel: 'icon',
      type: 'image/svg+xml',
      url: '/favicon/favicon.svg',
    },
    {
      rel: 'shortcut icon',
      url: '/favicon/favicon.ico',
    },
    {
      rel: 'apple-touch-icon',
      type: 'image/png',
      url: '/favicon/apple-touch-icon.png',
      sizes: '180x180',
    },
  ],
};

export const viewport: Viewport = {
  themeColor: '#153E75',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <>
      <html lang="en" className={jakarta.variable}>
        <head>
          <script src="https://kit.fontawesome.com/9430fba654.js" crossOrigin="anonymous"></script>
          <meta name="apple-mobile-web-app-title" content="ZePaw" />
          <link rel="manifest" href="/favicon/site.webmanifest" />
        </head>
        <body className="font-sans antialiased bg-white text-[#111827] scroll-smooth">
          {children}
          <Toaster position="top-center" richColors />
        </body>
      </html>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
