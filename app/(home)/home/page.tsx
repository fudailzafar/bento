import { Footer } from '@/components/home/footer';
import { Avatars } from '@/components/home/avatars';
import { Cta } from '@/components/home/cta';
import { Demo } from '@/components/home/Demo';
import { Hero } from '@/components/home/Hero';
import { VideoDialog } from '@/components/home/video-dialog';

export default function Home() {
  return (
    <>
      <Hero />
      <VideoDialog />
      <Avatars />
      <Demo />
      <Cta />
      <Footer />
    </>
  );
}
