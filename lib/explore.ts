import data from './data/explore.json';

// bento.me/explore: categories, featured Bentos and community Figma files
// (archived Jan 2025). The content lives in data/explore.json; images are
// self-hosted under /public/explore.
export interface ExploreBento {
  href: string;
  image: string;
  description: string;
}

export interface ExploreCategory {
  label: string;
  icon: string;
  // bento.me's 'Artists & Illustrators' tab label had no class, so it renders larger.
  plainTitle?: boolean;
  items: ExploreBento[];
}

export interface CommunityFile {
  href: string;
  thumbnail: string;
  avatar: string;
  title: string;
  author: string;
}

export const exploreCategories: ExploreCategory[] = data.categories;
export const communityFiles: CommunityFile[] = data.files;
