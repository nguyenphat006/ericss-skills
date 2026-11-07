import { useTranslations } from "next-intl";
import { ButtonLink } from "@/components/shared/button-link";
import { ImagePlaceholder } from "@/components/shared/image-placeholder";
import {
  Container,
  Section,
  SectionHeading,
} from "@/components/shared/section";
import { navHref } from "@/config/navigation";

/*
 * CTA cuối trang chủ (2026-11-06), ngay trên footer.
 * Dải nền forest (tone brand) có ảnh xưởng chìm phía sau (phủ forest đậm để chữ đọc rõ).
 * Tiêu đề theo pattern chung (subtitle có vạch + title in hoa), 2 nút khung viền bản sáng bên phải:
 * "Yêu cầu báo giá" và "Đặt lịch thăm nhà máy", mở thẳng form liên hệ đã chọn sẵn mục đích.
 */
export function CtaSection() {
  const t = useTranslations("HomePage.cta");

  return (
    <Section id="cta" tone="brand" className="relative isolate overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <ImagePlaceholder
          label="Slideshow_1_2.png"
          sizes="100vw"
          className="opacity-25 grayscale"
        />
        <div className="bg-forest/80 absolute inset-0" />
      </div>
      <Container>
        <SectionHeading
          tone="light"
          eyebrow={t("kicker")}
          title={t("title")}
          className="mb-0 lg:mb-0"
          action={
            <>
              <ButtonLink
                tone="light"
                href={{
                  pathname: navHref.contact,
                  query: { purpose: "quote" },
                  hash: "contact-form",
                }}
              >
                {t("quote")}
              </ButtonLink>
              <ButtonLink
                tone="light"
                href={{
                  pathname: navHref.contact,
                  query: { purpose: "visit" },
                  hash: "contact-form",
                }}
              >
                {t("visit")}
              </ButtonLink>
            </>
          }
        />
      </Container>
    </Section>
  );
}
