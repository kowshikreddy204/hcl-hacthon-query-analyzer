import { useEffect, useState, useCallback } from 'react';
import { Code, Copy, Check, Loader2 } from 'lucide-react';
import { buildSql } from '@/services/api';
import { useQueryStore } from '@/store/queryStore';

export default function SqlPreview() {
  const { table, columns, filters, sort, limit } = useQueryStore();
  const [sql, setSql] = useState('-- Select a table to begin');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generate = useCallback(async () => {
    setLoading(true);
    const result = await buildSql({ table, columns, filters, sort, limit });
    setSql(result);
    setLoading(false);
  }, [table, columns, filters, sort, limit]);

  useEffect(() => {
    generate();
  }, [generate]);

  const handleCopy = () => {
    navigator.clipboard.writeText(sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="panel h-full flex flex-col">
      <div className="panel-header">
        <div className="flex items-center gap-2">
          <Code className="h-4 w-4 text-primary" />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">SQL Preview</span>
          {loading && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
        </div>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="flex-1 overflow-auto">
        <pre className="code-block h-full m-0 rounded-t-none">{sql}</pre>
      </div>
    </div>
  );
}
