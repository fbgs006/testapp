import http from 'node:http';
import { URL } from 'node:url';

type StreamResponse = {
  anilistId: number;
  episode: number;
  url: string | null;
  source: string | null;
  note?: string;
};

type ResolveResult = {
  url: string | null;
  source: string | null;
  note?: string;
};

interface StreamProvider {
  resolve(anilistId: number, episode: number): Promise<ResolveResult>;
}

class PlaceholderProvider implements StreamProvider {
  async resolve(anilistId: number, episode: number): Promise<ResolveResult> {
    return {
      url: null,
      source: null,
      note: `No stream resolver wired yet for AniList ${anilistId} episode ${episode}.`,
    };
  }
}

const provider: StreamProvider = new PlaceholderProvider();

const server = http.createServer(async (req, res) => {
  if (!req.url) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Missing URL' }));
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === 'GET' && url.pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }

  if (req.method === 'POST' && url.pathname === '/oauth/anilist/token') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', async () => {
      try {
        const { clientId, clientSecret, redirectUri, code } = JSON.parse(body) as {
          clientId: string;
          clientSecret: string;
          redirectUri: string;
          code: string;
        };

        if (!clientId || !clientSecret || !redirectUri || !code) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Missing OAuth exchange parameters.' }));
          return;
        }

        const tokenResponse = await fetch('https://anilist.co/api/v2/oauth/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            grant_type: 'authorization_code',
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: redirectUri,
            code,
          }),
        });

        const tokenPayload = await tokenResponse.json();
        if (!tokenResponse.ok) {
          res.writeHead(tokenResponse.status, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(tokenPayload));
          return;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(tokenPayload));
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error instanceof Error ? error.message : 'Token exchange failed.' }));
      }
    });
    return;
  }

  if (req.method === 'GET' && url.pathname === '/stream') {
    const anilistId = Number(url.searchParams.get('anilist_id'));
    const episode = Number(url.searchParams.get('episode'));

    if (!anilistId || !episode) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Missing anilist_id or episode query params.' }));
      return;
    }

    try {
      const result = await provider.resolve(anilistId, episode);
      const payload: StreamResponse = {
        anilistId,
        episode,
        url: result.url,
        source: result.source,
        note: result.note,
      };
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(payload));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          error: error instanceof Error ? error.message : 'Unknown stream resolver error.',
        }),
      );
    }
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

const port = Number(process.env.PORT ?? 8787);
server.listen(port, () => {
  console.log(`Stream resolver API listening on http://localhost:${port}`);
});
