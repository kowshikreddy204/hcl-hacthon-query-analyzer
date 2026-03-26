import { useState } from 'react';
import { Sparkles, Loader2, Send } from 'lucide-react';
import { runAiQuery } from '@/services/api';
import { useQueryStore } from '@/store/queryStore';

export default function AIInput() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { setFromJSON, setIsExecuting, setExecuteResult, setExecuteError } = useQueryStore();

  const handleSubmit = async () => {
    if (!input.trim() || loading) return;
    setLoading(true);
    setIsExecuting(true);
    setExecuteError(null);
    try {
      const result = await runAiQuery(input);
      setFromJSON(result.json);
      
      const rows = result.data;
      const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
      setExecuteResult({ columns, rows });
      
      setInput('');
    } catch (e: unknown) {
      setExecuteError(e instanceof Error ? e.message : 'AI Query failed');
    } finally {
      setLoading(false);
      setIsExecuting(false);
    }
  };

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1">
        <Sparkles className="h-3 w-3 text-accent" /> AI Query
      </label>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="e.g. Show all active users ordered by name"
          className="flex-1 rounded-md border bg-background px-3 py-2 text-xs focus:ring-1 focus:ring-ring outline-none placeholder:text-muted-foreground/50"
        />
        <button
          onClick={handleSubmit}
          disabled={!input.trim() || loading}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-accent text-accent-foreground text-xs font-medium hover:bg-accent/90 disabled:opacity-40 transition-colors"
        >
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
        </button>
      </div>
    </div>
  );
}
