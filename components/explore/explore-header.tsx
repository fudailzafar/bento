import Link from 'next/link';
import Image from 'next/image';
import { Button, Section } from '@/components/ui';

export function HeaderExplore() {
  return (
    <>
      <Section className="mx-4 md:mx-16">
        <div className="flex gap-x-10 font-normal text-base my-8 md:my-14 justify-between items-center">
          <div className="flex flex-row items-center justify-center gap-x-10">
            <Link href={'/home'}>
              <Image alt="" src={'/favicon.ico'} width={50} height={50} />
            </Link>
            <Link
              href={'/explore#featured'}
              className="text-design-resume hover:text-design-gray"
            >
              Featured
            </Link>
            <Link
              href={'/home'}
              className="text-design-resume hover:text-design-gray"
            >
              Home
            </Link>
          </div>
          <div>
            <Link href={'/signup'} target="_blank" rel="noopener noreferrer">
              <Button className="font-semibold bg-design-primary hover:bg-design-primaryDark text-sm px-6">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
        <h1 className="text-3xl text-start font-bold my-4 md:my-10">
          Get inspired by the most impressive Portfolios.
        </h1>
      </Section>
    </>
  );
}
