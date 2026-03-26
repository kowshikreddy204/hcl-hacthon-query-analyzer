import { useEffect, useState } from 'react';
import { ArrowUpDown } from 'lucide-react';
import { fetchSchema, type SchemaTable } from '@/services/api';
import { useQueryStore } from '@/store/queryStore';

export default function SortControl() {
  const { table, sort, setSort } = useQueryStore();
  const [schema, setSchema] = useState<SchemaTable[]>([]);

  useEffect(() => {
    fetchSchema().then(setSchema);
  }, []);

  const tableSchema = schema.find((t) => t.name === table);

  if (!table) return null;

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1">
        <ArrowUpDown className="h-3 w-3" /> Sort
      </label>
      <div className="flex gap-2">
        <select
          value={sort?.column || ''}
          onChange={(e) => {
            const col = e.target.value;
            setSort(col ? { column: col, direction: sort?.direction || 'ASC' } : null);
          }}
          className="flex-1 rounded-md border bg-background px-2 py-1.5 text-xs font-mono focus:ring-1 focus:ring-ring outline-none"
        >
          <option value="">None</option>
          {tableSchema?.columns.map((c) => (
            <option key={c.name} value={c.name}>{c.name}</option>
          ))}
        </select>

        {sort?.column && (
          <button
            onClick={() => setSort({ ...sort, direction: sort.direction === 'ASC' ? 'DESC' : 'ASC' })}
            className="px-3 py-1.5 rounded-md border bg-background text-xs font-mono hover:bg-muted transition-colors"
          >
            {sort.direction}
          </button>
        )}
      </div>
    </div>
  );
}
