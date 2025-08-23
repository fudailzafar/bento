// Delete file from UploadThing using their API
export const deleteUploadThingFile = async (fileUrl: string) => {
  // You may need to call your own API route that wraps the UploadThing delete API
  // For example, POST /api/uploadthing/delete { url: fileUrl }
  const res = await fetch("/api/uploadthing/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: fileUrl }),
  });
  if (!res.ok) throw new Error("Failed to delete file from UploadThing");
  return { success: true };
};
