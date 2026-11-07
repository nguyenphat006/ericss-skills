import { useLocale, useTranslations } from "next-intl";
import { ImagePlaceholder } from "@/components/shared/image-placeholder";
import {
  Container,
  Section,
  SectionHeading,
} from "@/components/shared/section";
import { catalogHref, categoryCover, type CategorySlug } from "@/data/catalog";
import { Link } from "@/i18n/navigation";
import type { MaterialCard } from "../data";

/*
 * Nội dung trang chi tiết vật liệu (2026-11-05), bám bố cục trang vật liệu của Gloster:
 *   1. Đặc tính: chữ | ảnh cận dọc 2:3 | ảnh ứng dụng ngang 4:3 (ba cột từ lg)
 *   2. Gia công tại BFC: ảnh xưởng lớn 3:2 bên trái, chữ bên phải
 *   3. Bảo quản (nền stone): tiêu đề lớn bên trái, các đoạn chữ cỡ lớn bên phải
 *   4. Sản phẩm dùng vật liệu: lưới ô vuông các nhóm sản phẩm có vật liệu này (suy từ catalog);
 *      ẩn nếu chưa có nhóm nào
 * Đầu trang (PageHeader) và footer dùng component chung ở page.tsx.
 */

const textCol = "text-ink-soft space-y-5 leading-relaxed";

export function MaterialDetail({
  card,
  categories,
}: {
  card: MaterialCard;
  /** Nhóm có sản phẩm dùng vật liệu này (trang lấy từ catalog) */
  categories: CategorySlug[];
}) {
  const t = useTranslations("MaterialDetail");
  const tn = useTranslations("MaterialsPage.items");
  const tc = useTranslations("Common");
  const locale = useLocale();
  const { slug } = card;
  const name = tn(`${slug}.name`);
  const paras = (key: "properties" | "craft" | "care") =>
    t.raw(`items.${slug}.${key}`) as string[];

  return (
    <>
      {/* 1. Đặc tính */}
      <Section id="properties" className="pt-0 lg:pt-0">
        <Container>
          <div className="grid gap-8 lg:grid-cols-3 lg:gap-8">
            <div className="lg:pt-10">
              <SectionHeading
                eyebrow={name}
                title={t("properties")}
                className="mb-0 lg:mb-0"
              />
              <div className={`${textCol} mt-6`}>
                {paras("properties").map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 items-start gap-4 sm:gap-6 lg:col-span-2 lg:gap-8">
              <div className="bg-surface-stone relative aspect-[2/3] overflow-hidden">
                <ImagePlaceholder
                  label={card.img}
                  sizes="(min-width: 1024px) 30vw, 50vw"
                />
              </div>
              <div className="bg-surface-stone relative aspect-[4/3] overflow-hidden">
                <ImagePlaceholder
                  label={card.use}
                  sizes="(min-width: 1024px) 30vw, 50vw"
                />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 2. Gia công tại BFC */}
      <Section id="craft" className="pt-0 lg:pt-0">
        <Container>
          <div className="grid items-center gap-8 lg:grid-cols-3 lg:gap-8">
            <div className="bg-surface-stone relative aspect-[3/2] overflow-hidden lg:col-span-2">
              <ImagePlaceholder
                label={card.craft}
                sizes="(min-width: 1024px) 64vw, 100vw"
              />
            </div>
            <div>
              <SectionHeading
                eyebrow={t("craftKicker")}
                title={t("craft")}
                className="mb-0 lg:mb-0"
              />
              <div className={`${textCol} mt-6`}>
                {paras("craft").map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 3. Bảo quản */}
      <Section id="care" tone="stone">
        <Container>
          <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-8">
            <SectionHeading
              eyebrow={t("careKicker")}
              title={t("care")}
              className="mb-0 lg:mb-0"
            />
            <div className="text-ink space-y-6 text-lg leading-relaxed lg:text-xl">
              {paras("care").map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* 4. Sản phẩm dùng vật liệu */}
      {categories.length > 0 ? (
        <Section id="products">
          <Container>
            <SectionHeading
              eyebrow={t("productsKicker")}
              title={t("products", {
                name: locale === "vi" ? name.toLocaleLowerCase("vi") : name,
              })}
            />
            <ul className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
              {categories.map((c) => (
                <li key={c}>
                  <Link
                    href={catalogHref.category(c)}
                    className="group/cat block hover:no-underline"
                  >
                    <div className="bg-surface-stone relative aspect-square overflow-hidden">
                      <ImagePlaceholder
                        label={categoryCover(c)}
                        sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                        className="ease-out-soft transition-transform duration-(--duration-slow) group-hover/cat:scale-[1.04]"
                      />
                    </div>
                    <p className="text-ink mt-3 text-sm font-medium tracking-[.06em] uppercase">
                      {tc(`products.${c}`)}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}
    </>
  );
}
