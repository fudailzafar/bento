import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import React from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <section className="flex-1 flex flex-col min-h-[calc(100vh-200px)]">
        {children}
      </section>
      <Footer />
    </>
  );
}
