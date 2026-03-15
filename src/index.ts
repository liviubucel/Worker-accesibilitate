export interface Env {
    ASSETS: Fetcher;
}

const SECURITY_HEADERS = {
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Cross-Origin-Resource-Policy": "cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()"
};

function withSecurityHeaders(response: Response): Response {
    const headers = new Headers(response.headers);
    Object.entries(SECURITY_HEADERS).forEach(([key, value]) => headers.set(key, value));

    if (headers.get("content-type")?.includes("javascript")) {
        headers.set("Cache-Control", "public, max-age=31536000, immutable");
    } else {
        headers.set("Cache-Control", "public, max-age=300");
    }

    return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers
    });
}

export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        const url = new URL(request.url);

        if (url.pathname === "/health") {
            return withSecurityHeaders(
                new Response(JSON.stringify({ ok: true, service: "accessibility-widget" }), {
                    headers: { "content-type": "application/json; charset=utf-8" }
                })
            );
        }

        const response = await env.ASSETS.fetch(request);
        return withSecurityHeaders(response);
    }
};
