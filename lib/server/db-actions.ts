import { prisma } from '@/lib/server/db';
import { PageDataSchema, parseBlockData, type PageData } from '@/lib/blocks';
import { z } from 'zod';
import { PRIVATE_ROUTES, RESERVED_USERNAMES, isValidUsername } from '../routes';

const FORBIDDEN_USERNAMES = [...PRIVATE_ROUTES, ...RESERVED_USERNAMES];
const isForbidden = (username: string) =>
  !isValidUsername(username) ||
  FORBIDDEN_USERNAMES.includes(username.toLowerCase());

// Define user profile schema
const UserProfileSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string().optional(),
  image: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;
export type { PageData };

export class PageConflictError extends Error {
  constructor() {
    super('The page was saved from somewhere else.');
  }
}

const findPage = (userId: string) =>
  prisma.page.findUnique({
    where: { userId },
    include: { blocks: { orderBy: { y: 'asc' } } },
  });
type PageRow = NonNullable<Awaited<ReturnType<typeof findPage>>>;

const toPageData = (page: PageRow): PageData => ({
  name: page.name,
  headline: page.headline,
  bio: page.bio,
  website: page.website,
  email: page.email,
  twitter: page.twitter,
  linkedin: page.linkedin,
  github: page.github,
  blocks: page.blocks.map((block) => ({
    id: block.id,
    type: block.type,
    x: block.x,
    y: block.y,
    w: block.w,
    h: block.h,
    mx: block.mx,
    my: block.my,
    mw: block.mw,
    mh: block.mh,
    data: block.data as Record<string, unknown>,
  })),
});

export async function getPage(userId: string): Promise<PageData | undefined> {
  try {
    const page = await findPage(userId);
    return page ? toPageData(page) : undefined;
  } catch (error) {
    console.error('Error retrieving page:', error);
    throw new Error('Failed to retrieve page');
  }
}

// The editor's copy: the page and the version its next save must name.
export async function getEditablePage(userId: string) {
  const page = await findPage(userId);
  return {
    page: page ? toPageData(page) : undefined,
    version: page?.version ?? 0,
  };
}

// Replaces the page with `pageData`, but only if it is still at
// `expectedVersion`; otherwise another tab or device saved first and this
// throws PageConflictError. Returns the new version.
export async function savePage(
  userId: string,
  pageData: PageData,
  expectedVersion: number
): Promise<number> {
  try {
    const validated = PageDataSchema.parse(pageData);

    // Validate each block's data against its type-specific schema before persisting
    for (const block of validated.blocks) {
      parseBlockData(block.type, block.data);
    }

    const { blocks, ...fields } = validated;
    const version = expectedVersion + 1;

    await prisma.$transaction(async (tx) => {
      let pageId: string;
      if (expectedVersion === 0) {
        // No page yet: a second creator hits the unique userId.
        pageId = (
          await tx.page.create({ data: { userId, ...fields, version } })
        ).id;
      } else {
        // The version in the filter makes the check and the write one step.
        const { count } = await tx.page.updateMany({
          where: { userId, version: expectedVersion },
          data: { ...fields, version },
        });
        if (count === 0) throw new PageConflictError();
        pageId = (
          await tx.page.findUniqueOrThrow({
            where: { userId },
            select: { id: true },
          })
        ).id;
      }

      // Replace all blocks in one go — matches the editor's "save whole page" pattern
      await tx.block.deleteMany({ where: { pageId } });
      if (blocks.length > 0) {
        await tx.block.createMany({
          data: blocks.map((block) => ({
            // Keep the editor's ids so click counts follow a block across saves.
            id: block.id,
            pageId,
            type: block.type,
            x: block.x,
            y: block.y,
            w: block.w,
            h: block.h,
            mx: block.mx ?? null,
            my: block.my ?? null,
            mw: block.mw ?? null,
            mh: block.mh ?? null,
            data: JSON.parse(JSON.stringify(block.data)),
          })),
        });
      }
    });
    return version;
  } catch (error) {
    if (error instanceof z.ZodError || error instanceof PageConflictError) {
      throw error;
    }
    // Creating a page twice at once: the second one lost the race.
    if (
      typeof error === 'object' &&
      error !== null &&
      (error as { code?: string }).code === 'P2002'
    ) {
      throw new PageConflictError();
    }
    console.error('Error storing page:', error);
    throw new Error('Failed to store page');
  }
}

export async function storeUserProfile(
  userId: string,
  profileData: Omit<UserProfile, 'createdAt' | 'updatedAt'>
): Promise<void> {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        email: profileData.email,
        name: profileData.name,
        image: profileData.image,
      },
    });
  } catch (error) {
    console.error('Error storing user profile:', error);
    throw new Error('Failed to store user profile');
  }
}

export async function getUserProfile(
  userId: string
): Promise<UserProfile | undefined> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) return undefined;

    return {
      id: user.id,
      email: user.email,
      name: user.name || undefined,
      image: user.image || undefined,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error('Error retrieving user profile:', error);
    throw new Error('Failed to retrieve user profile');
  }
}

export const createUsernameLookup = async ({
  userId,
  username,
}: {
  userId: string;
  username: string;
}): Promise<boolean> => {
  if (isForbidden(username)) {
    return false;
  }

  try {
    // Check if username already exists for any user or if this user already has a username
    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { id: userId, username: { not: null } }],
      },
    });

    if (existing) return false;

    await prisma.user.update({
      where: { id: userId },
      data: { username },
    });

    return true;
  } catch (error) {
    console.error('User creation failed:', error);
    return false;
  }
};

export const getUsernameById = async (
  userId: string
): Promise<string | null> => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  return user?.username || null;
};

export const getUserIdByUsername = async (
  username: string
): Promise<string | null> => {
  const user = await prisma.user.findUnique({ where: { username } });
  return user?.id || null;
};

export const checkUsernameAvailability = async (
  username: string
): Promise<{ available: boolean }> => {
  if (isForbidden(username)) {
    return { available: false };
  }
  const userId = await getUserIdByUsername(username);
  return { available: !userId };
};

export const updateUsername = async (
  userId: string,
  newUsername: string
): Promise<boolean> => {
  if (isForbidden(newUsername)) {
    return false;
  }

  try {
    const current = await prisma.user.findUnique({ where: { id: userId } });
    if (!current?.username) {
      return await createUsernameLookup({ userId, username: newUsername });
    }

    const newUsernameExists = await prisma.user.findUnique({
      where: { username: newUsername },
    });
    if (newUsernameExists) return false;

    await prisma.user.update({
      where: { id: userId },
      data: { username: newUsername },
    });
    return true;
  } catch (error) {
    console.error('Username update failed:', error);
    return false;
  }
};
