import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing, type Locale } from "./routing";

const loaders = {
  vi: () => import("../../messages/vi.json"),
  en: () => import("../../messages/en.json"),
} satisfies Record<Locale, () => Promise<unknown>>;

/*
 * Dev: đọc thẳng file JSON mỗi request. Turbopack dev trên máy này giữ bản en.json cũ
 * (MISSING_MESSAGE dù khoá đã có, lặp lại cả sau khi restart), nên không dựa vào module cache.
 * Production: import tĩnh như bình thường để JSON được bundle cùng app.
 */
async function loadMessages(locale: Locale) {
  if (process.env.NODE_ENV === "development") {
    const { readFile } = await import("node:fs/promises");
    const { join } = await import("node:path");
    const file = join(process.cwd(), "messages", `${locale}.json`);
    return JSON.parse(await readFile(file, "utf8"));
  }
  return (await loaders[locale]()).default;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: await loadMessages(locale),
  };
});
