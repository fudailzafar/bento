import { HeroNew } from '@/components/home/hero-new';
import { Avatars } from '@/components/home/Avatars';
import { Hero } from '@/components/home/Hero';
import { Cta } from '@/components/home/Cta';
import { Footer } from '@/components/Footer';
import UniqueLink from '@/components/home/UniqueLink';
import { VideoDialog } from '@/components/home/VideoDialog';

export default function Home() {
  return (
    <>
      <HeroNew />
      <VideoDialog />
      <Avatars />
      <Hero />
      <UniqueLink />
      <Cta />
      <Footer />
    </>
  );
}
