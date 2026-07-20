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
  title: 'ZePaw — Every Pet Deserves an Identity',
  description:
    'ZePaw gives every pet a secure digital identity with lifelong health records, vaccinations, and QR verification. Join the beta today.',
  keywords: [
    'pet identity',
    'pet health records',
    'digital pet ID',
    'pet vaccination tracker',
    'ZePaw',
    'pet healthcare',
  ],
  openGraph: {
    title: 'ZePaw — Every Pet Deserves an Identity',
    description:
      'Secure digital identity for every pet with lifelong health records and QR verification.',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
  },
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
          <link rel="icon" type="image/png" href="/favicon/favicon-96x96.png" sizes="96x96" />
          <link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg" />
          <link rel="shortcut icon" href="/favicon/favicon.ico" />
          <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
          <meta name="apple-mobile-web-app-title" content="MyWebSite" />
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
