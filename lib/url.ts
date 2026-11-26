import { contactLink } from './contact-link';

// The one place a typed or pasted address becomes something usable.

const HAS_SCHEME = /^https?:\/\//i;

// "site.com/x" -> "https://site.com/x"; an address with a scheme is kept.
export const withProtocol = (url: string) =>
  HAS_SCHEME.test(url) ? url : `https://${url}`;

// A web address as a URL, or null when it is not one (email and phone links
// included: "mailto:jane@github.com" must not read as github.com).
export function parseWebUrl(raw: string): URL | null {
  const value = raw.trim();
  if (!value || contactLink(value)) return null;
  try {
    return new URL(withProtocol(value));
  } catch {
    return null;
  }
}

// What an <a> should open: email and phone links as they are, web addresses
// with https:// when they have no scheme.
export function linkHref(url: string): string {
  return contactLink(url)?.href ?? withProtocol(url);
}

// Email and phone links open the mail or phone app: no new tab.
export const isWebHref = (href: string) => HAS_SCHEME.test(href);
