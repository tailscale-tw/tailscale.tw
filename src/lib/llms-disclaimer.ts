import type { APIRoute } from "astro";

/** 非官方聲明（英文版），插在 llms.txt 開頭的站點描述之後。 */
export const UNOFFICIAL_DISCLAIMER =
  'This is an unofficial community site. It is not affiliated with, endorsed by, or sponsored by Tailscale Inc. "Tailscale" is a trademark of Tailscale Inc.';

/**
 * 包裝 Nimbus 產生的 llms 路由：在 H1 後的第一段（站點描述）之後插入聲明。
 * Nimbus 沒有提供設定項，文件建議以包裝 `GET` 的方式自訂回應。
 */
export function withDisclaimer(get: APIRoute): APIRoute {
  return async context => {
    const response = await get(context);
    if (!response.ok) return response;
    const body = await response.text();
    // 第一個空行分開 H1 與描述，第二個空行是描述段落的結尾
    const afterTitle = body.indexOf("\n\n");
    const afterDescription =
      afterTitle === -1 ? -1 : body.indexOf("\n\n", afterTitle + 2);
    const next =
      afterDescription === -1
        ? `${body.trimEnd()}\n\n${UNOFFICIAL_DISCLAIMER}\n`
        : `${body.slice(0, afterDescription)}\n\n${UNOFFICIAL_DISCLAIMER}${body.slice(afterDescription)}`;
    const headers = new Headers(response.headers);
    headers.delete("content-length");
    return new Response(next, { status: response.status, headers });
  };
}
