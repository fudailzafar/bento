import {
  AllTheWidgets,
  FamiliarFaces,
  Footer,
  Hero,
  HeroBanner,
  HomeNavbar,
  UniqueLink,
  VideoDialog,
} from '@/components/home';

export default function Home() {
  return (
    // overflow-x-clip (not hidden) so the sticky hero keeps working while the
    // off-canvas hero cards don't cause sideways scrolling.
    <div className="flex w-full flex-col items-center overflow-x-clip bg-white text-sm leading-5 text-[#333]">
      <HomeNavbar />
      <HeroBanner />
      <Hero />
      <VideoDialog />
      <FamiliarFaces />
      <AllTheWidgets />
      <UniqueLink />
      <Footer />
    </div>
  );
}
