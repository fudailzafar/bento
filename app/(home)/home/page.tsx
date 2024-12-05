import { HeroNew } from '@/components/home/hero-new';
import { Avatars } from '@/components/home/Avatars';
import { Hero } from '@/components/home/Hero';
import { Cta } from '@/components/home/Cta';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <>
      <HeroNew />
      <Avatars />
      <Hero />
      <Cta />
      <Footer />
    </>
  );
}
