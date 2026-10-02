// The social accounts bento asks for right after sign-up, in its order, and
// the profile address each username makes.
export const SOCIALS = [
  {
    id: 'twitter',
    name: 'Twitter',
    url: (h: string) => `https://twitter.com/${h}`,
  },
  {
    id: 'instagram',
    name: 'Instagram',
    url: (h: string) => `https://instagram.com/${h}`,
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    url: (h: string) => `https://www.linkedin.com/in/${h}`,
  },
  {
    id: 'github',
    name: 'GitHub',
    url: (h: string) => `https://github.com/${h}`,
  },
  {
    id: 'youtube',
    name: 'YouTube',
    url: (h: string) => `https://youtube.com/@${h}`,
  },
  {
    id: 'dribbble',
    name: 'Dribbble',
    url: (h: string) => `https://dribbble.com/${h}`,
  },
  { id: 'figma', name: 'Figma', url: (h: string) => `https://figma.com/@${h}` },
  {
    id: 'medium',
    name: 'Medium',
    url: (h: string) => `https://medium.com/@${h}`,
  },
  {
    id: 'behance',
    name: 'Behance',
    url: (h: string) => `https://behance.net/${h}`,
  },
] as const;

// "@jane", "jane" or a pasted profile address all become "jane".
export function cleanHandle(input: string) {
  const last =
    input
      .trim()
      .replace(/[?#].*$/, '')
      .split('/')
      .filter(Boolean)
      .pop() ?? '';
  return last.replace(/^@/, '').replace(/[^A-Za-z0-9._-]/g, '');
}
