import Link from "next/link";
import { Button } from "../ui/button";

export function Cta() {
  return (
    <>
      <div className="flex justify-center items-center">
        <Link href="/signup">
          <Button
            variant="default"
            className="text-lg rounded-xl font-semibold py-8 px-20 sm:py-8 sm:px-14 bg-black hover:bg-black/65 cursor-pointer mb-2"
          >
            Create Your Portfolio
          </Button>
        </Link>
      </div>
    </>
  );
}
