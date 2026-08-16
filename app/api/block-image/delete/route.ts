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
    console.error('Error deleting block image:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}
