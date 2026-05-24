export interface WorkEntry {
  id: string;
  date: string;
  workTypeId: string;
  workType: { id: string; name: string };
  volume: number;
  unit: string;
  executor: string;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkEntryDto {
  date: string;
  workTypeId: string;
  volume: number;
  unit: string;
  executor: string;
  notes?: string;
}

export interface UpdateWorkEntryDto {
  date?: string;
  workTypeId?: string;
  volume?: number;
  unit?: string;
  executor?: string;
  notes?: string;
}

export interface ListWorkEntriesQuery {
  from?: string;
  to?: string;
  sort?: 'asc' | 'desc';
}
