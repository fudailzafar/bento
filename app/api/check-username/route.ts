import { checkUsernameAvailability } from '@/lib/server';
import { NextRequest, NextResponse } from 'next/server';

// API Response Types
export type GetResponse = { available: boolean } | { error: string };

// GET endpoint to check username availability
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const username = searchParams.get('username');

    if (!username || typeof username !== 'string') {
      return NextResponse.json(
        { error: 'Username parameter is required' },
        { status: 400 }
      );
    }

    const { available } = await checkUsernameAvailability(username);

    return NextResponse.json({ available });
  } catch (error) {
    console.error('Error checking username availability:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST endpoint to check username availability
export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const username = searchParams.get('username');

    if (!username || typeof username !== 'string') {
      return NextResponse.json(
        { error: 'Username parameter is required' },
        { status: 400 }
      );
    }

    const { available } = await checkUsernameAvailability(username);

    return NextResponse.json({ available });
  } catch (error) {
    console.error('Error checking username availability:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
