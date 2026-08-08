import type { NextConfig } from "next";

function getDirectusImagePattern(): NonNullable<NextConfig["images"]>["remotePatterns"] {
  const directusUrl = process.env.DIRECTUS_URL;

  if (!directusUrl) return [];

  try {
    const url = new URL(directusUrl);

    return [
      {
        protocol: url.protocol.replace(":", "") as "http" | "https",
        hostname: url.hostname,
        port: url.port,
        pathname: "/assets/**",
      },
    ];
  } catch {
    throw new Error("DIRECTUS_URL must be an absolute http(s) URL.");
  }
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  images: {
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== "production",
    remotePatterns: getDirectusImagePattern(),
  },
};

export default nextConfig;
