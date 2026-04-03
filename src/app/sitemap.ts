import type { MetadataRoute } from "next";
import { fetchAllPostSummaries } from "@/lib/posts";
import { site } from "@/lib/site";

/**
 * 站点地图：文章 URL 由后端列表接口动态生成。
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await fetchAllPostSummaries();
  const base = site.url.replace(/\/$/, "");

  return [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/blog`, lastModified: new Date() },
    { url: `${base}/changelog`, lastModified: new Date() },
    ...posts.map((p) => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: new Date(p.date),
    })),
  ];
}
