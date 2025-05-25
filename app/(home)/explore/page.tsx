import { HeaderExplore } from '@/components/explore/explore-header';
import { Footer } from '@/components/home/footer';
import { Skeleton } from '@/components/ui/skeleton';
import { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  return {
    title: 'Portfoliofy - Explore',
  };
}

export default function Home() {
  return (
    <>
      <HeaderExplore />
      <div className="flex flex-wrap gap-24 justify-center items-start py-16">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow-md p-8 w-[350px] h-[220px] flex flex-col gap-4"
          >
            <div className="flex gap-4 items-center">
              <Skeleton className="w-16 h-16 rounded-full" />
              <div className="flex flex-col gap-2">
                <Skeleton className="w-24 h-5 rounded" />
                <Skeleton className="w-32 h-4 rounded" />
              </div>
            </div>
            <div className="flex gap-2 mt-2">
              <Skeleton className="w-8 h-8 rounded" />
              <Skeleton className="w-8 h-8 rounded" />
              <Skeleton className="w-8 h-8 rounded" />
              <Skeleton className="w-8 h-8 rounded" />
            </div>
            <Skeleton className="w-full h-10 rounded mt-4" />
          </div>
        ))}
      </div>
      <div className="text-center text-xl font-semibold text-gray-500 py-8">
        Coming soon
      </div>
      <Footer />
    </>
  );
}
