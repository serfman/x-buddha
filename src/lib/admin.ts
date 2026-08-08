export function getAdminUrl(): string | undefined {
  const configuredUrl = process.env.NEXT_PUBLIC_ADMIN_URL?.trim();

  if (!configuredUrl) return undefined;

  try {
    const url = new URL(configuredUrl);
    if (url.protocol !== "http:" && url.protocol !== "https:") return undefined;
  } catch {
    return undefined;
  }

  return configuredUrl;
}
