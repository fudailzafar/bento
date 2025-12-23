import {
  Avatars,
  Cta,
  Demo,
  Footer,
  Hero,
  Logo,
  UniqueLink,
  VideoDialog,
} from '@/components/home';
import { AllTheWidgets } from '@/components/home/all-the-widgets';

export default function Home() {
  return (
    <>
      <Hero />
      <VideoDialog />
      <Avatars />
      <Demo />
      <AllTheWidgets />
      <Logo />
      <UniqueLink />
      <Cta />
      <Footer />
    </>
  );
}
