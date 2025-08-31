import {
  createUserWithCredentials,
  createUsernameLookup,
  checkUsernameAvailability,
} from '@/lib/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const SignupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  name: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = SignupSchema.parse(body);

    // Check if username is available
    const { available } = await checkUsernameAvailability(
      validatedData.username
    );
    if (!available) {
      return NextResponse.json(
        { error: 'Username is not available' },
        { status: 400 }
      );
    }

    const userId = await createUserWithCredentials(
      validatedData.email,
      validatedData.password,
      validatedData.name
    );

    if (!userId) {
      return NextResponse.json(
        { error: 'Email already exists or registration failed' },
        { status: 400 }
      );
    }

    // Create username lookup after user is created
    const usernameCreated = await createUsernameLookup({
      userId,
      username: validatedData.username,
    });

    if (!usernameCreated) {
      return NextResponse.json(
        { error: 'Failed to create username' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'User created successfully',
        userId,
        username: validatedData.username,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
