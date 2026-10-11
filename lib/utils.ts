import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { SITE_URL } from './site';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDomainUrl(username: string) {
  const domain =
    process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : SITE_URL;
  return `${domain}/${username}`;
}
