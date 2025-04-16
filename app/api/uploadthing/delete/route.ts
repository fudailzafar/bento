import { NextRequest, NextResponse } from 'next/server';

// You need your UploadThing secret key in your environment variables
const UPLOADTHING_SECRET = process.env.UPLOADTHING_SECRET;

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json(
        { error: 'No file URL provided' },
        { status: 400 }
      );
    }

    // Extract file key from the URL (UploadThing URLs are like https://utfs.io/f/KEY)
    const match = url.match(/\/f\/(.+)$/);
    const fileKey = match ? match[1] : null;
    if (!fileKey) {
      return NextResponse.json({ error: 'Invalid file URL' }, { status: 400 });
    }

    // Call UploadThing's delete API
    const res = await fetch('https://uploadthing.com/api/deleteFile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${UPLOADTHING_SECRET}`,
      },
      body: JSON.stringify({ fileKey }),
    });

    if (!res.ok) {
      const error = await res.text();
      return NextResponse.json(
        { error: error || 'Failed to delete file' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
