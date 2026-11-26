import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { databaseEnv } from './env';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createClient() {
  // A small pool per instance: many serverless instances share one database,
  // so each keeps few connections (use the pooled DATABASE_URL).
  const pool = new Pool({
    connectionString: databaseEnv().DATABASE_URL,
    max: Number(process.env.DATABASE_POOL_MAX) || 5,
  });
  return new PrismaClient({ adapter: new PrismaPg(pool) });
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
