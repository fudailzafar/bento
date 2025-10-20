import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('imageUrl');

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'No image URL provided' },
        { status: 400 }
      );
    }

    // Extract public_id from Cloudinary URL
    // URL format: https://res.cloudinary.com/{cloud_name}/image/upload/{version}/{public_id}.{format}
    const urlParts = imageUrl.split('/');
    const uploadIndex = urlParts.indexOf('upload');
    if (uploadIndex === -1 || uploadIndex + 2 >= urlParts.length) {
      return NextResponse.json(
        { error: 'Invalid Cloudinary URL' },
        { status: 400 }
      );
    }

    // Get public_id (everything after version, before extension)
    const fileNameWithExt = urlParts.slice(uploadIndex + 2).join('/');
    const publicId = fileNameWithExt.substring(0, fileNameWithExt.lastIndexOf('.'));

    // Delete from Cloudinary using the Admin API
    // Note: This requires CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET
    const timestamp = Math.round(new Date().getTime() / 1000);
    const crypto = require('crypto');
    
    const signature = crypto
      .createHash('sha1')
      .update(
        `public_id=${publicId}&timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET}`
      )
      .digest('hex');

    const cloudinaryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/destroy`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          public_id: publicId,
          signature: signature,
          api_key: process.env.CLOUDINARY_API_KEY,
          timestamp: timestamp,
        }),
      }
    );

    if (!cloudinaryResponse.ok) {
      const error = await cloudinaryResponse.text();
      console.error('Cloudinary delete failed:', error);
      return NextResponse.json(
        { error: 'Failed to delete image from Cloudinary' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting project image:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}
