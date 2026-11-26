// Email and phone links: "mailto:jane@site.com" and "tel:+1 555 0100". A bare
// email address counts as a mailto link too. Everything else is a web address.

export interface ContactLink {
  kind: 'mailto' | 'tel';
  // What the anchor opens: mailto:jane@site.com or tel:+15550100.
  href: string;
  // What the tile shows: the address or the number as it was typed.
  label: string;
}

const EMAIL = /^[^\s@:/?#]+@[^\s@:/?#]+\.[^\s@:/?#]+$/;
const TEL = /^tel:(\+?[\d\s().-]{3,30})$/i;
const MAIL = /^(?:mailto:)?([^\s?]+)(\?\S*)?$/i;

export function contactLink(text: string): ContactLink | null {
  const value = text.trim();
  if (!value) return null;

  const tel = value.match(TEL);
  if (tel) {
    const number = tel[1].trim();
    const dialable = number.replace(/[^\d+]/g, '');
    if (dialable.replace(/\D/g, '').length < 3) return null;
    return { kind: 'tel', href: `tel:${dialable}`, label: number };
  }

  const mail = value.match(MAIL);
  if (mail && EMAIL.test(mail[1])) {
    return {
      kind: 'mailto',
      href: `mailto:${mail[1]}${mail[2] ?? ''}`,
      label: mail[1],
    };
  }
  return null;
}
