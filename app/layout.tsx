import type React from 'react';
import { Inter as FontSans } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { ReactQueryClientProvider } from '@/components/ReactQueryClientProvider';
import { Metadata } from 'next';
import { GoogleAnalytics } from '@next/third-parties/google';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://portfoliofy.me'),
  title: 'Portfoliofy - Your Personal Portfolio, but Rich and Beautiful.',
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
        url: 'https://portfoliofy.me/og.png',
        width: 1200,
        height: 630,
        alt: 'Portfoliofy OG Image',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
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
            <main className="flex-1 flex flex-col">{children}</main>
            <Toaster richColors position="bottom-center" />
            <GoogleAnalytics gaId="G-WW2D1GVX99" />
          </body>
        </html>
      </ReactQueryClientProvider>
    </ClerkProvider>
  );
}
