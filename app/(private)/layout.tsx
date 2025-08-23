import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ReactQueryClientProvider } from "@/components/ReactQueryClientProvider";
import React from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <ReactQueryClientProvider>
        <section className="flex-1 flex flex-col min-h-[calc(100vh-200px)]">
          {children}
        </section>
      </ReactQueryClientProvider>
      <Footer />
    </>
  );
}
