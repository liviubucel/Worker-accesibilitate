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

Compatibility paths kept for existing installs:

- `/dist/zbt.min.js`
- `/loader.js`
- `/zbt-loader.js`

Embed snippet:

```html
<script
  src="https://YOUR-WORKER-DOMAIN/zbt-loader.js"
  data-asw-position="bottom-right"
  data-asw-offset="24,24"
  data-asw-statement-url="https://example.com/accessibility"
  data-asw-feedback-url="https://example.com/accessibility-feedback"
  defer
></script>
```
