import { getServerSession } from 'next-auth';
import UploadPageClient from './client';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

export default async function UploadPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect('/login');
  }
  return <UploadPageClient />;
}
