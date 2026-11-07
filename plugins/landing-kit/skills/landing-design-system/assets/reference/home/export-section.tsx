import { useTranslations } from "next-intl";
import { Container, Section } from "@/components/shared/section";
import { DESTINATIONS, DOTS, HUB, MAP_HEIGHT, MAP_WIDTH } from "../world-dots";
import {
  ISO2,
  LABELS,
  MARKETS,
  REGION_COLOR,
  REGION_KEYS,
  type ExportCountry,
} from "../export-markets";
import { ExportInteractive } from "./export-interactive";

/*
 * Xuất khẩu (2026-11-06), trang chủ, giữa carousel Vật liệu và Nhà máy (nền xanh xen giữa 2 khối trắng).
 * Tiêu đề trên, bản đồ thế giới dạng chấm rộng bên dưới (không có cột danh sách bên cạnh):
 *   - lục địa chấm trắng mờ, nước thị trường tô màu nhấn (REGION_COLOR, chỉ để phong phú màu);
 *   - đường cung NÉT LIỀN từ BFC (Đồng Nai) tới từng nước, tự vẽ khi cuộn tới; hiệu ứng tỏa ra là dải
 *     VÀNG SÁNG (PULSE_COLOR) phủ liền dọc chính đường cung rồi mờ, lặp lại. Đường cung chung màu gold cho mọi nước;
 *   - mỗi nước MỘT BADGE RIÊNG (cờ + tên), que mảnh nối từ chấm nước tới badge (LABELS trong export-markets);
 *     dưới lg bản đồ quá nhỏ cho 15 badge nên badge chuyển thành hàng chip dưới bản đồ;
 *   - điểm gốc BFC: chấm đỏ có sóng lan + nhãn trắng cờ Việt Nam.
 * Rê chuột / focus một badge thì nước đó + đường cung của nó sáng, phần khác mờ
 * (luật CSS sinh theo danh sách nước ở thẻ <style> trong SVG, phần chung ở globals.css khối .export-map).
 * Bản đồ render ở server (chuỗi DOTS không vào bundle client), phần tương tác ở ExportInteractive.
 * Số liệu theo người dùng cung cấp 2026-11-06: 20+ quốc gia, 100+ container/tháng, từ 2010.
 */

/** Màu dải tỏa ra trên đường cung: vàng chanh sáng, tươi hơn gold của đường nền (chỉ dùng ở đây) */
const PULSE_COLOR = "#fff04d";

const CODES = REGION_KEYS.flatMap((r) => MARKETS[r]);
const colorOf = (code: string) =>
  REGION_COLOR[REGION_KEYS.find((r) => MARKETS[r].includes(code)) ?? "europe"];

/** Gom chấm thành 1 path mỗi nhóm ("M x y h0" + stroke-linecap round = chấm tròn), nhẹ hơn hàng nghìn <circle> */
function buildDotPaths() {
  const base: string[] = [];
  const byCountry: Record<string, string[]> = {};
  for (const item of DOTS.split(";")) {
    const [x, y, code] = item.split(",");
    const seg = `M${x} ${y}h0`;
    if (code && CODES.includes(code)) (byCountry[code] ??= []).push(seg);
    else base.push(seg);
  }
  return { base: base.join(""), byCountry };
}

/** Đường cung từ HUB tới điểm đến: cong lên trên, độ cong theo khoảng cách */
function arcPath([x2, y2]: [number, number]) {
  const [x1, y1] = HUB;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dist = Math.hypot(x2 - x1, y2 - y1);
  return `M${x1} ${y1}Q${mx.toFixed(2)} ${(my - dist * 0.32).toFixed(2)} ${x2} ${y2}`;
}

const pct = ([x, y]: [number, number]): [number, number] => [
  (x / MAP_WIDTH) * 100,
  (y / MAP_HEIGHT) * 100,
];

/** Rê chuột một nước: nước đó sáng (các nước khác mờ theo globals.css) */
const ACTIVE_CSS =
  CODES.map(
    (c) => `.export-map[data-active="${c}"] [data-country="${c}"]`,
  ).join(",") + "{opacity:1}";

