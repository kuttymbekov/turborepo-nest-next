const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export interface WorkType {
  id: string;
  name: string;
}

export interface WorkEntry {
  id: string;
  date: string;
  workTypeId: string;
  workType: WorkType;
  volume: number;
  unit: string;
  executor: string;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkEntryInput {
  date: string;
  workTypeId: string;
  volume: number;
  unit: string;
  executor: string;
  notes?: string;
}

export interface UpdateWorkEntryInput {
  date?: string;
  workTypeId?: string;
  volume?: number;
  unit?: string;
  executor?: string;
  notes?: string;
}

export interface WorkEntriesParams {
  from?: string;
  to?: string;
  sort?: 'asc' | 'desc';
}

export const workTypesApi = {
  getAll: () => request<WorkType[]>('/work-types'),
  create: (name: string) => request<WorkType>('/work-types', {
    method: 'POST',
    body: JSON.stringify({ name }),
  }),
};

export const workEntriesApi = {
  getAll: (params?: WorkEntriesParams) => {
    const query = new URLSearchParams();
    if (params?.from) query.set('from', params.from);
    if (params?.to) query.set('to', params.to);
    if (params?.sort) query.set('sort', params.sort);
    const qs = query.toString();
    return request<WorkEntry[]>(`/work-entries${qs ? `?${qs}` : ''}`);
  },
  create: (data: CreateWorkEntryInput) => request<WorkEntry>('/work-entries', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: UpdateWorkEntryInput) => request<WorkEntry>(`/work-entries/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => request<{ success: boolean }>(`/work-entries/${id}`, {
    method: 'DELETE',
  }),
};
