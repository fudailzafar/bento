import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
  generateUploadButton,
  generateUploadDropzone,
} from '@uploadthing/react';
import { OurFileRouter } from '@/app/api/uploadthing/core';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDomainUrl(username: string) {
  const domain =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://portfolio.fudail.me';
  return `${domain}/${username}`;
}

export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
