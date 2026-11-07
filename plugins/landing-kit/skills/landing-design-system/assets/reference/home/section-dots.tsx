"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { sectionAnchors } from "../data";

/** Thanh chấm điều hướng cố định bên phải, đánh dấu section đang xem (chỉ desktop) */
export function SectionDots() {
  const t = useTranslations("HomePage.dots");
  const [active, setActive] = useState<string>("top");

  useEffect(() => {
    // Section trở thành active khi đỉnh của nó đi vào dải 20%-25% phía trên viewport
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-20% 0px -75% 0px" },
    );
    for (const anchor of sectionAnchors) {
      const el = document.getElementById(anchor);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label={t("aria")}
      className="fixed top-1/2 right-5 z-50 grid -translate-y-1/2 gap-3.5 max-lg:hidden"
    >
      {sectionAnchors.map((anchor) => (
        <a
          key={anchor}
          href={`#${anchor}`}
          aria-label={t(anchor)}
          className="h-1.5 w-1.5 rounded-full transition-colors duration-240"
          style={{
            background:
              active === anchor ? "var(--color-forest)" : "var(--color-line)",
          }}
        />
      ))}
    </nav>
  );
}
