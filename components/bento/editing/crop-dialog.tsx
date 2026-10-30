'use client';

import { useState } from 'react';
import Cropper, { type Area } from 'react-easy-crop';
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui';
import { LoaderCircle } from 'lucide-react';

// Draws the chosen area of an image to a canvas and returns it as a JPEG.
async function cropToBlob(src: string, area: Area): Promise<Blob> {
  const image = new Image();
  image.crossOrigin = 'anonymous';
  image.src = src;
  await image.decode();
  // Keep large crops sharp but bounded.
  const scale = Math.min(1, 1600 / Math.max(area.width, area.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(area.width * scale);
  canvas.height = Math.round(area.height * scale);
  canvas
    .getContext('2d')!
    .drawImage(
      image,
      area.x,
      area.y,
      area.width,
      area.height,
      0,
      0,
      canvas.width,
      canvas.height
    );
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Crop failed'))),
      'image/jpeg',
      0.92
    )
  );
}

interface CropDialogProps {
  src: string | null;
  aspect: number;
  round?: boolean;
  title?: string;
  onCancel: () => void;
  onDone: (blob: Blob) => Promise<void> | void;
}

export function CropDialog({
  src,
  aspect,
  round = false,
  title = 'Crop image',
  onCancel,
  onDone,
}: CropDialogProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState<Area | null>(null);
  const [busy, setBusy] = useState(false);

  const finish = async () => {
    if (!src || !area) return;
    setBusy(true);
    try {
      await onDone(await cropToBlob(src, area));
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog
      open={!!src}
      onOpenChange={(open) => {
        if (!open && !busy) onCancel();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="relative h-72 w-full overflow-hidden rounded-xl bg-black/90">
          {src && (
            <Cropper
              image={src}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              cropShape={round ? 'round' : 'rect'}
              showGrid={!round}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(_, pixels) => setArea(pixels)}
            />
          )}
        </div>
        <input
          type="range"
          aria-label="Zoom"
          min={1}
          max={3}
          step={0.01}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="w-full accent-black"
        />
        <DialogFooter>
          <Button variant="outline" onClick={onCancel} disabled={busy}>
            Cancel
          </Button>
          <Button onClick={finish} disabled={busy || !area}>
            {busy && <LoaderCircle className="mr-2 size-4 animate-spin" />}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
