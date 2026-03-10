import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) {
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
    const urlParts = imageUrl.split('/');
    const uploadIndex = urlParts.indexOf('upload');
    if (uploadIndex === -1 || uploadIndex + 2 >= urlParts.length) {
      return NextResponse.json(
        { error: 'Invalid Cloudinary URL' },
        { status: 400 }
      );
    }

    const fileNameWithExt = urlParts.slice(uploadIndex + 2).join('/');
    
    // Extract file path from URL
    let filePathToDelete = imageUrl;
    try {
      const url = new URL(imageUrl);
      const parts = url.pathname.split('/images/');
      if (parts.length > 1) {
        filePathToDelete = parts[1];
      }
    } catch (e) {
      console.error('Failed to parse imageUrl', e);
    }

    const { error } = await supabase.storage
      .from('images')
      .remove([filePathToDelete]);

    if (error) {
      console.error('Supabase delete failed:', error);
      return NextResponse.json(
        { error: 'Failed to delete image' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting education logo:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}
