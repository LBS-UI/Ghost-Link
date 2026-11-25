// Ghost Link Worker — simple share link backend
// Uses a KV namespace named LOCATIONS
// Bind it in the Cloudflare dashboard: Settings → Variables → KV Namespace Bindings → LOCATIONS

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Max-Age': '86400'
        }
      });
    }

    const cors = {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    };

    try {
      // Create a new share session
      if (path === '/api/share' && request.method === 'POST') {
        const id = crypto.randomUUID().slice(0, 8);
        const token = crypto.randomUUID().replace(/-/g, '');
        const record = {
          id,
          token,
          lat: null,
          lng: null,
          updated: Date.now()
        };
        await env.LOCATIONS.put(id, JSON.stringify(record), { expirationTtl: 60 * 60 * 24 }); // 24h
        return Response.json({ id, token }, { headers: cors });
      }

      // Update location (requires token)
      const updateMatch = path.match(/^\/api\/share\/([a-zA-Z0-9-]+)$/);
      if (updateMatch && request.method === 'POST') {
        const id = updateMatch[1];
        const body = await request.json();
        const existing = await env.LOCATIONS.get(id, 'json');
        if (!existing || existing.token !== body.token) {
          return Response.json({ error: 'Unauthorized' }, { status: 401, headers: cors });
        }
        existing.lat = body.lat;
        existing.lng = body.lng;
        existing.updated = Date.now();
        await env.LOCATIONS.put(id, JSON.stringify(existing), { expirationTtl: 60 * 60 * 24 });
        return Response.json({ ok: true }, { headers: cors });
      }

      // Get current location (public for the share link)
      if (updateMatch && request.method === 'GET') {
        const id = updateMatch[1];
        const existing = await env.LOCATIONS.get(id, 'json');
        if (!existing) {
          return Response.json({ error: 'Not found' }, { status: 404, headers: cors });
        }
        return Response.json({
          lat: existing.lat,
          lng: existing.lng,
          updated: existing.updated
        }, { headers: cors });
      }

      return Response.json({ error: 'Not found', code: 'NOT_FOUND' }, { status: 404, headers: cors });
    } catch (err) {
      return Response.json({ error: err.message }, { status: 500, headers: cors });
    }
  }
};
