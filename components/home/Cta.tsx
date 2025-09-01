import Link from 'next/link';
import { Button } from '@/components/ui';

export function Cta() {
  return (
    <>
      <div className="flex justify-center items-center">
        <Link href="/signup">
          <Button className="relative shadow-md group active:scale-95 transition-transform flex items-center text-lg rounded-xl font-semibold py-8 px-20 sm:py-8 sm:px-14 bg-design-primary hover:bg-design-primaryDark cursor-pointer mb-2">
            Create Your Portfolio
          </Button>
        </Link>
      </div>
    </>
  );
}
