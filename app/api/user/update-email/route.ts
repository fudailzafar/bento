import { NextResponse } from 'next/server';
import { z } from 'zod';
import { fail, withUser } from '@/lib/server/api';
import { EmailInUseError, changeEmail } from '@/lib/server/accounts';
import { rateLimit } from '@/lib/server/rate-limit';
import { readJson } from '@/lib/server/request';

const UpdateEmail = z.object({
  newEmail: z.string().trim().email('Invalid email address').max(320),
});

export const POST = withUser(
  async (user, request) => {
    rateLimit('update-email', user.id, { limit: 5, windowMs: 60 * 60_000 });
    const { newEmail } = await readJson(request, UpdateEmail, 2 * 1024);

    try {
      const email = await changeEmail(user.id, newEmail);
      return NextResponse.json({
        success: true,
        newEmail: email,
        pendingConfirmation: false,
      });
    } catch (error) {
      if (error instanceof EmailInUseError) fail(400, error.message);
      throw error;
    }
  },
  { failure: 'Failed to update email', log: 'Error updating email:' }
);
