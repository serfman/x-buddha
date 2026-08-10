const DEFAULT_REVALIDATE_SECONDS = 300;

type DirectusResponse<T> = { data: T };

export class DirectusRequestError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message);
    this.name = "DirectusRequestError";
  }
}

export function getDirectusUrl(): URL {
  const value = process.env.DIRECTUS_URL;
  if (!value) throw new DirectusRequestError("DIRECTUS_URL is not configured.");

  try {
    return new URL(value.endsWith("/") ? value : `${value}/`);
  } catch {
    throw new DirectusRequestError("DIRECTUS_URL must be an absolute URL.");
  }
}

function getDirectusApiUrl(): URL {
  const value = process.env.DIRECTUS_INTERNAL_URL?.trim();
  if (!value) return getDirectusUrl();

  try {
    return new URL(value.endsWith("/") ? value : `${value}/`);
  } catch {
    throw new DirectusRequestError("DIRECTUS_INTERNAL_URL must be an absolute URL.");
  }
}

export async function directusFetch<T>(path: string, searchParams?: URLSearchParams): Promise<T> {
  const url = new URL(path.replace(/^\//, ""), getDirectusApiUrl());
  if (searchParams) url.search = searchParams.toString();

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: DEFAULT_REVALIDATE_SECONDS, tags: ["directus-articles"] },
  });

  if (!response.ok) {
    throw new DirectusRequestError(`Directus request failed with status ${response.status}.`, response.status);
  }

  const payload = (await response.json()) as DirectusResponse<T>;
  return payload.data;
}
