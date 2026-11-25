# Ghost Link — Fix for {"error":"Not found","code":"NOT_FOUND"}

## Diagnosis (simple explanation)

When you open a URL that ends in `.workers.dev` and the entire page shows:

```json
{"error":"Not found","code":"NOT_FOUND"}
```

it means the Cloudflare Worker that is running at that address **does not have a handler for the root path `/`**.

Most likely one of these is true:

- The Worker was written only as an API (it only responds to `/api/...` routes).
- There is no `fetch` handler that returns HTML for `/`.
- The frontend file was never deployed or attached to this Worker.
- You are visiting the backend Worker URL instead of a Pages website URL.

Cloudflare Workers return that exact JSON when no route matches. That is why the whole browser window shows the error instead of a website.

## Recommended simple architecture

| Part          | What to use              | File              | Where to deploy          |
|---------------|--------------------------|-------------------|--------------------------|
| Frontend      | Single HTML file         | `ghost-link.html` | Cloudflare Pages         |
| Backend (optional) | Cloudflare Worker   | `worker.js`       | Workers & Pages          |
| Database      | Not required for demo    | —                 | Only add D1 later if needed |

This is the easiest setup for a student/beginner.

## Map layers

The map includes two base layers you can switch between (control is in the top-right):

- **Dark** — Carto dark street map (always available).
- **Satellite** — Uses free Esri World Imagery by default (no API key needed).

### Using your own API key (Mapbox)

If you want Mapbox satellite tiles:

1. Create a free account at [mapbox.com](https://www.mapbox.com) and generate an access token.
2. Open `ghost-link.html` and find this line near the top of the script:
   ```javascript
   const MAPBOX_ACCESS_TOKEN = '';
   ```
3. Paste your token inside the quotes:
   ```javascript
   const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1Ijo...your-token...';
   ```
4. Save and re-upload the file to Cloudflare Pages.

When a token is present, the Satellite layer automatically uses Mapbox. Otherwise it uses the free Esri layer.

## How to deploy the website (Cloudflare Pages) — easiest path

1. Go to the Cloudflare dashboard → **Workers & Pages**.
2. Click **Create** → **Pages** → **Upload assets**.
3. Give the project a name (for example `ghost-link`).
4. Upload **only** the file `ghost-link.html` (you can rename it to `index.html` before uploading if you prefer).
5. After the deploy finishes, Cloudflare will give you a URL like `https://ghost-link.pages.dev`.
6. Open that URL. You should see the Ghost Link map and controls instead of the JSON error.

You can also drag-and-drop the HTML file into the Pages upload screen.

## How to use the optional Worker

Only do this if you want the `.workers.dev` URL itself to respond to `/`.

1. Create a new Worker in the dashboard.
2. Paste the contents of `worker.js`.
3. Deploy.
4. Note: the example Worker currently returns a short placeholder HTML. For a real site it is still better to use Pages for the frontend.

## Testing checklist

- [ ] Open the Pages URL (not the workers.dev URL).
- [ ] You see a dark map and the Ghost Link control panel.
- [ ] Network status shows “Online”.
- [ ] Click **Start Sharing** → status changes and the marker moves (demo) or asks for location permission (real GPS).
- [ ] **Pause**, **Resume**, and **Stop** work.
- [ ] Unknown paths do not show a raw JSON error across the whole page.

## Remaining tasks (need your Cloudflare account)

- Upload `ghost-link.html` to Cloudflare Pages (steps above).
- If you already have a Worker, either add a root `/` handler that returns the HTML, or stop using the workers.dev URL as the main website address.
- Later, if you want real multi-user sharing, accounts, and private invites, you can add a D1 database and expand the Worker. The current version is intentionally a working demo that does not require a backend.

## Important notes

- This version runs in **clearly labeled DEMO MODE**.
- Real location is only used after you explicitly grant the browser permission.
- You can stop sharing at any time.
- No hidden tracking is added.
- No secrets or account details are included.

Once the Pages site is live, the original `{"error":"Not found","code":"NOT_FOUND"}` problem is solved because you are no longer loading a Worker that has no frontend handler.
