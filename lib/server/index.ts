// Cached functions
export { getCachedUser, getCachedResume } from './cached-functions';

// UploadThing file deletion
export { deleteUploadThingFile } from './delete-uploadthing-file';

// Redis client
export { upstashRedis } from './redis';

// Redis actions and types
export {
  getResume,
  storeResume,
  storeUserProfile,
  getUserProfile,
  createUsernameLookup,
  getUsernameById,
  getUserIdByUsername,
  checkUsernameAvailability,
  deleteUser,
  updateUsername,
  createUserWithCredentials,
  verifyUserCredentials,
  getUserIdByEmail,
  getUserCredentials,
  updateUserPassword,
  type ResumeData,
  type Resume,
  type UserProfile,
  type UserCredentials,
} from './redis-actions';

// PDF scraping
export { scrapePdfContent } from './scrape-pdf-actions';

// AI utilities
export { generateResumeObject } from './ai/generate-resume-object-gemini';
