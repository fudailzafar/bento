import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { checkMediaFile } from '@/lib/media';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Images up to 5MB, or bento's looping videos up to 25MB.
    const invalid = checkMediaFile(file);
    if (invalid) {
      return NextResponse.json({ error: invalid }, { status: 400 });
    }

    const fileExt = file.name.split('.').pop() || 'png';
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const { error } = await supabase.storage
      .from('images')
      .upload(`block-images/${fileName}`, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Supabase upload failed:', error);
      return NextResponse.json(
        { error: 'Failed to upload file' },
        { status: 500 }
      );
    }

    const { data: publicUrlData } = supabase.storage
      .from('images')
      .getPublicUrl(`block-images/${fileName}`);

    return NextResponse.json({ imageUrl: publicUrlData.publicUrl });
  } catch (error) {
    console.error('Error uploading block image:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}
