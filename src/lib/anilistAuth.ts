const DEFAULT_REDIRECT = window.location.origin;

type ResponseType = 'token' | 'code';

export function buildAniListAuthUrl(
  clientId: string,
  redirectUri: string = DEFAULT_REDIRECT,
  responseType: ResponseType = 'token',
) {
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: responseType,
  });

  return `https://anilist.co/api/v2/oauth/authorize?${params.toString()}`;
}

export function extractAniListTokenFromHash(hash: string) {
  if (!hash.startsWith('#')) return null;

  const params = new URLSearchParams(hash.slice(1));
  const token = params.get('access_token');
  return token ?? null;
}

export function extractAniListCodeFromSearch(search: string) {
  if (!search.startsWith('?')) return null;
  const params = new URLSearchParams(search.slice(1));
  return params.get('code');
}
