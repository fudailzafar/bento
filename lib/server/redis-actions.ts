import { upstashRedis } from '@/lib/server/redis';
import { ResumeDataSchema } from '@/lib/resume';
import { z } from 'zod';
import { PRIVATE_ROUTES } from '../routes';
import bcrypt from 'bcryptjs';

// Key prefixes for different types of data
const REDIS_KEYS = {
  RESUME_PREFIX: 'resume:', // Using colon is a Redis convention for namespacing
  USER_ID_PREFIX: 'user:id:',
  USER_NAME_PREFIX: 'user:name:',
  USER_PROFILE_PREFIX: 'user:profile:',
  USER_CREDENTIALS_PREFIX: 'user:credentials:',
  EMAIL_TO_ID_PREFIX: 'user:email:',
} as const;

// Define the file schema
const FileSchema = z.object({
  name: z.string(),
  url: z.string().nullish(),
  size: z.number(),
});

const FORBIDDEN_USERNAMES = PRIVATE_ROUTES;

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
  passwordHash: z.string(),
  name: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Type inference for the resume data
export type ResumeData = z.infer<typeof ResumeDataSchema>;
export type Resume = z.infer<typeof ResumeSchema>;
export type UserProfile = z.infer<typeof UserProfileSchema>;
export type UserCredentials = z.infer<typeof UserCredentialsSchema>;

// Function to get resume data for a user
export async function getResume(userId: string): Promise<Resume | undefined> {
  try {
    const resume = await upstashRedis.get<Resume>(
      `${REDIS_KEYS.RESUME_PREFIX}${userId}`
    );
    return resume || undefined;
  } catch (error) {
    console.error('Error retrieving resume:', error);
    throw new Error('Failed to retrieve resume');
  }
}

// Function to store resume data for a user
export async function storeResume(
  userId: string,
  resumeData: Resume
): Promise<void> {
  try {
    const dataWithTimestamp = {
      ...resumeData,
      updatedAt: new Date().toISOString(),
    };
    const validatedData = ResumeSchema.parse(dataWithTimestamp);
    await upstashRedis.set(
      `${REDIS_KEYS.RESUME_PREFIX}${userId}`,
      validatedData
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw error;
    }
    console.error('Error storing resume:', error);
    throw new Error('Failed to store resume');
  }
}

// Function to store user profile data
export async function storeUserProfile(
  userId: string,
  profileData: Omit<UserProfile, 'createdAt' | 'updatedAt'>
): Promise<void> {
  try {
    const now = new Date().toISOString();
    const existingProfile = await getUserProfile(userId);

    const userProfile: UserProfile = {
      ...profileData,
      createdAt: existingProfile?.createdAt || now,
      updatedAt: now,
    };

    const validatedData = UserProfileSchema.parse(userProfile);
    await upstashRedis.set(
      `${REDIS_KEYS.USER_PROFILE_PREFIX}${userId}`,
      validatedData
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw error;
    }
    console.error('Error storing user profile:', error);
    throw new Error('Failed to store user profile');
  }
}

// Function to get user profile data
export async function getUserProfile(
  userId: string
): Promise<UserProfile | undefined> {
  try {
    const profile = await upstashRedis.get<UserProfile>(
      `${REDIS_KEYS.USER_PROFILE_PREFIX}${userId}`
    );
    return profile || undefined;
  } catch (error) {
    console.error('Error retrieving user profile:', error);
    throw new Error('Failed to retrieve user profile');
  }
}

/**
 * Create a new user with bidirectional lookup
 * @param userId Unique user identifier
 * @param username Unique username
 * @returns Promise resolving to boolean indicating success
 */
