import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import {
  getResume,
  storeResume,
  scrapePdfContent,
  deleteUploadThingFile,
  getUsernameById,
} from '@/lib/server';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { LoadingFallback } from '@/components/utils';

async function PdfProcessing({ userId }: { userId: string }) {
  const resume = await getResume(userId);

  if (!resume || !resume.file || !resume.file.url) redirect('/upload');

  if (!resume.fileContent) {
    const fileContent = await scrapePdfContent(resume?.file.url);

    // check if the fileContent was good or bad, if bad we redirect to the upload page and delete the object from S3 and redis
    const isContentBad = false; // await isFileContentBad(fileContent);

    if (isContentBad) {
      // Delete file from UploadThing
      await deleteUploadThingFile(resume.file.url);

      await storeResume(userId, {
        ...resume,
        file: undefined,
        fileContent: null,
        resumeData: null,
      });

      redirect('/upload');
    }

    await storeResume(userId, {
      ...resume,
      fileContent: fileContent,
      resumeData: null,
    });
  }

  const username = await getUsernameById(userId);
  redirect(username ? `/${username}` : '/upload');
  return <></>; // This line will never be reached due to the redirect
}

export default async function Pdf() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect('/login');
  }

  // Use email as userId or create a consistent user identifier
  const userId = session.user.email;

  return (
    <>
      <Suspense fallback={<LoadingFallback />}>
        <PdfProcessing userId={userId} />
      </Suspense>
    </>
  );
}
