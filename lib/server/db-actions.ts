import { prisma } from '@/lib/server/db';
import { ResumeDataSchema } from '@/lib/resume';
import { z } from 'zod';
import { PRIVATE_ROUTES } from '../routes';
import bcrypt from 'bcryptjs';

const FORBIDDEN_USERNAMES = PRIVATE_ROUTES;

// Define the file schema
const FileSchema = z.object({
  name: z.string(),
  url: z.string().nullish(),
  size: z.number(),
});

// Define the complete resume schema
const ResumeSchema = z.object({
  file: FileSchema.nullish(),
  fileContent: z.string().nullish(),
  resumeData: ResumeDataSchema.nullish(),
  updatedAt: z.string().optional(),
});

// Define user profile schema
const UserProfileSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string().optional(),
  image: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Define user credentials schema
const UserCredentialsSchema = z.object({
  email: z.string().email(),
    name: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type ResumeData = z.infer<typeof ResumeDataSchema>;
export type Resume = z.infer<typeof ResumeSchema>;
export type UserProfile = z.infer<typeof UserProfileSchema>;
export type UserCredentials = z.infer<typeof UserCredentialsSchema>;

export async function getResume(userId: string): Promise<Resume | undefined> {
  try {
    const resume = await prisma.resume.findUnique({
      where: { userId },
    });
    if (!resume) return undefined;

    return {
      file: resume.file as any,
      fileContent: resume.fileContent,
      resumeData: resume.resumeData as any,
      updatedAt: resume.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error('Error retrieving resume:', error);
    throw new Error('Failed to retrieve resume');
  }
}

export async function storeResume(userId: string, resumeData: Resume): Promise<void> {
  try {
    const validatedData = ResumeSchema.parse(resumeData);
    
    // We parse the data using JSON.parse(JSON.stringify) to ensure it's compatible with Prisma Json type
    // and strips out any undefined values that Prisma doesn't accept inside Json
    const fileJson = validatedData.file ? JSON.parse(JSON.stringify(validatedData.file)) : null;
    const resumeDataJson = validatedData.resumeData ? JSON.parse(JSON.stringify(validatedData.resumeData)) : null;
    
    await prisma.resume.upsert({
      where: { userId },
      update: {
        file: fileJson,
        fileContent: validatedData.fileContent,
        resumeData: resumeDataJson,
      },
      create: {
        userId,
        file: fileJson,
        fileContent: validatedData.fileContent,
        resumeData: resumeDataJson,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw error;
    }
    console.error('Error storing resume:', error);
    throw new Error('Failed to store resume');
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

