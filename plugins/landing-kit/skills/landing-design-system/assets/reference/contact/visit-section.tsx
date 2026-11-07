import { useLocale, useTranslations } from "next-intl";
import { ButtonLink } from "@/components/shared/button-link";
import { Container, Section } from "@/components/shared/section";
import { navHref } from "@/config/navigation";
import { siteConfig } from "@/config/site";

/*
 * Thông tin liên hệ + bản đồ (2026-11-05, bản 3): khối thông tin bên trái, bản đồ bên phải (không đè lên nhau). Khối thông tin chứa
 * kênh liên hệ (điện thoại, email, WhatsApp/Zalo, giờ làm việc, địa chỉ + chỉ đường)
 * và lời mời thăm nhà máy. WhatsApp/Zalo/giờ làm việc lấy từ siteConfig; null thì ẩn.
 * Nút "Đặt lịch" về lại form với mục đích "Thăm nhà máy" chọn sẵn (?purpose=visit#contact-form).
 */

type Channel = { key: string; label: string; value: string; href?: string };

export function VisitSection() {
  const t = useTranslations("ContactPage");
  const tf = useTranslations("Footer");
  const locale = useLocale();

  const channels: Channel[] = [
    {
      key: "phone",
      label: t("channels.phone"),
      value: siteConfig.phone,
      href: siteConfig.phoneHref,
    },
    {
      key: "email",
      label: t("channels.email"),
      value: siteConfig.email,
      href: siteConfig.emailHref,
    },
  ];
  if (siteConfig.whatsappUrl) {
    channels.push({
      key: "whatsapp",
      label: t("channels.whatsapp"),
      value: siteConfig.phone,
      href: siteConfig.whatsappUrl,
    });
  }
  if (siteConfig.zaloUrl) {
    channels.push({
      key: "zalo",
      label: t("channels.zalo"),
      value: siteConfig.phone,
      href: siteConfig.zaloUrl,
    });
  }
  if (siteConfig.hours) {
    channels.push({
      key: "hours",
      label: t("channels.hours"),
      value: locale === "vi" ? siteConfig.hours.vi : siteConfig.hours.en,
    });
  }

  return (
    <Section id="visit" className="pt-0 lg:pt-0">
      <Container>
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="border-line rounded-[2px] border bg-white p-6 sm:p-8 lg:col-span-5 xl:col-span-4">
            <h2 className="text-h3 text-ink font-semibold">
              {t("channels.title")}
            </h2>

            <dl className="mt-5">
              {channels.map((c) => (
                <div
                  key={c.key}
                  className="border-line grid gap-x-4 gap-y-1 border-t py-3 sm:grid-cols-[7rem_minmax(0,1fr)]"
                >
                  <dt className="text-eyebrow text-ink-mute pt-0.5 font-semibold uppercase">
                    {c.label}
                  </dt>
                  <dd className="text-ink font-medium break-words">
                    {c.href ? (
                      <a
                        href={c.href}
                        {...(c.href.startsWith("http")
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                        className="hover:text-forest underline-offset-4 transition-colors hover:underline"
                      >
                        {c.value}
                      </a>
                    ) : (
                      c.value
                    )}
                  </dd>
                </div>
              ))}
              <div className="border-line grid gap-x-4 gap-y-1 border-y py-3 sm:grid-cols-[7rem_minmax(0,1fr)]">
                <dt className="text-eyebrow text-ink-mute pt-0.5 font-semibold uppercase">
                  {t("channels.address")}
                </dt>
                <dd className="text-ink text-sm leading-relaxed">
                  {tf("address")}
                  <a
                    href={siteConfig.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-forest mt-1.5 block font-medium underline-offset-4 hover:underline"
                  >
                    {t("channels.directions")} →
                  </a>
                </dd>
              </div>
            </dl>

            {/* Lời mời thăm nhà máy */}
            <div className="mt-6">
              <p className="text-eyebrow text-forest font-semibold uppercase">
                {t("visit.kicker")}
              </p>
              <p className="text-ink-soft mt-2 text-sm leading-relaxed">
                {t("visit.body")}
              </p>
              <ButtonLink
                href={{
                  pathname: navHref.contact,
                  query: { purpose: "visit" },
                  hash: "contact-form",
                }}
                className="mt-5 max-sm:w-full max-sm:justify-between max-sm:px-5"
              >
                {t("visit.cta")}
              </ButtonLink>
            </div>
          </div>

          {/* Bản đồ nằm một bên, cao bằng khối thông tin */}
          <div className="border-line relative min-h-[320px] overflow-hidden rounded-[2px] border sm:min-h-[420px] lg:col-span-7 xl:col-span-8">
            <iframe
              src={siteConfig.mapsEmbedUrl}
              title={t("visit.mapTitle")}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>
        </div>
      </Container>
    </Section>
  );
}
