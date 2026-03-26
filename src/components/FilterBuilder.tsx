import { useEffect, useState } from 'react';
import { Plus, X } from 'lucide-react';
import { fetchSchema, type SchemaTable } from '@/services/api';
import { useQueryStore } from '@/store/queryStore';

const OPERATORS = ['=', '!=', '>', '<', '>=', '<=', 'LIKE'];

export default function FilterBuilder() {
  const { table, filters, addFilter, updateFilter, removeFilter } = useQueryStore();
  const [schema, setSchema] = useState<SchemaTable[]>([]);

  useEffect(() => {
    fetchSchema().then(setSchema);
  }, []);

  const tableSchema = schema.find((t) => t.name === table);

  if (!table) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Filters</label>
        <button
          onClick={addFilter}
          className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
        >
          <Plus className="h-3 w-3" /> Add
        </button>
      </div>

      {filters.length === 0 && (
        <p className="text-[11px] text-muted-foreground italic">No filters applied</p>
      )}

      <div className="space-y-2">
        {filters.map((f, i) => (
          <div key={f.id} className="flex items-center gap-2">
            {i > 0 && <span className="text-[10px] text-muted-foreground font-medium w-8">AND</span>}
            {i === 0 && <span className="w-8" />}

            <select
              value={f.column}
              onChange={(e) => updateFilter(f.id, { column: e.target.value })}
              className="flex-1 min-w-0 rounded-md border bg-background px-2 py-1.5 text-xs font-mono focus:ring-1 focus:ring-ring outline-none"
            >
              <option value="">Column</option>
              {tableSchema?.columns.map((c) => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
            </select>

            <select
              value={f.operator}
              onChange={(e) => updateFilter(f.id, { operator: e.target.value })}
              className="w-16 rounded-md border bg-background px-2 py-1.5 text-xs font-mono focus:ring-1 focus:ring-ring outline-none"
            >
              {OPERATORS.map((op) => (
                <option key={op} value={op}>{op}</option>
              ))}
            </select>

            <input
              value={f.value}
              onChange={(e) => updateFilter(f.id, { value: e.target.value })}
              placeholder="Value"
              className="flex-1 min-w-0 rounded-md border bg-background px-2 py-1.5 text-xs font-mono focus:ring-1 focus:ring-ring outline-none"
            />

            <button
              onClick={() => removeFilter(f.id)}
              className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
