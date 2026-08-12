"use client";

import type { AnchorHTMLAttributes, MouseEvent } from "react";

export function ScrollLink({ href, onClick, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: `#${string}` }) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;

    const target = document.getElementById(href.slice(1));
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    window.history.replaceState(null, "", href);
  };

  return <a href={href} onClick={handleClick} {...props} />;
}