export function ExportSection() {
  const t = useTranslations("HomePage.export");
  const tc = useTranslations("HomePage.export.countries");
  const { base, byCountry } = buildDotPaths();

  const countries: ExportCountry[] = CODES.map((code) => ({
    code,
    iso2: ISO2[code],
    name: tc(code),
    color: colorOf(code),
    label: pct(LABELS[code].at),
    side: LABELS[code].side,
  }));

  const stats = t.raw("stats") as { value: string; label: string }[];

  const map = (
    <svg
      viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
      role="img"
      aria-label={t("mapAria")}
      className="h-auto w-full overflow-visible"
    >
      <style>{ACTIVE_CSS}</style>
      {/* Lục địa: chấm trắng mờ */}
      <path
        d={base}
        stroke="white"
        strokeOpacity={0.2}
        strokeWidth={0.62}
        strokeLinecap="round"
      />
      {CODES.map((code, i) => {
        const color = colorOf(code);
        const dest = DESTINATIONS[code];
        const at = LABELS[code].at;
        return (
          <g key={code} data-country={code} className="export-region">
            {byCountry[code] && (
              <path
                d={byCountry[code].join("")}
                stroke={color}
                strokeWidth={0.7}
                strokeLinecap="round"
              />
            )}
            {/* Đường cung nét liền màu gold chung cho mọi nước, tự vẽ khi cuộn tới (globals.css .export-arc) */}
            <path
              d={arcPath(dest)}
              fill="none"
              stroke="var(--color-gold)"
              strokeOpacity={0.7}
              strokeWidth={0.28}
              strokeLinecap="round"
              pathLength={1}
              className="export-arc"
              style={{ transitionDelay: `${0.3 + i * 0.08}s` }}
            />
            {/* Dải tỏa ra: vàng sáng tươi hơn gold nền, phủ liền dọc chính đường cung (cùng path, cùng độ dày) */}
            <path
              d={arcPath(dest)}
              fill="none"
              stroke={PULSE_COLOR}
              strokeWidth={0.28}
              strokeLinecap="round"
              pathLength={1}
              className="export-pulse"
              style={{
                animationDelay: `${1.6 + (i % 5) * 0.5}s`,
                filter: `drop-shadow(0 0 0.7px ${PULSE_COLOR})`,
              }}
            />
            {/* Que nối chấm nước → badge (chỉ lg+, nơi badge nằm trên bản đồ) */}
            <line
              x1={dest[0]}
              y1={dest[1]}
              x2={at[0]}
              y2={at[1]}
              stroke="white"
              strokeOpacity={0.55}
              strokeWidth={0.12}
              className="hidden lg:inline"
            />
            <circle
              cx={dest[0]}
              cy={dest[1]}
              r={0.9}
              fill={color}
              className="export-ping"
              style={{ animationDelay: `${(i % 5) * 0.4}s` }}
            />
            <circle
              cx={dest[0]}
              cy={dest[1]}
              r={0.75}
              fill={color}
              stroke="white"
              strokeWidth={0.2}
            />
          </g>
        );
      })}
      {/* Điểm gốc: nhà máy BFC, Đồng Nai, 3 vòng sóng lan ra liên tục */}
      {[0, 0.8, 1.6].map((d) => (
        <circle
          key={d}
          cx={HUB[0]}
          cy={HUB[1]}
          r={1.8}
          fill="none"
          stroke="white"
          strokeOpacity={0.7}
          strokeWidth={0.25}
          className="export-ping"
          style={{ animationDelay: `${d}s` }}
        />
      ))}
      <circle
        cx={HUB[0]}
        cy={HUB[1]}
        r={1.3}
        fill="#da251d"
        stroke="white"
        strokeWidth={0.45}
      />
    </svg>
  );

  return (
    <Section
      id="export"
      tone="brand"
      className="relative isolate overflow-hidden"
    >
      {/* Nền giống timeline About: gradient chéo ngả gold + vầng sáng gold */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute inset-0 bg-[linear-gradient(120deg,var(--color-forest)_55%,color-mix(in_oklab,var(--color-forest)_82%,var(--color-gold))_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(50%_60%_at_80%_10%,color-mix(in_oklab,var(--color-gold)_26%,transparent),transparent_70%)]" />
      </div>
      <Container>
        <ExportInteractive
          eyebrow={t("kicker")}
          title={t("title")}
          countries={countries}
          hubLabel={t("hubLabel")}
          hubPos={pct(HUB)}
          map={map}
        />

        <dl className="mt-16 grid gap-y-10 border-t border-white/20 pt-10 sm:grid-cols-3 lg:mt-20">
          {stats.map((s) => (
            <div
              key={s.label}
              className="sm:border-l sm:border-white/20 sm:pl-8 sm:first:border-l-0 sm:first:pl-0"
            >
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <span className="text-gold block text-[clamp(3rem,5vw,4.5rem)] leading-none font-bold tracking-[-0.02em] tabular-nums [text-shadow:0_8px_24px_rgb(0_0_0/0.28)]">
                  {s.value}
                </span>
                <span className="mt-3 block text-sm font-semibold tracking-[.14em] text-white/85 uppercase">
                  {s.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </Section>
  );
}
