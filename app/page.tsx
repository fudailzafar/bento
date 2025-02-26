import { Footer } from '@/components/home/footer';
import { Avatars } from '@/components/home/Avatars';
import { Cta } from '@/components/home/Cta';
import { Demo } from '@/components/home/Demo';
import { Hero } from '@/components/home/Hero';
import { VideoDialog } from '@/components/home/video-dialog';
import { UniqueLink } from '@/components/home/unique-link';

export default function Home() {
  return (
    <>
      <Hero />
      <VideoDialog />
      <Avatars />
      <Demo />
      <UniqueLink />
      <Cta />
      <Footer />
    </>
  );
}
