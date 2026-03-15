export interface Env {
    ASSETS: Fetcher;
}

const LEGACY_WIDGET_URL = "https://accesibilitate.zebrabyte.ro/dist/zbt.min.js";

const SECURITY_HEADERS = {
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Cross-Origin-Resource-Policy": "cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()"
};

function withSecurityHeaders(response: Response): Response {
    const headers = new Headers(response.headers);
    Object.entries(SECURITY_HEADERS).forEach(([key, value]) => headers.set(key, value));

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

        let response = await env.ASSETS.fetch(request);
        const isWidgetBundlePath =
            url.pathname === "/assets/zbt-accessibility.umd.js" ||
            url.pathname === "/dist/zbt.min.js";

        // If static assets were not uploaded in this deploy, fallback to legacy hosted bundle.
        if (isWidgetBundlePath && response.status === 404) {
            try {
                response = await fetch(LEGACY_WIDGET_URL, {
                    headers: {
                        "Accept": "application/javascript"
                    }
                });
            } catch {
                response = new Response("Legacy widget fallback failed.", {
                    status: 502,
                    headers: {
                        "content-type": "text/plain; charset=utf-8"
                    }
                });
            }
        }

        const securedResponse = withSecurityHeaders(response);
        const headers = new Headers(securedResponse.headers);

        if (
            url.pathname === "/zbt-loader.js" ||
            url.pathname === "/loader.js" ||
            url.pathname === "/dist/zbt.min.js" ||
            url.pathname === "/assets/zbt-accessibility.umd.js"
        ) {
            headers.set("Content-Type", "application/javascript; charset=utf-8");
            headers.set("Cache-Control", "public, max-age=300, stale-while-revalidate=86400");
        } else if (headers.get("content-type")?.includes("javascript")) {
            headers.set("Cache-Control", "public, max-age=31536000, immutable");
        } else {
            headers.set("Cache-Control", "public, max-age=300");
        }

        return new Response(securedResponse.body, {
            status: securedResponse.status,
            statusText: securedResponse.statusText,
            headers
        });
    }
};
