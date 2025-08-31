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
  title: 'portfolio.fudail.me - Resume to Website',
  description:
    'LinkedIn to Portfolio in one click! Powered by Gemini and Fudail',
  openGraph: {
    images: '/og.png',
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
