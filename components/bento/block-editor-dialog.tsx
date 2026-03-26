'use client';

import { useEffect, useState } from 'react';
import { Block } from '@/lib';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Input,
  Label,
  Textarea,
  Button,
} from '@/components/ui';
import { LoaderCircle, Upload } from 'lucide-react';
import { toast } from 'sonner';

interface BlockEditorDialogProps {
  block: Block | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: Record<string, unknown>) => void;
}

export function BlockEditorDialog({
  block,
  open,
  onOpenChange,
  onSave,
}: BlockEditorDialogProps) {
  const [data, setData] = useState<Record<string, unknown>>({});
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (block) setData(block.data);
  }, [block]);

  if (!block) return null;

  const update = (patch: Record<string, unknown>) =>
    setData((prev) => ({ ...prev, ...patch }));

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/block-image/upload', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }
      const result = await response.json();
      update({ url: result.imageUrl });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to upload image'
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit {block.type.toLowerCase().replace('_', ' ')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {block.type === 'LINK' && (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="link-title">Title</Label>
                <Input
                  id="link-title"
                  value={(data.title as string) || ''}
                  onChange={(e) => update({ title: e.target.value })}
                  placeholder="My cool link"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="link-url">URL</Label>
                <Input
                  id="link-url"
                  value={(data.url as string) || ''}
                  onChange={(e) => update({ url: e.target.value })}
                  placeholder="https://example.com"
                />
              </div>
            </>
          )}

          {block.type === 'IMAGE' && (
            <div className="space-y-1.5">
              <Label>Image</Label>
              {data.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={data.url as string}
                  alt=""
                  className="mb-2 h-32 w-full rounded-lg object-cover"
                />
              ) : null}
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground hover:bg-muted">
                {isUploading ? (
                  <LoaderCircle className="size-4 animate-spin" />
                ) : (
                  <Upload className="size-4" />
                )}
                {isUploading ? 'Uploading...' : 'Upload image'}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={isUploading}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                    e.target.value = '';
                  }}
                />
              </label>
              <div className="space-y-1.5 pt-2">
                <Label htmlFor="image-alt">Alt text (optional)</Label>
                <Input
                  id="image-alt"
                  value={(data.alt as string) || ''}
                  onChange={(e) => update({ alt: e.target.value })}
                  placeholder="Describe this image"
                />
              </div>
            </div>
          )}

          {block.type === 'TEXT' && (
            <div className="space-y-1.5">
              <Label htmlFor="text-content">Text</Label>
              <Textarea
                id="text-content"
                value={(data.content as string) || ''}
                onChange={(e) => update({ content: e.target.value })}
                placeholder="Write something..."
                rows={5}
              />
            </div>
          )}

          {block.type === 'MAP' && (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="map-location">Location</Label>
                <Input
                  id="map-location"
                  value={(data.location as string) || ''}
                  onChange={(e) => update({ location: e.target.value })}
                  placeholder="San Francisco, CA"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="map-label">Label (optional)</Label>
                <Input
                  id="map-label"
                  value={(data.label as string) || ''}
                  onChange={(e) => update({ label: e.target.value })}
                  placeholder="Where I live"
                />
              </div>
            </>
          )}

          {block.type === 'SECTION_TITLE' && (
            <div className="space-y-1.5">
              <Label htmlFor="section-title">Title</Label>
              <Input
                id="section-title"
                value={(data.title as string) || ''}
                onChange={(e) => update({ title: e.target.value })}
                placeholder="Section title"
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={() => onSave(data)}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
