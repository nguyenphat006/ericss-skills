import "server-only";
/*
 * Client gọi API CMS (Django + Wagtail, backend/). CHỈ dùng phía server: địa chỉ CMS nằm trong
 * biến môi trường không có tiền tố NEXT_PUBLIC_, trình duyệt không gọi thẳng CMS.
 *
 * Cache: mọi request gắn tag CMS_TAG và tự làm mới sau REVALIDATE_SECONDS. Khi quản trị viên xuất bản
 * trong admin, CMS gọi webhook /api/revalidate để đánh dấu tag cũ ngay (xem app/api/revalidate).
 */

/** Tag cache chung cho mọi dữ liệu CMS: xuất bản bất kỳ nội dung nào thì làm mới toàn bộ */
export const CMS_TAG = "cms";

/** Lưới an toàn khi webhook lỗi: dữ liệu cũ tối đa 1 giờ */
const REVALIDATE_SECONDS = 3600;
// Lần đầu CMS có thể phải tạo ảnh WebP (rendition) nên cho chờ lâu hơn bình thường
const TIMEOUT_MS = 30_000;

export class CmsError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "CmsError";
  }
}

/** Địa chỉ API CMS (vd http://127.0.0.1:9000/api/v1). Chưa đặt = dùng dữ liệu mock */
export function cmsApiUrl(): string | null {
  const url = process.env.CMS_API_URL?.trim();
  return url ? url.replace(/\/+$/, "") : null;
}

export function cmsEnabled(): boolean {
  return cmsApiUrl() !== null;
}

type Query = Record<string, string | number | string[] | undefined>;

function buildUrl(base: string, path: string, query: Query): string {
  const url = new URL(`${base}/${path.replace(/^\/+/, "")}`);
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined) continue;
    for (const v of Array.isArray(value) ? value : [value]) {
      url.searchParams.append(key, String(v));
    }
  }
  return url.toString();
}

/**
 * GET một endpoint CMS, trả JSON. 404 trả null (để trang gọi notFound()); lỗi khác ném CmsError.
 */
export async function cmsGet<T>(
  path: string,
  query: Query = {},
): Promise<T | null> {
  const base = cmsApiUrl();
  if (!base) throw new CmsError("CMS_API_URL chưa được đặt");

  const url = buildUrl(base, path, query);
  let res: Response;
  try {
    res = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { tags: [CMS_TAG], revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (err) {
    throw new CmsError(`Không gọi được CMS (${url}): ${String(err)}`);
  }
  if (res.status === 404) return null;
  if (!res.ok)
    throw new CmsError(`CMS trả lỗi ${res.status} (${url})`, res.status);
  return (await res.json()) as T;
}

type Page<T> = { count: number; total_pages: number; results: T[] };

/** Lấy hết các trang của một danh sách có phân trang (page_size tối đa 100) */
export async function cmsGetAll<T>(
  path: string,
  query: Query = {},
): Promise<T[]> {
  const items: T[] = [];
  for (let page = 1; ; page++) {
    const data = await cmsGet<Page<T>>(path, {
      ...query,
      page,
      page_size: 100,
    });
    if (!data) break;
    items.push(...data.results);
    if (page >= data.total_pages) break;
  }
  return items;
}
