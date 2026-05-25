import { createClient } from '@/lib/supabase/server';
import UploadPageClient from './client';
import { redirect } from 'next/navigation';

export default async function UploadPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.email) {
    redirect('/login');
  }
  return <UploadPageClient />;
}
