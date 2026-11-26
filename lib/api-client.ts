// The browser's way of calling this app's own API: JSON in, JSON out, and a
// failed answer becomes an Error carrying the server's message.

export class ApiRequestError extends Error {
  constructor(
    readonly status: number,
    message: string
  ) {
    super(message);
  }
}

export async function apiFetch<T = unknown>(
  path: string,
  init?: Omit<RequestInit, 'body'> & { json?: unknown },
  fallback = 'Request failed'
): Promise<T> {
  const { json, headers, ...rest } = init ?? {};
  const response = await fetch(path, {
    ...rest,
    headers:
      json === undefined
        ? headers
        : { 'Content-Type': 'application/json', ...headers },
    body: json === undefined ? undefined : JSON.stringify(json),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new ApiRequestError(response.status, body?.error || fallback);
  }
  return response.json() as Promise<T>;
}
