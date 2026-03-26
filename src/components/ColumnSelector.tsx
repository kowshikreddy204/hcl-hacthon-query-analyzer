import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { fetchSchema, type SchemaTable } from '@/services/api';
import { useQueryStore } from '@/store/queryStore';
import { cn } from '@/lib/utils';

export default function ColumnSelector() {
  const { table, columns, toggleColumn } = useQueryStore();
  const [schema, setSchema] = useState<SchemaTable[]>([]);

  useEffect(() => {
    fetchSchema().then(setSchema);
  }, []);

  const tableSchema = schema.find((t) => t.name === table);

  if (!table) {
    return <p className="text-xs text-muted-foreground italic">Select a table first</p>;
  }

  if (!tableSchema) return null;

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Columns</label>
      <div className="flex flex-wrap gap-1.5">
        {tableSchema.columns.map((col) => {
          const selected = columns.includes(col.name);
          return (
            <button
              key={col.name}
              onClick={() => toggleColumn(col.name)}
              className={cn(
                'inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono transition-all border',
                selected
                  ? 'bg-primary/10 border-primary/30 text-primary'
                  : 'bg-muted border-transparent text-muted-foreground hover:border-border'
              )}
            >
              {selected && <Check className="h-3 w-3" />}
              {col.name}
            </button>
          );
        })}
      </div>
      {columns.length === 0 && (
        <p className="text-[11px] text-muted-foreground">All columns (*) will be selected</p>
      )}
    </div>
  );
}
