export const PRIVATE_ROUTES = ['preview', 'api'];

// Handles nobody can claim: the app's own pages, plus names kept back on
// purpose. Visiting one shows bento's red "Unavailable" claim page. To keep
// another name unavailable, add it here (lowercase).
export const RESERVED_USERNAMES = [
  'login',
  'signup',
  'explore',
  'jointheteam',
  'changelog',
  'reset-password',
  'set-password',
  'privacy-policy',
  'terms-of-service',
  'auth',
  'home',
  'admin',
  'settings',
  'help',
  'support',
  'about',
  'blog',
  'pricing',
  'status',
  'bento',
  'portfoliofy',
  'sitemap.xml',
  'robots.txt',
  'manifest.webmanifest',
  'favicon.ico',
  'i',
  'og',
];

// Same rule as the sign-up form: 3+ characters, letters, numbers, - and _.
export const isValidUsername = (username: string) =>
  /^[a-zA-Z0-9_-]{3,}$/.test(username);

export const isReservedUsername = (username: string) =>
  RESERVED_USERNAMES.includes(username.toLowerCase());
