import { Footer } from '@/components/home/footer';
import { UniqueLink } from '@/components/home/unique-link';
import { VideoDialog } from '@/components/home/video-dialog';
import { Avatars } from '@/components/home/avatars';
import { Demo } from '@/components/home/Demo';
import { Cta } from '@/components/home/cta';
import { Hero } from '@/components/home/Hero';

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
