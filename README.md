# Ghost Link — Real GPS + Share Links

This version uses **only real browser GPS** (no simulation) and lets you create a share link so other people can view your live location.

## Files

- `ghost-link.html` — frontend (deploy to Cloudflare Pages)
- `worker.js` — backend API (deploy as a Cloudflare Worker)
- This README

## 1. Deploy the Worker (backend)

1. Go to Cloudflare dashboard → **Workers & Pages** → **Create** → **Create Worker**.
2. Name it (example: `ghost-link-api`).
3. Paste the contents of `worker.js` and deploy.
4. Go to the Worker’s **Settings** → **Variables** → **KV Namespace Bindings**.
5. Click **Add binding**:
   - Variable name: `LOCATIONS`
   - Create a new KV namespace (example: `ghost-link-locations`) and select it.
6. Save and redeploy if prompted.
7. Copy the Worker URL (example: `https://ghost-link-api.yourname.workers.dev`).

## 2. Configure the frontend

1. Open `ghost-link.html` in a text editor.
2. Find this line near the top of the script:
   ```javascript
   const API_BASE = '';
   ```
3. Paste your Worker URL inside the quotes (no trailing slash):
   ```javascript
   const API_BASE = 'https://ghost-link-api.yourname.workers.dev';
   ```
4. Save the file.

## 3. Deploy the frontend

1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Upload assets**.
2. Upload `ghost-link.html` (or rename it to `index.html` first).
3. Open the `*.pages.dev` URL you receive.

## How to use

- Click **Start Sharing**. The browser will ask for location permission — allow it.
- A share link appears. Click it to copy, then send it to someone.
- They open the link and see your live location on the map (updates every few seconds).
- Click **Stop** to end sharing. The link stops working.
- **Pause** / **Resume** temporarily freeze updates.

## Privacy notes

- Location is only sent while sharing is active.
- The share link is public to anyone who has it (treat it like a private link).
- Data expires after 24 hours in KV.
- You can stop sharing at any time.

## Testing checklist

- [ ] Worker deployed and KV binding named `LOCATIONS` is set.
- [ ] `API_BASE` in the HTML points to the Worker URL.
- [ ] Start Sharing asks for GPS permission and the marker moves with you.
- [ ] Share link appears and can be copied.
- [ ] Opening the share link in another browser/tab shows the location.
- [ ] Stop ends the session.

If the share link does not work, double-check the KV binding name and that `API_BASE` has no trailing slash.
