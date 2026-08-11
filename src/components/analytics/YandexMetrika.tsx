"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { getYandexMetrikaId } from "@/lib/analytics";

export function YandexMetrika() {
  const pathname = usePathname();
  const counterId = getYandexMetrikaId();
  const [ready, setReady] = useState(false);
  const trackedPathname = useRef(pathname);

  useEffect(() => {
    if (!counterId || !ready || !window.ym) return;
    if (trackedPathname.current === pathname) return;

    trackedPathname.current = pathname;
    window.ym(counterId, "hit", window.location.href, { title: document.title });
  }, [counterId, pathname, ready]);

  if (!counterId) return null;

  const initialization = `
    (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
    m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
    (window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");
    ym(${counterId},"init",{defer:true,clickmap:true,trackLinks:true,accurateTrackBounce:true});
  `;

  return (
    <>
      <Script id="yandex-metrika" strategy="afterInteractive" onReady={() => setReady(true)}>
        {initialization}
      </Script>
    </>
  );
}
