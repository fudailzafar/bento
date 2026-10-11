import {
  CategoryTabs,
  CommunityFiles,
  FeatureForm,
  HeaderExplore,
} from '@/components/explore';
import { Footer } from '@/components/home';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Bento - Explore',
    description: 'Get inspired by the most creative Bentos',
  };
}

export default function Explore() {
  return (
    <div className="flex w-full flex-col bg-white text-sm leading-5 text-[#333]">
      <HeaderExplore />
      <CategoryTabs />
      <FeatureForm />
      <CommunityFiles />
      <Footer />
    </div>
  );
}
