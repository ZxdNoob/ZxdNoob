/**
 * 文章数据：全部由 Nest 后端 + 数据库提供，前端仅通过 HTTP 获取。
 *
 * 服务端组件中请使用下列 async 方法；`cache: 'no-store'` 避免把旧数据静态缓存进 HTML。
 */
import { getBackendBaseUrl } from "./api";

/** 列表项：无正文，含后端计算的 `readingMinutes` */
export type PostSummary = {
  slug: string;
  title: string;
  /** ISO 8601 日期时间（可含时区），用于展示与 `<time datetime>` */
  date: string;
  description: string;
  tags?: string[];
  draft?: boolean;
  readingMinutes: number;
};

/** 详情：含 Markdown 正文 */
export type Post = PostSummary & {
  content: string;
};

async function fetchJson<T>(path: string): Promise<T | null> {
  const base = getBackendBaseUrl();
  try {
    const res = await fetch(`${base}${path}`, { cache: "no-store" });
    if (res.status === 404) return null;
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/** 已发布文章摘要列表（用于首页、文章索引、sitemap） */
export async function fetchAllPostSummaries(): Promise<PostSummary[]> {
  const data = await fetchJson<PostSummary[]>("/api/posts");
  return data ?? [];
}

/** 单篇详情；不存在或未发布返回 `null` */
export async function fetchPostBySlug(slug: string): Promise<Post | null> {
  return fetchJson<Post>(`/api/posts/${encodeURIComponent(slug)}`);
}

/**
 * 与后端 `reading-minutes` 算法一致，供卡片在缺少字段时兜底（一般不需要）。
 */
export function readingMinutesFromMarkdown(content: string): number {
  const text = content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const words = text.split(" ").filter(Boolean).length;
  return Math.max(1, Math.round(words / 280));
}

/** 供 `<time datetime>` 使用的规范 ISO 字符串（UTC） */
export function postPublishedAtIso(dateStr: string): string {
  return new Date(dateStr).toISOString();
}

/**
 * 发布时间展示：本地时区下的年月日 + 24 小时制时分秒。
 * `monthStyle`：列表用 `short`，详情页用 `long`。
 */
export function formatPostPublishedAt(
  dateStr: string,
  monthStyle: "short" | "long" = "short",
): string {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: monthStyle,
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date(dateStr));
}
