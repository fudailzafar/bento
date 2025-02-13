// Delete file from UploadThing using their API
export const deleteUploadThingFile = async (fileUrl: string) => {
  // Use absolute URL for server-side fetch
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/uploadthing/delete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: fileUrl }),
  });
  if (!res.ok) throw new Error('Failed to delete file from UploadThing');
  return { success: true };
};
