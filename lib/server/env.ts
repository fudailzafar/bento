import { z } from 'zod';

// The server's settings, checked where they are first needed so a missing one
// fails with its name instead of an "undefined" deep inside a library.

function read<T extends z.ZodTypeAny>(name: string, schema: T): z.infer<T> {
  const result = schema.safeParse(process.env);
  if (result.success) return result.data;
  const problems = result.error.issues
    .map((issue) => `  ${issue.path.join('.')}: ${issue.message}`)
    .join('\n');
  throw new Error(`Invalid ${name} settings:\n${problems}`);
}

const once = <T>(load: () => T) => {
  let value: T | undefined;
  return () => (value ??= load());
};

export const databaseEnv = once(() =>
  read('database', z.object({ DATABASE_URL: z.string().min(1, 'is required') }))
);

export const authEnv = once(() =>
  read(
    'auth',
    z
      .object({
        BETTER_AUTH_SECRET: z
          .string()
          .min(16, 'must be at least 16 characters'),
        BETTER_AUTH_URL: z.string().url().optional(),
        NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
        GOOGLE_CLIENT_ID: z.string().min(1).optional(),
        GOOGLE_CLIENT_SECRET: z.string().min(1).optional(),
      })
      .refine((env) => !!env.GOOGLE_CLIENT_ID === !!env.GOOGLE_CLIENT_SECRET, {
        message: 'GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET go together',
        path: ['GOOGLE_CLIENT_ID'],
      })
  )
);

export const storageEnv = once(() =>
  read(
    'storage',
    z.object({
      R2_ACCOUNT_ID: z.string().min(1, 'is required'),
      R2_ACCESS_KEY_ID: z.string().min(1, 'is required'),
      R2_SECRET_ACCESS_KEY: z.string().min(1, 'is required'),
      R2_BUCKET_NAME: z.string().min(1).default('bento-me'),
      NEXT_PUBLIC_R2_PUBLIC_URL: z.string().url('must be a URL'),
    })
  )
);
