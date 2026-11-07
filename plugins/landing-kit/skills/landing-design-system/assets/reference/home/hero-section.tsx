"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { ButtonLink } from "@/components/shared/button-link";
import { Container } from "@/components/shared/section";
import { cn } from "@/lib/utils";

/** Ảnh hero — chọn các khung cảnh đa dạng: bãi container, hoàn thiện gỗ, hàn nhôm, showroom */
const SLIDES = [
  "/Assets/Landing.jpg",
  "/Assets/Slideshow_1_3.jpg",
  "/Assets/Slideshow_1_6.jpg",
  "/Assets/Slideshow_1_8.jpg",
];

const SLIDE_MS = 6500;

export function HeroSection() {
  const t = useTranslations("HomePage.hero");
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);

  // Tự chuyển slide; đổi slide thủ công sẽ reset đồng hồ. Reduced-motion → đứng yên slide đầu
  useEffect(() => {
    if (reduce) return;
    const id = setTimeout(
      () => setIndex((i) => (i + 1) % SLIDES.length),
      SLIDE_MS,
    );
    return () => clearTimeout(id);
  }, [index, reduce]);

  return (
    <section
      id="top"
      data-hero
      className="relative flex min-h-[100svh] items-end overflow-hidden"
    >
      {/* Các slide xếp chồng: crossfade + Ken Burns drift trên slide đang hiện */}
      {SLIDES.map((src, i) => {
        const active = i === index;
        return (
          <motion.div
            key={src}
            aria-hidden={!active}
            initial={false}
            animate={
              reduce
                ? { opacity: active ? 1 : 0 }
                : { opacity: active ? 1 : 0, scale: active ? 1.08 : 1 }
            }
            transition={{
              opacity: { duration: 1.2, ease: [0.4, 0, 0.2, 1] },
              scale: { duration: SLIDE_MS / 1000 + 1.2, ease: "linear" },
            }}
            className="absolute inset-0"
          >
            <Image
              src={src}
              alt=""
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>
        );
      })}

      {/* Scrim kiểu Gloster: tối dần từ đáy lên cho chữ (header giờ nền trắng nên bỏ dải tối trên đỉnh) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 bottom-0 h-[70%] bg-linear-to-t from-black/60 via-black/25 to-transparent" />
      </div>

      {/*
        Chữ hero theo bố cục Gloster: dồn trái-dưới, cùng một trục trái với header và mọi section (Container wide, lề = gutter).
        Tiêu đề h1 in hoa, semibold như tiêu đề section, một đoạn mô tả, CTA nút khung viền chung (ButtonLink, đồng nhất 2026-11-05; LineLink giữ trong code).
        Kicker "Nhà sản xuất nội thất ngoài trời" tạm không hiện để giữ bố cục 3 tầng của Gloster (key vẫn giữ trong messages).
      */}
      <Container className="relative pb-28 xl:pb-24">
        <h1 className="text-h1 mb-5 font-semibold tracking-[-0.015em] text-balance text-white uppercase">
          {/* Ngắt dòng cố định sau dấu phẩy ở sm+, mobile tự xuống dòng */}
          {t.rich("title", { br: () => <br className="max-sm:hidden" /> })}
        </h1>
        {/* Mô tả ngắn (2026-11-04): nói cách BFC làm việc với khách (OEM/ODM, mẫu thử → container),
            không lặp số liệu nhà máy đã có ở đoạn giới thiệu bên dưới */}
        <p className="text-lede mb-8 max-w-[64ch] text-white/85">{t("lede")}</p>
        <ButtonLink href="/contact" tone="light">
          {t("ctaQuote")}
        </ButtonLink>
      </Container>

      {/* Nút cuộn xuống section kế tiếp */}
      <a
        href="#intro"
        aria-label={t("scrollNext")}
        className="group absolute bottom-8 left-1/2 z-10 flex h-14 w-14 -translate-x-1/2 items-center justify-center text-white hover:no-underline"
      >
        {/* Viền nét đứt xoay chậm quanh mũi tên */}
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full border border-dashed border-white/60 transition-colors group-hover:border-white motion-safe:animate-[spin_14s_linear_infinite]"
        />
        <ChevronDown
          aria-hidden="true"
          strokeWidth={1.5}
          className="motion-safe:animate-bfc-nudge size-5"
        />
      </a>

      {/* Chỉ báo slide: vạch mảnh + tiến độ gold, bấm để nhảy slide */}
      {/* Lớp bọc full-width không nhận click, để không đè lên nút cuộn ở giữa */}
      <div className="pointer-events-none absolute inset-x-0 bottom-8">
        <Container className="flex items-center justify-end gap-4 *:pointer-events-auto">
          <span className="text-xs font-medium tracking-[.16em] text-white/70 tabular-nums">
            0{index + 1}
          </span>
          <div className="flex items-center gap-2">
            {SLIDES.map((src, i) => (
              <button
                key={src}
                type="button"
                aria-label={`Slide ${i + 1}`}
                aria-current={i === index}
                onClick={() => setIndex(i)}
                className="group flex h-11 w-10 cursor-pointer items-center"
              >
                <span
                  className={cn(
                    "relative h-[2px] w-full overflow-hidden transition-colors",
                    i === index
                      ? "bg-white/30"
                      : "bg-white/25 group-hover:bg-white/50",
                  )}
                >
                  {i === index && !reduce ? (
                    <motion.span
                      key={`progress-${index}`}
                      className="bg-gold absolute inset-y-0 left-0"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: SLIDE_MS / 1000, ease: "linear" }}
                    />
                  ) : null}
                  {i === index && reduce ? (
                    <span className="bg-gold absolute inset-0" />
                  ) : null}
                </span>
              </button>
            ))}
          </div>
        </Container>
      </div>
    </section>
  );
}
