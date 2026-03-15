# Cloudflare Worker

Deploy flow:

1. Run the widget build in the project root.
2. Copy the generated `dist/zbt-accessibility.umd.js` into `worker/public/assets/`.
3. Deploy the Worker with static assets.

Suggested commands:

```bash
npm run build
node worker/copy-build.mjs
wrangler deploy
```

Embed snippet:

```html
<script
  src="https://YOUR-WORKER-DOMAIN/loader.js"
  data-asw-position="bottom-right"
  data-asw-offset="24,24"
  data-asw-statement-url="https://example.com/accessibility"
  data-asw-feedback-url="https://example.com/accessibility-feedback"
  defer
></script>
```
