import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';

// Fetches a page's Open Graph title, description and image for link tiles.
// Public addresses only (every redirect is checked too), small and quick.

const MAX_BYTES = 512 * 1024;
const MAX_REDIRECTS = 3;

function isPrivateAddress(ip: string) {
  if (isIP(ip) === 6) {
    const v6 = ip.toLowerCase();
    if (v6.startsWith('::ffff:')) return isPrivateAddress(v6.slice(7));
    return (
      v6 === '::1' ||
      v6 === '::' ||
      v6.startsWith('fc') ||
      v6.startsWith('fd') ||
      v6.startsWith('fe80')
    );
  }
  const [a, b] = ip.split('.').map(Number);
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    a >= 224
  );
}

async function isPublicUrl(url: URL) {
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return false;
  if (url.hostname === 'localhost' || url.hostname.endsWith('.local')) {
    return false;
  }
  try {
    const addresses = await lookup(url.hostname, { all: true });
    return addresses.every(({ address }) => !isPrivateAddress(address));
  } catch {
    return false;
  }
}

async function readHead(response: Response) {
  const reader = response.body?.getReader();
  if (!reader) return '';
  const decoder = new TextDecoder();
  let html = '';
  let bytes = 0;
  while (bytes < MAX_BYTES) {
    const { done, value } = await reader.read();
    if (done) break;
    bytes += value.length;
    html += decoder.decode(value, { stream: true });
    if (html.includes('</head>')) break;
  }
  reader.cancel().catch(() => {});
  return html;
}

function decode(text: string) {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}

function meta(html: string, ...names: string[]) {
  for (const name of names) {
    const tag = html.match(
      new RegExp(`<meta[^>]+(?:property|name)=["']${name}["'][^>]*>`, 'i')
    )?.[0];
    const content = tag?.match(/content=["']([^"']*)["']/i)?.[1];
    if (content) return decode(content);
  }
  return undefined;
}

interface LinkPreviewResult {
  title?: string;
  description?: string;
  image?: string;
}

// Returns null when the address isn't a public web page.
export async function getLinkPreview(
  raw: string
): Promise<LinkPreviewResult | null> {
  let url: URL;
  try {
    url = new URL(raw.startsWith('http') ? raw : `https://${raw}`);
  } catch {
    return null;
  }

  try {
    let response: Response | undefined;
    for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
      if (!(await isPublicUrl(url))) return null;
      response = await fetch(url, {
        redirect: 'manual',
        signal: AbortSignal.timeout(5000),
        headers: {
          'user-agent':
            'Mozilla/5.0 (compatible; PortfoliofyBot/1.0; +https://portfoliofy.me)',
          accept: 'text/html',
        },
      });
      const location = response.headers.get('location');
      if (response.status >= 300 && response.status < 400 && location) {
        url = new URL(location, url);
        continue;
      }
      break;
    }
    if (
      !response?.ok ||
      !response.headers.get('content-type')?.includes('text/html')
    ) {
      return {};
    }

    const html = await readHead(response);
    const pageTitle = html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1];
    const title =
      meta(html, 'og:title', 'twitter:title') ??
      (pageTitle ? decode(pageTitle) : undefined);
    const description = meta(
      html,
      'og:description',
      'twitter:description',
      'description'
    );
    const imagePath = meta(html, 'og:image', 'og:image:url', 'twitter:image');
    let image: string | undefined;
    if (imagePath) {
      try {
        const resolved = new URL(imagePath, url);
        if (resolved.protocol === 'https:' || resolved.protocol === 'http:') {
          image = resolved.toString();
        }
      } catch {}
    }
    return { title, description, image };
  } catch {
    return {};
  }
}
