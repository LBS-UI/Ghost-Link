// Optional Cloudflare Worker that serves the Ghost Link frontend
// and provides a simple API endpoint example.
// Deploy this if you want the .workers.dev URL itself to show the website
// instead of the NOT_FOUND error.

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Serve the frontend HTML at the root and common paths
    if (path === '/' || path === '/ghost-link.html' || path === '/index.html') {
      // In a real deployment you would either:
      // 1. Embed the HTML as a string here, or
      // 2. Use Cloudflare Pages / Assets binding to serve the static file.
      // For this example we return a short redirect message or you can paste the full HTML.
      return new Response(
        `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Ghost Link</title></head>
<body style="font-family:sans-serif;background:#0f0f12;color:#e8e8f0;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;">
  <div style="text-align:center;max-width:480px;padding:24px;">
    <h1>Ghost Link</h1>
    <p>The frontend HTML should be served here.</p>
    <p>Recommended: deploy <code>ghost-link.html</code> to Cloudflare Pages instead of embedding it in the Worker.</p>
    <p>See the README for the simplest setup.</p>
  </div>
</body>
</html>`,
        { headers: { 'Content-Type': 'text/html;charset=UTF-8' } }
      );
    }

    // Example API route
    if (path === '/api/status') {
      return Response.json({
        ok: true,
        service: 'ghost-link',
        mode: 'demo',
        timestamp: new Date().toISOString()
      });
    }

    // Proper JSON error for unknown API routes
    if (path.startsWith('/api/')) {
      return Response.json(
        { error: 'Not found', code: 'NOT_FOUND', path },
        { status: 404 }
      );
    }

    // Fallback: never show raw JSON error on the main site
    return new Response('Not found', { status: 404 });
  }
};
