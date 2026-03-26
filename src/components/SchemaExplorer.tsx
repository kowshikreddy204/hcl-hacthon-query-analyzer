import { useEffect, useState } from 'react';
import { Database, Table, ChevronRight, ChevronDown, Columns, Loader2 } from 'lucide-react';
import { fetchSchema, type SchemaTable } from '@/services/api';
import { useQueryStore } from '@/store/queryStore';
import { cn } from '@/lib/utils';

export default function SchemaExplorer() {
  const [schema, setSchema] = useState<SchemaTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const { table: selectedTable, setTable } = useQueryStore();

  useEffect(() => {
    fetchSchema().then((data) => {
      setSchema(data);
      setLoading(false);
    });
  }, []);

  const handleTableClick = (name: string) => {
    setExpanded(expanded === name ? null : name);
    setTable(name);
  };

  return (
    <div className="h-full flex flex-col bg-sidebar text-sidebar-foreground">
      <div className="px-4 py-3 border-b border-sidebar-border flex items-center gap-2">
        <Database className="h-4 w-4 text-sidebar-primary" />
        <span className="text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/70">Schema</span>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-2">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-sidebar-primary" />
          </div>
        ) : (
          <div className="space-y-0.5">
            {schema.map((t) => (
              <div key={t.name}>
                <button
                  onClick={() => handleTableClick(t.name)}
                  className={cn(
                    'w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors',
                    selectedTable === t.name
                      ? 'bg-sidebar-primary/15 text-sidebar-primary'
                      : 'hover:bg-sidebar-accent text-sidebar-foreground'
                  )}
                >
                  {expanded === t.name ? (
                    <ChevronDown className="h-3.5 w-3.5 shrink-0" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5 shrink-0" />
                  )}
                  <Table className="h-3.5 w-3.5 shrink-0" />
                  <span className="font-mono text-xs">{t.name}</span>
                </button>

                {expanded === t.name && (
                  <div className="ml-6 pl-3 border-l border-sidebar-border space-y-0.5 py-1">
                    {t.columns.map((col) => (
                      <div
                        key={col.name}
                        className="flex items-center gap-2 px-2 py-1 text-xs text-sidebar-foreground/60"
                      >
                        <Columns className="h-3 w-3 shrink-0" />
                        <span className="font-mono">{col.name}</span>
                        <span className="ml-auto text-[10px] uppercase text-sidebar-foreground/30">{col.type}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
