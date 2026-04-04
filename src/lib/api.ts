/**
 * 后端 API 基址。
 *
 * - **服务端**（RSC、`fetch`）：优先 `API_URL`（Docker / 内网），否则 `NEXT_PUBLIC_API_URL`，最后默认本机 `4000` 端口。
 * - **浏览器**：仅 `NEXT_PUBLIC_*` 可见，请同时设置 `NEXT_PUBLIC_API_URL` 若需在客户端直连。
 */
export function getBackendBaseUrl(): string {
  const raw =
    process.env.API_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    "http://127.0.0.1:4000";
  return raw.replace(/\/$/, "");
}

/** 浏览器端可用的公共变量（未设置时返回 `undefined`） */
export function getPublicApiBaseUrl(): string | undefined {
  const url = process.env.NEXT_PUBLIC_API_URL;
  return url?.replace(/\/$/, "");
}

export function apiHealthUrl(): string | undefined {
  const base = getPublicApiBaseUrl();
  return base ? `${base}/api/health` : undefined;
}
