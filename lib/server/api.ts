import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, type AuthSessionUser } from './session';

// What every signed-in API route repeats, once: answer 401 when nobody is
// signed in, turn a thrown `fail(...)` into its status and message, and answer
// 500 (after logging) for anything unexpected.

// Throw this (through `fail`) to answer with a status and a message.
export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string
  ) {
    super(message);
  }
}

export function fail(status: number, message: string): never {
  throw new ApiError(status, message);
}

interface Options {
  // The 500 message: a fixed text, or one made from the error.
  failure?: string | ((error: unknown) => string);
  // The log line for an unexpected error.
  log?: string;
  // Answer some errors differently (a conflict, a validation failure).
  // Return nothing to leave an error to the default 500.
  onError?: (error: unknown) => Response | undefined;
}

type Handler = (
  user: AuthSessionUser,
  request: NextRequest
) => Promise<Response> | Response;

export function withUser(
  handler: Handler,
  { failure = 'Internal server error', log, onError }: Options = {}
) {
  return async (request: NextRequest): Promise<Response> => {
    const user = await getCurrentUser();
    if (!user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
      return await handler(user, request);
    } catch (error) {
      if (error instanceof ApiError) {
        return NextResponse.json(
          { error: error.message },
          { status: error.status }
        );
      }
      const custom = onError?.(error);
      if (custom) return custom;
      console.error(log ?? 'API error:', error);
      return NextResponse.json(
        { error: typeof failure === 'function' ? failure(error) : failure },
        { status: 500 }
      );
    }
  };
}
