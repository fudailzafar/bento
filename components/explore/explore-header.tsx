import Link from 'next/link';
import Image from 'next/image';
import { Button, Section } from '@/components/ui';

export function HeaderExplore() {
  return (
    <>
      <Section className="mx-4 md:mx-16">
        <div className="my-8 flex items-center justify-between gap-x-10 text-base font-normal md:my-14">
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
              <Button className="bg-design-primary px-6 text-sm font-semibold hover:bg-design-primaryDark">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
        <h1 className="my-4 text-start text-3xl font-bold md:my-10">
          Get inspired by the most impressive Portfolios.
        </h1>
      </Section>
    </>
  );
}
