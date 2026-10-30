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
import { Crop, LoaderCircle, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { findPlatform } from '@/lib/platforms';
import {
  asUrl,
  fetchLinkPreview,
  isVideoFile,
  isVideoUrl,
  uploadBlockMedia,
} from '@/lib/media';
import { CropDialog } from './editing/crop-dialog';
import { tileAspect } from './link-tile';

// bento's note palette (its colour picker's swatches).
const NOTE_COLORS = [
  '#FFFFFF',
  '#F5F5F5',
  '#FFE4E4',
  '#FFEFD9',
  '#FFF8CC',
  '#E3F9E5',
  '#DDF4FF',
  '#E8E4FF',
  '#FCE4F6',
  '#768CFF',
  '#4EDD76',
  '#FF6B6B',
  '#FFB020',
  '#2F2F2F',
  '#000000',
  '#3B82F6',
];

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
  const [isFetching, setIsFetching] = useState(false);
  const [cropSrc, setCropSrc] = useState<string | null>(null);

  useEffect(() => {
    if (block) setData(block.data);
  }, [block]);

  if (!block) return null;

  const update = (patch: Record<string, unknown>) =>
    setData((prev) => ({ ...prev, ...patch }));

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const url = await uploadBlockMedia(file);
      update({
        url,
        kind: isVideoFile(file) ? 'video' : 'image',
        original: undefined,
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to upload file'
      );
    } finally {
      setIsUploading(false);
    }
  };

  // Fills the tile's preview image (and title, for plain links) from the
  // page's Open Graph tags once a URL is entered.
  const loadPreview = async () => {
    const url = asUrl((data.url as string) || '');
    if (!url || url === block.data.url) return;
    setIsFetching(true);
    const preview = await fetchLinkPreview(url);
    setIsFetching(false);
    const title = data.title as string | undefined;
    const untitled =
      !title || title === 'New link' || title === 'Untitled link';
    update({
      url,
      image: preview.image,
      description: preview.description,
      ...(untitled && !findPlatform(url) && preview.title
        ? { title: preview.title }
        : {}),
    });
  };

  const isVideo = data.kind === 'video' || isVideoUrl(data.url as string);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Edit {block.type.toLowerCase().replace('_', ' ')}
          </DialogTitle>
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
                  onBlur={loadPreview}
                  placeholder="https://example.com"
                />
                {isFetching && (
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <LoaderCircle className="size-3 animate-spin" />
                    Fetching preview...
                  </p>
                )}
              </div>
            </>
          )}

          {block.type === 'IMAGE' && (
            <div className="space-y-1.5">
              <Label>Image or video</Label>
              {data.url ? (
                isVideo ? (
                  <video
                    src={data.url as string}
                    className="mb-2 h-32 w-full rounded-lg object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                ) : (
                  <div className="relative mb-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={data.url as string}
                      alt=""
                      className="h-32 w-full rounded-lg object-cover"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      className="absolute bottom-2 right-2 h-7 gap-1 px-2 text-xs"
                      onClick={() =>
                        setCropSrc(
                          (data.original as string) || (data.url as string)
                        )
                      }
                    >
                      <Crop className="size-3" />
                      Crop
                    </Button>
                  </div>
                )
              ) : null}
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground hover:bg-muted">
                {isUploading ? (
                  <LoaderCircle className="size-4 animate-spin" />
                ) : (
                  <Upload className="size-4" />
                )}
                {isUploading ? 'Uploading...' : 'Upload image or video'}
                <input
                  type="file"
                  accept="image/*,video/mp4,video/webm,video/quicktime"
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

          {block.type === 'TEXT' && (
            <div className="space-y-2">
              <Label>Colour</Label>
              <div className="flex flex-wrap gap-1.5">
                {NOTE_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    aria-label={c}
                    onClick={() => update({ color: c })}
                    className={`h-6 w-6 rounded-full border border-black/10 ${(data.color ?? '#FFFFFF') === c ? 'ring-2 ring-black ring-offset-1' : ''}`}
                    style={{ background: c }}
                  />
                ))}
              </div>
              <Label>Alignment</Label>
              <div className="flex gap-1.5">
                {(['left', 'center', 'right'] as const).map((a) => (
                  <Button
                    key={a}
                    type="button"
                    size="sm"
                    variant={
                      (data.align ?? 'left') === a ? 'default' : 'outline'
                    }
                    onClick={() => update({ align: a })}
                  >
                    {a[0].toUpperCase() + a.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {(block.type === 'TEXT' || block.type === 'IMAGE') && (
            <div className="space-y-2">
              <Label htmlFor="tile-link">Link (optional)</Label>
              <Input
                id="tile-link"
                placeholder="https://"
                value={(data.href as string) || ''}
                onChange={(e) => update({ href: e.target.value })}
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
          <Button
            disabled={isUploading || isFetching}
            onClick={() => onSave(data)}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
      <CropDialog
        src={cropSrc}
        aspect={tileAspect(block.w, block.h)}
        onCancel={() => setCropSrc(null)}
        onDone={async (blob) => {
          try {
            const url = await uploadBlockMedia(blob);
            update({
              url,
              kind: 'image',
              original: (data.original as string) || (data.url as string),
            });
            setCropSrc(null);
          } catch (error) {
            toast.error(
              error instanceof Error ? error.message : 'Failed to crop image'
            );
          }
        }}
      />
    </Dialog>
  );
}
