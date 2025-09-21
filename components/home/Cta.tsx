import Link from 'next/link';
import { Button } from '../ui/button';

export function Cta() {
  return (
    <>
      <div className="flex justify-center items-center">
        <Link href="/signup">
          <Button className="relative group flex items-center text-lg rounded-xl font-semibold py-8 px-20 sm:py-8 sm:px-14 bg-black hover:bg-black/65 cursor-pointer mb-2">
            <div className="h-[120px] w-10 bg-gradient-to-r from-white/10 via-white/50 to-white/10 absolute blur-sm -rotate-45 -left-16 group-hover:left-[150%] duration-500 delay-200" />
            Create Your Portfolio
          </Button>
        </Link>
      </div>
    </>
  );
}
