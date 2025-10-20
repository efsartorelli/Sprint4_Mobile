// src/api/rest.ts
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../config/env';
import type { AccessEvent, NewAccessEvent } from '../types';

const BASE = `${SUPABASE_URL}/rest/v1`;
const TABLE = 'access_events';

const baseHeaders: HeadersInit = {
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
};

function assertEnv() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Config ausente: SUPABASE_URL / SUPABASE_ANON_KEY (defina em app.json > extra)');
  }
}

async function http<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`${res.status} ${res.statusText}${text ? `: ${text}` : ''}`);
  }
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

/** LISTAR (somente leitura) */
export async function listEvents(params?: {
  search?: string;
  limit?: number;
}): Promise<AccessEvent[]> {
  assertEnv();
  const { search, limit = 100 } = params || {};

  const url = new URL(`${BASE}/${TABLE}`);
  url.searchParams.set('select', '*');
  url.searchParams.set('order', 'event_time.desc');
  url.searchParams.set('limit', String(limit));
  if (search) {
    // PostgREST: pessoa=ilike.%25<term>%25
    url.searchParams.set('pessoa', `ilike.%25${encodeURIComponent(search)}%25`);
  }

  return http<AccessEvent[]>(url.toString(), { headers: baseHeaders });
}

/** CRIAR */
export async function createEvent(body: NewAccessEvent): Promise<AccessEvent> {
  assertEnv();
  const url = `${BASE}/${TABLE}`;
  const payload = {
    pessoa: body.pessoa,
    status: body.status,
    primeira_vez: body.primeira_vez,
    event_time: body.event_time ?? new Date().toISOString(),
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { ...baseHeaders, Prefer: 'return=representation' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  const json = (await res.json()) as AccessEvent[];
  return json[0];
}

/** ATUALIZAR por id */
export async function updateEvent(
  id: number,
  patch: Partial<NewAccessEvent>
): Promise<AccessEvent> {
  assertEnv();
  const url = `${BASE}/${TABLE}?id=eq.${id}`;

  const res = await fetch(url, {
    method: 'PATCH',
    headers: { ...baseHeaders, Prefer: 'return=representation' },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error(await res.text());
  const json = (await res.json()) as AccessEvent[];
  return json[0];
}

/** EXCLUIR por id */
export async function deleteEvent(id: number): Promise<void> {
  assertEnv();
  const url = `${BASE}/${TABLE}?id=eq.${id}`;
  const res = await fetch(url, { method: 'DELETE', headers: baseHeaders });
  if (!res.ok) throw new Error(await res.text());
}
