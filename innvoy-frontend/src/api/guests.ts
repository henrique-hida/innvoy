import type { Guest } from '../types/guest';

const BASE = '/api/guests';

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  if (!res.ok) {
    const body: unknown = await res.json().catch(() => ({}));
    const msg = (body as { message?: string | string[] }).message;
    throw new Error(Array.isArray(msg) ? msg.join(', ') : (msg ?? `Error ${res.status}`));
  }
  return res.status === 204 ? (undefined as T) : (res.json() as Promise<T>);
}

export const guestsApi = {
  findAll(filters: { active?: boolean } = {}) {
    const params = new URLSearchParams();
    if (filters.active !== undefined) params.set('active', String(filters.active));
    const qs = params.toString();
    return request<Guest[]>(`${BASE}${qs ? `?${qs}` : ''}`);
  },
  create: (guest: Guest) => request<Guest>(BASE, { method: 'POST', body: JSON.stringify(guest) }),
  update: (guest: Guest) => request<Guest>(BASE, { method: 'PUT', body: JSON.stringify(guest) }),
  deactivate: (id: number) => request<void>(`${BASE}/${id}`, { method: 'DELETE' }),
  seed: () => request<{ count: number }>(`${BASE}/seed`, { method: 'POST' }),
  clearAll: () => request<void>(`${BASE}/seed`, { method: 'DELETE' }),
};
