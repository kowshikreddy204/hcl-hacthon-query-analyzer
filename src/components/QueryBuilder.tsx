import { RotateCcw } from 'lucide-react';
import ColumnSelector from './ColumnSelector';
import FilterBuilder from './FilterBuilder';
import SortControl from './SortControl';
import LimitControl from './LimitControl';
import AIInput from './AIInput';
import { useQueryStore } from '@/store/queryStore';

export default function QueryBuilder() {
  const { table, resetQuery } = useQueryStore();

  return (
    <div className="panel h-full flex flex-col">
      <div className="panel-header">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Query Builder</span>
          {table && <span className="query-tag">{table}</span>}
        </div>
        <button
          onClick={resetQuery}
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <RotateCcw className="h-3 w-3" /> Reset
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin panel-body space-y-5">
        {!table ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-muted-foreground">← Select a table from the schema explorer</p>
          </div>
        ) : (
          <>
            <AIInput />
            <div className="h-px bg-border" />
            <ColumnSelector />
            <div className="h-px bg-border" />
            <FilterBuilder />
            <div className="h-px bg-border" />
            <div className="grid grid-cols-2 gap-4">
              <SortControl />
              <LimitControl />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
