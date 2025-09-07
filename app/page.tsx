import { Footer } from '@/components/Footer';
import { Hero } from '@/components/Hero';
import { HeroNew } from '@/components/hero-new';

export default function Home() {
  return (
    <>
      <HeroNew />
      <Hero />
      <Footer />
    </>
  );
}
