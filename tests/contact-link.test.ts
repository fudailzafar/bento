import { describe, expect, it } from 'vitest';
import { contactLink, isWebHref, linkHref } from '@/lib/contact-link';
import { asUrl, fetchLinkPreview } from '@/lib/media';
import { findPlatform, hostOf } from '@/lib/platforms';
import { embedFor } from '@/lib/embeds';
import { richSourceFor } from '@/lib/rich-data';

describe('contactLink', () => {
  it('reads mailto links and bare email addresses', () => {
    expect(contactLink('mailto:jane@site.com')).toEqual({
      kind: 'mailto',
      href: 'mailto:jane@site.com',
      label: 'jane@site.com',
    });
    expect(contactLink('  Jane@Site.com ')?.href).toBe('mailto:Jane@Site.com');
    expect(contactLink('MAILTO:a@b.co?subject=Hi')?.href).toBe(
      'mailto:a@b.co?subject=Hi'
    );
  });

  it('reads tel links and keeps only the dialable characters', () => {
    expect(contactLink('tel:+1 (555) 010-0100')).toEqual({
      kind: 'tel',
      href: 'tel:+15550100100',
      label: '+1 (555) 010-0100',
    });
  });

  it('leaves web addresses and junk alone', () => {
    for (const text of [
      '',
      'site.com',
      'https://site.com/@a.b',
      'mailto:not-an-email',
      'tel:12',
      'tel:call me',
      'jane@site',
    ]) {
      expect(contactLink(text)).toBeNull();
    }
  });
});

describe('links to mail and phone', () => {
  it('opens them as they are, and adds https:// only to web addresses', () => {
    expect(linkHref('mailto:jane@site.com')).toBe('mailto:jane@site.com');
    expect(linkHref('tel:+15550100')).toBe('tel:+15550100');
    expect(linkHref('site.com')).toBe('https://site.com');
    expect(linkHref('http://site.com')).toBe('http://site.com');
    expect(isWebHref('mailto:a@b.co')).toBe(false);
    expect(isWebHref('https://site.com')).toBe(true);
  });

  it('pastes as a link', () => {
    expect(asUrl('jane@site.com')).toBe('mailto:jane@site.com');
    expect(asUrl('tel:+15550100')).toBe('tel:+15550100');
    expect(asUrl('site.com')).toBe('https://site.com');
  });

  it('titles the tile with the address, without fetching a page', async () => {
    expect(await fetchLinkPreview('mailto:jane@site.com')).toEqual({
      title: 'jane@site.com',
    });
  });

  it('never mistakes the email domain for a website', () => {
    const url = 'mailto:jane@github.com';
    expect(hostOf(url)).toBe('');
    expect(findPlatform(url)).toBeUndefined();
    expect(embedFor('mailto:jane@youtube.com')).toBeNull();
    expect(richSourceFor(url)).toBeNull();
  });
});
