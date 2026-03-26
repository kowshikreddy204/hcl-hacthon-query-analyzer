import { create } from 'zustand';

export interface QueryFilter {
  id: string;
  column: string;
  operator: string;
  value: string;
}

export interface QuerySort {
  column: string;
  direction: 'ASC' | 'DESC';
}

export interface QueryState {
  table: string;
  columns: string[];
  filters: QueryFilter[];
  sort: QuerySort | null;
  limit: number | null;
}

export interface QueryExecuteResult {
  columns: string[];
  rows: Record<string, unknown>[];
}

interface QueryStore extends QueryState {
  setTable: (table: string) => void;
  toggleColumn: (column: string) => void;
  setColumns: (columns: string[]) => void;
  addFilter: () => void;
  updateFilter: (id: string, updates: Partial<Omit<QueryFilter, 'id'>>) => void;
  removeFilter: (id: string) => void;
  setSort: (sort: QuerySort | null) => void;
  setLimit: (limit: number | null) => void;
  resetQuery: () => void;
  setFromJSON: (state: Partial<QueryState>) => void;
  executeResult: QueryExecuteResult | null;
  setExecuteResult: (result: QueryExecuteResult | null) => void;
  isExecuting: boolean;
  setIsExecuting: (isExecuting: boolean) => void;
  executeError: string | null;
  setExecuteError: (error: string | null) => void;
}

let filterId = 0;

export const useQueryStore = create<QueryStore>((set) => ({
  table: '',
  columns: [],
  filters: [],
  sort: null,
  limit: null,
  executeResult: null,
  isExecuting: false,
  executeError: null,

  setTable: (table) => set({ table, columns: [], filters: [], sort: null, limit: null, executeResult: null, executeError: null }),

  toggleColumn: (column) =>
    set((s) => ({
      columns: s.columns.includes(column)
        ? s.columns.filter((c) => c !== column)
        : [...s.columns, column],
    })),

  setColumns: (columns) => set({ columns }),

  addFilter: () =>
    set((s) => ({
      filters: [...s.filters, { id: `f-${++filterId}`, column: '', operator: '=', value: '' }],
    })),

  updateFilter: (id, updates) =>
    set((s) => ({
      filters: s.filters.map((f) => (f.id === id ? { ...f, ...updates } : f)),
    })),

  removeFilter: (id) =>
    set((s) => ({ filters: s.filters.filter((f) => f.id !== id) })),

  setSort: (sort) => set({ sort }),

  setLimit: (limit) => set({ limit }),

  resetQuery: () => set({ table: '', columns: [], filters: [], sort: null, limit: null, executeResult: null, executeError: null }),

  setFromJSON: (state) => set((s) => ({ ...s, ...state })),

  setExecuteResult: (result) => set({ executeResult: result }),
  setIsExecuting: (isExecuting) => set({ isExecuting }),
  setExecuteError: (error) => set({ executeError: error }),
}));
