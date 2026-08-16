import { prisma } from '@/lib/server/db';
import { PageDataSchema, parseBlockData, type PageData } from '@/lib/blocks';
import { z } from 'zod';
import { PRIVATE_ROUTES } from '../routes';

const FORBIDDEN_USERNAMES = PRIVATE_ROUTES;

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

export async function getPage(userId: string): Promise<PageData | undefined> {
  try {
    const page = await prisma.page.findUnique({
      where: { userId },
      include: { blocks: { orderBy: { y: 'asc' } } },
    });
    if (!page) return undefined;

    return {
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
        data: block.data as Record<string, unknown>,
      })),
    };
  } catch (error) {
    console.error('Error retrieving page:', error);
    throw new Error('Failed to retrieve page');
  }
}

export async function savePage(userId: string, pageData: PageData): Promise<void> {
  try {
    const validated = PageDataSchema.parse(pageData);

    // Validate each block's data against its type-specific schema before persisting
    for (const block of validated.blocks) {
      parseBlockData(block.type, block.data);
    }

    await prisma.$transaction(async (tx) => {
      const page = await tx.page.upsert({
        where: { userId },
        update: {
          name: validated.name,
          headline: validated.headline,
          bio: validated.bio,
          website: validated.website,
          email: validated.email,
          twitter: validated.twitter,
          linkedin: validated.linkedin,
          github: validated.github,
        },
        create: {
          userId,
          name: validated.name,
          headline: validated.headline,
          bio: validated.bio,
          website: validated.website,
          email: validated.email,
          twitter: validated.twitter,
          linkedin: validated.linkedin,
          github: validated.github,
        },
      });

      // Replace all blocks in one go — matches the editor's "save whole page" pattern
      await tx.block.deleteMany({ where: { pageId: page.id } });
      if (validated.blocks.length > 0) {
        await tx.block.createMany({
          data: validated.blocks.map((block) => ({
            pageId: page.id,
            type: block.type,
            x: block.x,
            y: block.y,
            w: block.w,
            h: block.h,
            data: JSON.parse(JSON.stringify(block.data)),
          })),
        });
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw error;
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

export async function getUserProfile(userId: string): Promise<UserProfile | undefined> {
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
  if (FORBIDDEN_USERNAMES.includes(username.toLowerCase())) {
    return false;
  }

  try {
    // Check if username already exists for any user or if this user already has a username
    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { id: userId, username: { not: null } }
        ]
      }
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

export const getUsernameById = async (userId: string): Promise<string | null> => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  return user?.username || null;
};

export const getUserIdByUsername = async (username: string): Promise<string | null> => {
  const user = await prisma.user.findUnique({ where: { username } });
  return user?.id || null;
};

export const checkUsernameAvailability = async (username: string): Promise<{ available: boolean }> => {
  if (FORBIDDEN_USERNAMES.includes(username.toLowerCase())) {
    return { available: false };
  }
  const userId = await getUserIdByUsername(username);
  return { available: !userId };
};

export const deleteUser = async (opts: { userId?: string; username?: string }): Promise<boolean> => {
  try {
    if (opts.userId) {
      await prisma.user.delete({ where: { id: opts.userId } });
      return true;
    } else if (opts.username) {
      await prisma.user.delete({ where: { username: opts.username } });
      return true;
    }
    return false;
  } catch (error) {
    console.error('User deletion failed:', error);
    return false;
  }
};

export const updateUsername = async (userId: string, newUsername: string): Promise<boolean> => {
  if (FORBIDDEN_USERNAMES.includes(newUsername.toLowerCase())) {
    return false;
  }

  try {
    const current = await prisma.user.findUnique({ where: { id: userId } });
    if (!current?.username) {
      return await createUsernameLookup({ userId, username: newUsername });
    }

    const newUsernameExists = await prisma.user.findUnique({ where: { username: newUsername } });
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

export const getUserIdByEmail = async (email: string): Promise<string | null> => {
  const user = await prisma.user.findUnique({ where: { email } });
  return user?.id || null;
};

