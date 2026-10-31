import type React from 'react';
import { Inter as FontSans } from 'next/font/google';
import { Metadata } from 'next';
import { GoogleAnalytics } from '@next/third-parties/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';
import { BentoToaster } from '@/components/common/bento-toaster';
import { ReactQueryClientProvider } from '@/components/utils';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://bento.me'),
  title: 'Bento - A Link in Bio, but Rich and Beautiful.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
  },
  description:
    'Create a beautiful page to show your audience everything you are, create, and sell in one link. Designed in Berlin.',
  openGraph: {
    title: 'Bento - A Link in Bio, but Rich and Beautiful.',
    description:
      'Create a beautiful page to show your audience everything you are, create, and sell in one link. Designed in Berlin.',
    url: 'https://bento.me',
    siteName: 'Bento',
    images: [
      {
        url: 'https://bento.me/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Bento OG Image',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    title: 'Bento - A Portfolio, but Rich and Beautiful.',
    card: 'summary_large_image',
  },
  verification: {
    google: 'ftfMZY0UZJdQsb3nV7elf6ppIpHq3QOPcOeX7275nP0',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactQueryClientProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          {/* {process.env.NODE_ENV === "development" && (
              <script
                crossOrigin="anonymous"
                src="//unpkg.com/react-scan/dist/auto.global.js"
              />
            )} */}
          {/* rest of your scripts go under */}
        </head>
        <body className={`${fontSans.className} flex min-h-screen flex-col`}>
          <main className="flex flex-1 flex-col">
            {children}
            <SpeedInsights />
            <Analytics />
          </main>
          <BentoToaster />
          <GoogleAnalytics gaId="G-B99MN9ZMBL" />
        </body>
      </html>
    </ReactQueryClientProvider>
  );
}
