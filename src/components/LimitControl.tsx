import { Hash } from 'lucide-react';
import { useQueryStore } from '@/store/queryStore';

export default function LimitControl() {
  const { table, limit, setLimit } = useQueryStore();

  if (!table) return null;

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1">
        <Hash className="h-3 w-3" /> Limit
      </label>
      <input
        type="number"
        min={0}
        value={limit ?? ''}
        onChange={(e) => {
          const v = e.target.value;
          setLimit(v ? parseInt(v, 10) : null);
        }}
        placeholder="No limit"
        className="w-full rounded-md border bg-background px-2 py-1.5 text-xs font-mono focus:ring-1 focus:ring-ring outline-none"
      />
    </div>
  );
}
