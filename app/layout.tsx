import type React from 'react';
import { Inter as FontSans } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { ReactQueryClientProvider } from '@/components/react-client-query-provider';
import { Metadata } from 'next';
import { GoogleAnalytics } from '@next/third-parties/google';
import { SessionProviderComponent } from '../components/session-provider';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://portfoliofy.me'),
  title: 'Portfoliofy - Your Personal Portfolio, but Rich and Beautiful.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
  },
  description:
    'Create a beautiful personal portfolio to show your professional experience, education, and everything you are and create - in one place.',
  openGraph: {
    title: 'Portfoliofy - Your Personal Portfolio, but Rich and Beautiful.',
    description:
      'Create a beautiful personal portfolio to show your professional experience, education, and everything you are and create - in one place.',
    url: 'https://portfoliofy.me',
    siteName: 'Portfoliofy',
    images: [
      {
        url: 'https://portfoliofy.me/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Portfoliofy OG Image',
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
    title: 'Portfoliofy - Your Personal Portfolio, but Rich and Beautiful.',
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
      <html lang="en">
        <head>
          {/* {process.env.NODE_ENV === "development" && (
              <script
                crossOrigin="anonymous"
                src="//unpkg.com/react-scan/dist/auto.global.js"
              />
            )} */}
          {/* rest of your scripts go under */}
        </head>
        <body className={`${fontSans.className} min-h-screen flex flex-col`}>
          <SessionProviderComponent>
            <main className="flex-1 flex flex-col">
              {children}
              <SpeedInsights />
              <Analytics />
            </main>
            <Toaster richColors position="bottom-center" />
            <GoogleAnalytics gaId="G-WW2D1GVX99" />
          </SessionProviderComponent>
        </body>
      </html>
    </ReactQueryClientProvider>
  );
}
