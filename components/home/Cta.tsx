import Link from 'next/link';
import { Button } from '@/components/ui';

export function Cta() {
  return (
    <>
      <div className="flex items-center justify-center">
        <Link href="/signup">
          <Button className="group relative mb-2 flex cursor-pointer items-center rounded-xl bg-design-primary px-20 py-8 text-lg font-semibold shadow-md transition-transform hover:bg-design-primaryDark active:scale-95 sm:px-14 sm:py-8">
            Create Your Portfolio
          </Button>
        </Link>
      </div>
    </>
  );
}