export const createUsernameLookup = async ({
  userId,
  username,
}: {
  userId: string;
  username: string;
}): Promise<boolean> => {
  // Check if username is forbidden
  if (FORBIDDEN_USERNAMES.includes(username.toLowerCase())) {
    return false;
  }

  // Check if username or user_id already exists
  const [usernameExists, userIdExists] = await Promise.all([
    upstashRedis.exists(`${REDIS_KEYS.USER_NAME_PREFIX}${username}`),
    upstashRedis.exists(`${REDIS_KEYS.USER_ID_PREFIX}${userId}`),
  ]);

  if (usernameExists || userIdExists) {
    return false;
  }

  // Create mappings in both directions
  const transaction = upstashRedis.multi();
  transaction.set(`${REDIS_KEYS.USER_ID_PREFIX}${userId}`, username);
  transaction.set(`${REDIS_KEYS.USER_NAME_PREFIX}${username}`, userId);

  try {
    const results = await transaction.exec();
    return results.every((result) => result === 'OK');
  } catch (error) {
    console.error('User creation failed:', error);
    return false;
  }
};

/**
 * Retrieve username by user ID
 * @param userId User ID to look up
 * @returns Promise resolving to username or null
 */
export const getUsernameById = async (
  userId: string
): Promise<string | null> => {
  return await upstashRedis.get(`${REDIS_KEYS.USER_ID_PREFIX}${userId}`);
};

/**
 * Retrieve user ID by username
 * @param username Username to look up
 * @returns Promise resolving to user ID or null
 */
export const getUserIdByUsername = async (
  username: string
): Promise<string | null> => {
  return await upstashRedis.get(`${REDIS_KEYS.USER_NAME_PREFIX}${username}`);
};

export const checkUsernameAvailability = async (
  username: string
): Promise<{
  available: boolean;
}> => {
  if (FORBIDDEN_USERNAMES.includes(username.toLowerCase())) {
    return { available: false };
  }
  const userId = await getUserIdByUsername(username);
  return { available: !userId };
};

/**
 * Delete a user by either user ID or username
 * @param opts Object containing either userId or username
 * @returns Promise resolving to boolean indicating success
 */
export const deleteUser = async (opts: {
  userId?: string;
  username?: string;
}): Promise<boolean> => {
  let userId: string | null = null;
  let username: string | null = null;

  // Determine lookup method based on input
  if (opts.userId) {
    username = await getUsernameById(opts.userId);
    if (!username) return false;
  } else if (opts.username) {
    userId = await getUserIdByUsername(opts.username);
    if (!userId) return false;
  } else {
    return false;
  }

  // Use the found values if not provided
  userId = userId || opts.userId!;
  username = username || opts.username!;

  // Delete both mappings
  const transaction = upstashRedis.multi();
  transaction.del(`${REDIS_KEYS.USER_ID_PREFIX}${userId}`);
  transaction.del(`${REDIS_KEYS.USER_NAME_PREFIX}${username}`);

  try {
    const results = await transaction.exec();
    return results.every((result) => result === 1);
  } catch (error) {
    console.error('User deletion failed:', error);
    return false;
  }
};

/**
 * Update username for a given user ID
 * @param userId User ID to update
 * @param newUsername New username
 * @returns Promise resolving to boolean indicating success
 */
export const updateUsername = async (
  userId: string,
  newUsername: string
): Promise<boolean> => {
  // Check if new username is forbidden
  if (FORBIDDEN_USERNAMES.includes(newUsername.toLowerCase())) {
    return false;
  }

  // Get current username
  const currentUsername = await getUsernameById(userId);
  if (!currentUsername) return false;

  // Check if new username is already taken
  const newUsernameExists = await upstashRedis.exists(
    `${REDIS_KEYS.USER_NAME_PREFIX}${newUsername}`
  );
  if (newUsernameExists) return false;

  // Create transaction to update mappings
  const transaction = upstashRedis.multi();
  transaction.del(`${REDIS_KEYS.USER_NAME_PREFIX}${currentUsername}`);
  transaction.set(`${REDIS_KEYS.USER_ID_PREFIX}${userId}`, newUsername);
  transaction.set(`${REDIS_KEYS.USER_NAME_PREFIX}${newUsername}`, userId);

  try {
    const results = await transaction.exec();
    return results.every((result) => result === 'OK' || result === 1);
  } catch (error) {
    console.error('Username update failed:', error);
    return false;
  }
};

