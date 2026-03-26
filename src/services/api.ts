import axios from 'axios';
import type { QueryState } from '@/store/queryStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://hcl-mini-hackathon.onrender.com',
  headers: { 'Content-Type': 'application/json' },
});

export interface SchemaTable {
  name: string;
  columns: { name: string; type: string }[];
}

// Mock data for demo when backend is unavailable
const MOCK_SCHEMA: SchemaTable[] = [
  {
    name: 'users',
    columns: [
      { name: 'id', type: 'INTEGER' },
      { name: 'name', type: 'VARCHAR' },
      { name: 'email', type: 'VARCHAR' },
      { name: 'created_at', type: 'TIMESTAMP' },
      { name: 'age', type: 'INTEGER' },
      { name: 'status', type: 'VARCHAR' },
    ],
  },
  {
    name: 'orders',
    columns: [
      { name: 'id', type: 'INTEGER' },
      { name: 'user_id', type: 'INTEGER' },
      { name: 'total', type: 'DECIMAL' },
      { name: 'status', type: 'VARCHAR' },
      { name: 'created_at', type: 'TIMESTAMP' },
    ],
  },
  {
    name: 'products',
    columns: [
      { name: 'id', type: 'INTEGER' },
      { name: 'name', type: 'VARCHAR' },
      { name: 'price', type: 'DECIMAL' },
      { name: 'category', type: 'VARCHAR' },
      { name: 'stock', type: 'INTEGER' },
    ],
  },
  {
    name: 'payments',
    columns: [
      { name: 'id', type: 'INTEGER' },
      { name: 'order_id', type: 'INTEGER' },
      { name: 'amount', type: 'DECIMAL' },
      { name: 'method', type: 'VARCHAR' },
      { name: 'paid_at', type: 'TIMESTAMP' },
    ],
  },
];

function buildSqlLocally(query: QueryState): string {
  if (!query.table) return '-- Select a table to begin';
  const cols = query.columns.length > 0 ? query.columns.join(', ') : '*';
  let sql = `SELECT ${cols}\nFROM ${query.table}`;
  const validFilters = query.filters.filter((f) => f.column && f.value);
  if (validFilters.length > 0) {
    const clauses = validFilters.map(
      (f) => `${f.column} ${f.operator} '${f.value}'`
    );
    sql += `\nWHERE ${clauses.join('\n  AND ')}`;
  }
  if (query.sort?.column) {
    sql += `\nORDER BY ${query.sort.column} ${query.sort.direction}`;
  }
  if (query.limit && query.limit > 0) {
    sql += `\nLIMIT ${query.limit}`;
  }
  return sql + ';';
}

export async function fetchSchema(): Promise<SchemaTable[]> {
  try {
    const res = await api.get('/schema');
    if (res.data?.success && res.data?.schema) {
      // Backend returns: { "success": true, "schema": { "table_name": [ { "column": "id", "type": "int" } ] } }
      return Object.entries(res.data.schema).map(([name, columns]: [string, any]) => ({
        name,
        // Map backend's 'column' property to 'name' which frontend expects
        columns: columns.map((c: any) => ({ name: c.column, type: c.type }))
      }));
    }
    return [];
  } catch (error) {
    console.error("Failed to fetch schema from backend:", error);
    throw error;
  }
}

export async function textToJson(text: string): Promise<Partial<QueryState>> {
  try {
    const res = await api.post('/text-to-json', { query: text });
    if (res.data?.success && res.data?.json) {
      const parsed = res.data.json;
      
      // Adapt AI parsed sort 'order' to frontend 'direction'
      if (parsed.sort && (parsed.sort as any).order) {
        parsed.sort = {
          column: parsed.sort.column,
          direction: String((parsed.sort as any).order).toUpperCase() as 'ASC' | 'DESC'
        };
      }
      
      // Add 'id' to filters because frontend uses them for React keys
      if (Array.isArray(parsed.filters)) {
        parsed.filters = parsed.filters.map((f: any, i: number) => ({
          ...f,
          id: f.id || `f-ai-${Date.now()}-${i}`,
          value: String(f.value)
        }));
      }

      return parsed;
    }
    return {};
  } catch (error) {
    console.error("AI parsing failed", error);
    throw error;
  }
}

export async function buildSql(query: QueryState): Promise<string> {
  try {
    const cleanQuery: any = {
      ...query,
      filters: query.filters.filter(f => f.column && f.value)
    };
    if (cleanQuery.sort) {
      cleanQuery.sort = { column: cleanQuery.sort.column, order: cleanQuery.sort.direction };
    }
    const res = await api.post('/build-sql', cleanQuery);
    return res.data.sql;
  } catch {
    return buildSqlLocally(query);
  }
}

export async function executeQuery(query: QueryState): Promise<{ columns: string[]; rows: Record<string, unknown>[] }> {
  try {
    const cleanQuery: any = {
      ...query,
      filters: query.filters.filter(f => f.column && f.value)
    };
    if (cleanQuery.sort) {
      cleanQuery.sort = { column: cleanQuery.sort.column, order: cleanQuery.sort.direction };
    }
    const res = await api.post('/execute', cleanQuery);
    if (res.data?.success && Array.isArray(res.data?.data)) {
      const rows = res.data.data;
      const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
      return { columns, rows };
    }
    return { columns: [], rows: [] };
  } catch (error) {
    console.error("Execute failed", error);
    throw error;
  }
}

export async function runAiQuery(text: string): Promise<{ json: Partial<QueryState>, sql: string, data: Record<string, unknown>[] }> {
  try {
    const res = await api.post('/query', { query: text });
    if (res.data) {
      const parsedJson = res.data.json;
      if (parsedJson?.sort && (parsedJson.sort as any).order) {
        parsedJson.sort = {
          column: parsedJson.sort.column,
          direction: String((parsedJson.sort as any).order).toUpperCase() as 'ASC' | 'DESC'
        };
      }
      if (Array.isArray(parsedJson?.filters)) {
        parsedJson.filters = parsedJson.filters.map((f: any, i: number) => ({
          ...f,
          id: f.id || `f-ai-${Date.now()}-${i}`,
          value: String(f.value)
        }));
      }
      
      return {
        json: parsedJson,
        sql: res.data.sql,
        data: res.data.data || []
      };
    }
    throw new Error('Invalid response from AI query');
  } catch (error) {
    console.error("AI query execution failed", error);
    throw error;
  }
}
