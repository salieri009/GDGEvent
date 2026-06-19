export class ApiError extends Error {
  constructor(
    public status: number,
    public body: string,
  ) {
    super(body || `Request failed: ${status}`);
    this.name = 'ApiError';
  }
}

/** Parse `{ "error": "..." }` from failed API responses for user-facing copy. */
export function apiErrorMessage(err: unknown, fallback = 'Request failed'): string {
  if (err instanceof ApiError) {
    try {
      const parsed = JSON.parse(err.body) as { error?: string };
      if (parsed.error) return parsed.error;
    } catch {
      // non-JSON body
    }
    return err.body || err.message || fallback;
  }
  return err instanceof Error ? err.message : fallback;
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '';

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new ApiError(res.status, text);
  }
  return (await res.json()) as T;
}
