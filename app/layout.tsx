import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";



const fontSans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});



export const metadata: Metadata = {
  metadataBase: new URL("https://fudail.me"),
  title: "fudail.me - Linkedin to Portfolio",
  description:
    "LinkedIn to Portfolio in three clicks! Powered by Gemini and UploadThing",
  openGraph: {
    images: "/og.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${fontSans.variable} antialiased`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
