import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata = {
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
  themeColor: '#153E75',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={jakarta.variable}>
      <head>
        <script src="https://kit.fontawesome.com/9430fba654.js" crossOrigin="anonymous"></script>
      </head>
      <body className="font-sans antialiased bg-white text-[#111827] scroll-smooth">
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
