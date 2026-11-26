import { prisma } from './db';

// How a user signs in, and changes of the address they sign in with.

export async function getAuthInfo(userId: string) {
  const account = await prisma.account.findFirst({ where: { userId } });
  return {
    provider: account?.providerId === 'credential' ? 'credentials' : 'google',
  } as const;
}

export class EmailInUseError extends Error {
  constructor() {
    super('Email already in use');
  }
}

// The new address is not confirmed by mail, so the account is marked as
// unverified until it is: an unverified address is never trusted to link a
// sign-in from another provider.
export async function changeEmail(userId: string, newEmail: string) {
  const email = newEmail.trim().toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing && existing.id !== userId) throw new EmailInUseError();
  await prisma.user.update({
    where: { id: userId },
    data: { email, emailVerified: false },
  });
  return email;
}
