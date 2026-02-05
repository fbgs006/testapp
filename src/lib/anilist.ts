const ANILIST_API = 'https://graphql.anilist.co';

export async function anilistRequest<TData>(query: string, variables?: Record<string, unknown>, token?: string): Promise<TData> {
  const response = await fetch(ANILIST_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`AniList request failed with status ${response.status}`);
  }

  const payload: { data?: TData; errors?: Array<{ message: string }> } = await response.json();

  if (payload.errors?.length) {
    throw new Error(payload.errors.map((e) => e.message).join('; '));
  }

  if (!payload.data) {
    throw new Error('AniList returned no data.');
  }

  return payload.data;
}
