import SchemaExplorer from '@/components/SchemaExplorer';
import QueryBuilder from '@/components/QueryBuilder';
import SqlPreview from '@/components/SqlPreview';
import ResultTable from '@/components/ResultTable';

export default function Dashboard() {
  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="h-12 border-b flex items-center px-4 gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-xs font-bold">Q</span>
          </div>
          <h1 className="text-sm font-semibold">QueryForge</h1>
        </div>
        <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Hybrid Query Builder</span>
      </header>

      {/* Body */}
      <div className="flex-1 flex min-h-0">
        {/* Sidebar */}
        <aside className="w-56 shrink-0 border-r">
          <SchemaExplorer />
        </aside>

        {/* Main area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top: Query Builder */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <QueryBuilder />
          </div>

          {/* Bottom: SQL + Results */}
          <div className="h-[45%] border-t flex min-h-0">
            <div className="w-2/5 border-r min-h-0">
              <SqlPreview />
            </div>
            <div className="flex-1 min-h-0">
              <ResultTable />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
