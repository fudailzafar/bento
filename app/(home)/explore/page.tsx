import { HeaderExplore } from '@/components/explore';
import { Footer } from '@/components/home';
import { Skeleton } from '@/components/ui';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Portfoliofy - Explore',
  };
}

export default function Home() {
  return (
    <>
      <HeaderExplore />
      <div className="flex flex-wrap items-start justify-center gap-24 py-16">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex h-[220px] w-[350px] flex-col gap-4 rounded-2xl bg-white p-8 shadow-md"
          >
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-5 w-24 rounded" />
                <Skeleton className="h-4 w-32 rounded" />
              </div>
            </div>
            <div className="mt-2 flex gap-2">
              <Skeleton className="h-8 w-8 rounded" />
              <Skeleton className="h-8 w-8 rounded" />
              <Skeleton className="h-8 w-8 rounded" />
              <Skeleton className="h-8 w-8 rounded" />
            </div>
            <Skeleton className="mt-4 h-10 w-full rounded" />
          </div>
        ))}
      </div>
      <div className="py-8 text-center text-xl font-semibold text-gray-500">
        Coming soon
      </div>
      <Footer />
    </>
  );
}
