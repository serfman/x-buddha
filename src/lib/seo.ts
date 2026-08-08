const LOCAL_SITE_URL = "http://localhost:3000";

export const SITE_NAME = "X-Buddha";
export const HOME_TITLE = "Оценка и атрибуция буддийских статуэток — X-Buddha";
export const HOME_DESCRIPTION =
  "Оценка и атрибуция буддийских статуэток и артефактов онлайн по фотографиям: экспертиза предмета, определение происхождения и помощь с выкупом.";
export const DEFAULT_OG_IMAGE = {
  url: "/og.png",
  width: 1733,
  height: 907,
  alt: "X-Buddha — оценка буддийских статуэток",
} as const;

export function getSiteUrl(): URL {
  const configuredUrl = process.env.SITE_URL?.trim() || LOCAL_SITE_URL;
  const url = new URL(configuredUrl);

  if (!/^https?:$/.test(url.protocol)) {
    throw new Error("SITE_URL must use the http or https protocol.");
  }

  url.pathname = "/";
  url.search = "";
  url.hash = "";
  return url;
}

export function getCanonicalUrl(pathname = "/"): string {
  return new URL(pathname.replace(/^\//, ""), getSiteUrl()).toString();
}
