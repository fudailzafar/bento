import { SignupContent } from '@/components/auth';

// Like bento, /signup?handle=name (from an unclaimed handle's "Claim Handle
// Now") opens directly on the account step with that handle.
export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ handle?: string | string[] }>;
}) {
  const { handle } = await searchParams;
  const initialHandle = (Array.isArray(handle) ? handle[0] : handle ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '');

  return <SignupContent initialHandle={initialHandle} />;
}
