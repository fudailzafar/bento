import {
  AllTheWidgets,
  FamiliarFaces,
  Footer,
  Hero,
  LogoMarquee,
  UniqueLink,
  VideoDialog,
} from '@/components/home';

export default function Home() {
  return (
    <>
      <Hero />
      <VideoDialog />
      <FamiliarFaces />
      <AllTheWidgets />
      <LogoMarquee />
      <UniqueLink />
      <Footer />
    </>
  );
}
