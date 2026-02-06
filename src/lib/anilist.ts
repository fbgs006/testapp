const ANILIST_API = 'https://graphql.anilist.co';

type AniListError = {
  message: string;
  status?: number;
  hint?: string;
};

type AniListPayload<TData> = {
  data?: TData;
  errors?: AniListError[];
};

export async function anilistRequest<TData>(query: string, variables?: Record<string, unknown>, token?: string): Promise<TData> {
  const response = await fetch(ANILIST_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ query, variables }),
  });

  const contentType = response.headers.get('content-type') ?? '';
  const isJson = contentType.includes('application/json');

  const payload: AniListPayload<TData> | null = isJson ? await response.json() : null;

  if (!response.ok) {
    const errorMessage = payload?.errors?.map((e) => [e.message, e.hint].filter(Boolean).join(' ')).join('; ');
    throw new Error(errorMessage || `AniList request failed with status ${response.status}`);
  }

  if (payload?.errors?.length) {
    throw new Error(payload.errors.map((e) => [e.message, e.hint].filter(Boolean).join(' ')).join('; '));
  }

  if (!payload?.data) {
    throw new Error('AniList returned no data.');
  }

  return payload.data;
}
