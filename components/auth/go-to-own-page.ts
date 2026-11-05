import type { useRouter } from 'next/navigation';

/**
 * Sends a freshly authenticated user to their own bento page, generating a
 * username first if this is their very first login (no page/route exists to
 * land on before a username is assigned).
 */
export async function goToOwnPage(router: ReturnType<typeof useRouter>) {
  const usernameRes = await fetch('/api/username');
  const usernameData = await usernameRes.json();

  if (usernameData.username) {
    router.push(`/${usernameData.username}`);
    return;
  }

  const generateRes = await fetch('/api/username/generate', {
    method: 'POST',
  });
  const generateData = await generateRes.json();
  if (generateData.username) {
    router.push(`/${generateData.username}`);
    return;
  }
  // Don't bounce back to /login (it would just retry and look stuck).
  throw new Error('Could not set up your page');
}
