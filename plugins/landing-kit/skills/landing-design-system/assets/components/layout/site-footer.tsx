import { useTranslations } from "next-intl";
import { navHref, type NavKey } from "@/config/navigation";
import { BrandLogo } from "@/components/shared/brand-logo";
import { CertBadge } from "@/components/shared/cert-badge";
import { Container } from "@/components/shared/section";
import { siteConfig } from "@/config/site";
import { confirmedCertifications } from "@/data/certifications";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type SiteFooterProps = {
  /** Các trang gợi ý ở dải cross-link phía trên footer; [] để ẩn dải này */
  crossKeys?: NavKey[];
};

/*
 * Footer DÙNG CHUNG, giống hệt nhau ở mọi trang (kể cả bản đồ, dù trang Liên hệ đã có bản đồ lớn).
 * Không thêm tuỳ chọn ẩn/bớt khối theo từng trang; chỉ dải cross-link phía trên được đổi đích.
 */
export function SiteFooter({
  crossKeys = ["materials", "products", "contact"],
}: SiteFooterProps) {
  const t = useTranslations("Common");
  const tf = useTranslations("Footer");

  return (
    <div className="bg-ink">
      {crossKeys.length > 0 ? (
        <Container className="grid border-b border-white/15 lg:grid-cols-3">
          {crossKeys.map((key, i) => (
            <Link
              key={key}
              href={navHref[key]}
              className={cn(
                "py-[clamp(3rem,6vw,5rem)] text-white transition-colors hover:bg-white/5 lg:px-7 lg:first:pl-0",
                "max-lg:border-t max-lg:border-white/15 max-lg:first:border-t-0",
                i > 0 && "lg:border-l lg:border-white/15",
              )}
            >
              <p className="text-highlight mb-2.5 text-xs tracking-[.16em] uppercase">
                {t(`nav.${key}`)}
              </p>
              <span className="text-lg leading-[1.4] font-semibold">
                {tf(`cross.${key}`)}
                {"  →"}
              </span>
            </Link>
          ))}
        </Container>
      ) : null}

      <footer className="py-[clamp(4rem,10vw,8rem)] pb-12">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_0.9fr_1.05fr] lg:gap-16">
            <div>
              <BrandLogo tone="light" />
              <p className="mt-5 max-w-[32ch] text-sm leading-[1.6] text-white/70">
                {tf("blurb")}
              </p>
              <p className="mt-3 text-sm leading-[1.6] text-white/70">
                {siteConfig.legalName}
              </p>
            </div>

            <div>
              <div className="text-highlight text-xs tracking-[.14em] uppercase">
                {tf("contactTitle")}
              </div>
              <div className="mt-5 grid gap-5">
                <p className="max-w-[32ch] text-sm leading-[1.7] text-white/85">
                  {tf("address")}
                </p>
                <div className="grid gap-2.5">
                  <a
                    href={siteConfig.phoneHref}
                    className="text-sm text-white/85 hover:text-white hover:underline"
                  >
                    {siteConfig.phone}
                  </a>
                  <a
                    href={siteConfig.emailHref}
                    className="text-sm text-white/85 hover:text-white hover:underline"
                  >
                    {siteConfig.email}
                  </a>
                  <a
                    href={siteConfig.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-white/85 hover:text-white hover:underline"
                  >
                    {tf("mapsLink")} →
                  </a>
                </div>
              </div>
            </div>

            {/* Bản đồ nhà máy — nhúng dạng output=embed, không cần API key */}
            <div className="relative min-h-[260px] overflow-hidden rounded-[2px] border border-white/15">
              <iframe
                src={siteConfig.mapsEmbedUrl}
                title={`${siteConfig.name} - ${tf("mapsLink")}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full border-0 grayscale-[.15]"
              />
            </div>
          </div>

          <div className="mt-24 flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-t border-white/15 pt-8">
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
              <span className="text-xs text-white/50">
                © {new Date().getFullYear()} {siteConfig.name}
              </span>
              {/* Dải chứng nhận nhỏ: chỉ mục đã xác nhận, bấm để xem chi tiết ở trang Năng lực */}
              {confirmedCertifications.length > 0 ? (
                <div className="flex items-center gap-3">
                  <span className="text-[11px] tracking-[.14em] text-white/40 uppercase">
                    {tf("certsLabel")}
                  </span>
                  {confirmedCertifications.map((c) => (
                    <Link
                      key={c.key}
                      href={`${navHref.capabilities}#certifications`}
                      aria-label={tf("certsAria", { name: c.short })}
                      title={c.short}
                      className="opacity-70 transition-opacity hover:opacity-100"
                    >
                      <CertBadge cert={c} />
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-xs text-white/50 hover:text-white">
                {tf("privacy")}
              </a>
              <a href="#" className="text-xs text-white/50 hover:text-white">
                {tf("terms")}
              </a>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
}
