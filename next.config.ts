import path from "node:path";
import type { NextConfig } from "next";

/**
 * Next.js 主配置文件（TypeScript）。
 *
 * 职责概览：
 * - 配置 Turbopack 根目录，避免 monorepo / 多 lockfile 环境下误判项目根
 * - 后续可在此扩展：`images` 远程域名、`headers` 安全头、`redirects` 等
 *
 * 文档：https://nextjs.org/docs/app/api-reference/config/next-config-js
 */
const nextConfig: NextConfig = {
  /**
   * Turbopack（`next dev --turbopack` / Next 16 默认）相关选项。
   * `root` 显式指向当前包目录，避免拾取到用户主目录下其它 `package-lock.json`。
   */
  turbopack: {
    root: path.resolve(process.cwd()),
  },
};

export default nextConfig;