/**
 * Create a new user with credentials (email + password)
 * @param email User's email address
 * @param password User's plain text password
 * @param name Optional user's name
 * @returns Promise resolving to user ID or null if failed
 */
export const createUserWithCredentials = async (
  email: string,
  password: string,
  name?: string
): Promise<string | null> => {
  try {
    // Check if email already exists
    const existingUserId = await getUserIdByEmail(email);
    if (existingUserId) {
      return null;
    }

    // Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Generate user ID from email
    const userId = email;
    const now = new Date().toISOString();

    const credentials: UserCredentials = {
      email,
      passwordHash,
      name,
      createdAt: now,
      updatedAt: now,
    };

    // Store credentials and email mapping
    const transaction = upstashRedis.multi();
    transaction.set(
      `${REDIS_KEYS.USER_CREDENTIALS_PREFIX}${userId}`,
      credentials
    );
    transaction.set(`${REDIS_KEYS.EMAIL_TO_ID_PREFIX}${email}`, userId);

    await transaction.exec();

    // Also create user profile
    await storeUserProfile(userId, {
      id: userId,
      email,
      name,
    });

    return userId;
  } catch (error) {
    console.error('User creation with credentials failed:', error);
    return null;
  }
};

/**
 * Verify user credentials
 * @param email User's email
 * @param password User's plain text password
 * @returns Promise resolving to user ID if credentials are valid, null otherwise
 */
export const verifyUserCredentials = async (
  email: string,
  password: string
): Promise<string | null> => {
  try {
    const userId = await getUserIdByEmail(email);
    if (!userId) {
      return null;
    }

    const credentials = await upstashRedis.get<UserCredentials>(
      `${REDIS_KEYS.USER_CREDENTIALS_PREFIX}${userId}`
    );

    if (!credentials) {
      return null;
    }

    const isValid = await bcrypt.compare(password, credentials.passwordHash);
    return isValid ? userId : null;
  } catch (error) {
    console.error('Credential verification failed:', error);
    return null;
  }
};

/**
 * Get user ID by email
 * @param email User's email address
 * @returns Promise resolving to user ID or null
 */
export const getUserIdByEmail = async (
  email: string
): Promise<string | null> => {
  return await upstashRedis.get(`${REDIS_KEYS.EMAIL_TO_ID_PREFIX}${email}`);
};

/**
 * Get user credentials by email
 * @param email User's email address
 * @returns Promise resolving to user credentials or null
 */
export const getUserCredentials = async (
  email: string
): Promise<UserCredentials | null> => {
  try {
    const userId = await getUserIdByEmail(email);
    if (!userId) {
      return null;
    }

    return await upstashRedis.get<UserCredentials>(
      `${REDIS_KEYS.USER_CREDENTIALS_PREFIX}${userId}`
    );
  } catch (error) {
    console.error('Error retrieving user credentials:', error);
    return null;
  }
};

/**
 * Update user password
 * @param email User's email
 * @param newPassword New plain text password
 * @returns Promise resolving to boolean indicating success
 */
export const updateUserPassword = async (
  email: string,
  newPassword: string
): Promise<boolean> => {
  try {
    const userId = await getUserIdByEmail(email);
    if (!userId) {
      return false;
    }

    const credentials = await upstashRedis.get<UserCredentials>(
      `${REDIS_KEYS.USER_CREDENTIALS_PREFIX}${userId}`
    );

    if (!credentials) {
      return false;
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);
    const now = new Date().toISOString();

    const updatedCredentials: UserCredentials = {
      ...credentials,
      passwordHash,
      updatedAt: now,
    };

    await upstashRedis.set(
      `${REDIS_KEYS.USER_CREDENTIALS_PREFIX}${userId}`,
      updatedCredentials
    );

    return true;
  } catch (error) {
    console.error('Password update failed:', error);
    return false;
  }
};
