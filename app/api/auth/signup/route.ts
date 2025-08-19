import { createUserWithCredentials } from '@/lib/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const SignupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = SignupSchema.parse(body);

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

    return NextResponse.json(
      {
        success: true,
        message: 'User created successfully',
        userId,
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
