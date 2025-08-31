import type React from 'react';
import { Inter as FontSans } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { ReactQueryClientProvider } from '@/components/ReactQueryClientProvider';
import { Metadata } from 'next';
import PlausibleProvider from 'next-plausible';

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://portfolio.fudail.me'),
  title: 'Portfoliofy - Your Personal Portfolio, but Rich and Beautiful',
  description:
    'LinkedIn to Portfolio in one click! Powered by Gemini and Fudail',
  openGraph: {
    title: "Portfoliofy - Your Personal Portfolio, but Rich and Beautiful",
    description:
      "LinkedIn to Portfolio in one click! Powered by Gemini and Fudail",
    url: "https://portfolio.fudail.me",
    siteName: "Consicio",
    images: [
      {
        url: "https://portfolio.fudail.me/og.png",
        width: 1200,
        height: 630,
        alt: "Portfoliofy OG Image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <PlausibleProvider domain="portfolio.fudail.me">
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
            </body>
          </html>
        </ReactQueryClientProvider>
      </PlausibleProvider>
    </ClerkProvider>
  );
}
