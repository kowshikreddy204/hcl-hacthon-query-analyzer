import { Play, Loader2, AlertCircle, Inbox } from 'lucide-react';
import { executeQuery } from '@/services/api';
import { useQueryStore } from '@/store/queryStore';

export default function ResultTable() {
  const query = useQueryStore();
  const { executeResult: result, isExecuting: loading, executeError: error } = query;

  const handleExecute = async () => {
    if (!query.table) return;
    query.setIsExecuting(true);
    query.setExecuteError(null);
    try {
      const data = await executeQuery(query);
      query.setExecuteResult(data);
    } catch (e: unknown) {
      query.setExecuteError(e instanceof Error ? e.message : 'Execution failed');
    } finally {
      query.setIsExecuting(false);
    }
  };

  return (
    <div className="panel h-full flex flex-col">
      <div className="panel-header">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Results</span>
        <button
          onClick={handleExecute}
          disabled={!query.table || loading}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 disabled:opacity-40 transition-colors"
        >
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
          Execute
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        {error && (
          <div className="flex items-center gap-2 p-4 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" /> {error}
          </div>
        )}

        {!result && !error && (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2 py-8">
            <Inbox className="h-8 w-8" />
            <p className="text-xs">Execute a query to see results</p>
          </div>
        )}

        {result && result.rows.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2 py-8">
            <Inbox className="h-8 w-8" />
            <p className="text-xs">No rows returned</p>
          </div>
        )}

        {result && result.rows.length > 0 && (
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b bg-muted/50">
                {result.columns.map((col) => (
                  <th key={col} className="px-3 py-2 text-left font-semibold font-mono text-muted-foreground uppercase text-[10px] tracking-wider">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result.rows.map((row, i) => (
                <tr key={i} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  {result.columns.map((col) => (
                    <td key={col} className="px-3 py-2 font-mono">{String(row[col] ?? '')}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {result && result.rows.length > 0 && (
        <div className="px-4 py-2 border-t text-[11px] text-muted-foreground">
          {result.rows.length} row{result.rows.length !== 1 ? 's' : ''} returned
        </div>
      )}
    </div>
  );
}
