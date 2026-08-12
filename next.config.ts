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
  output: "standalone",
  poweredByHeader: false,
  reactStrictMode: true,
  trailingSlash: true,
  images: {
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== "production",
    deviceSizes: [384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    remotePatterns: getDirectusImagePattern(),
  },
};

export default nextConfig;
