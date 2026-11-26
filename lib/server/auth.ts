import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from '@/lib/server/db';
import { authEnv } from '@/lib/server/env';

const env = authEnv();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    ...(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
          },
        }
      : {}),
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ['google'],
      // Left at its default (true): Google's verified email only links to an
      // existing account whose own email is verified, so nobody can pre-register
      // a victim's address with a password and inherit their Google sign-in.
    },
  },
  user: {
    additionalFields: {
      username: {
        type: 'string',
        required: false,
        input: true,
      },
    },
  },
  secret: env.BETTER_AUTH_SECRET,
  baseURL:
    env.BETTER_AUTH_URL || env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
});
