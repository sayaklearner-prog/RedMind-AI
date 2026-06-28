import { GraphCanvas } from "@/components/intelligence-graph/GraphCanvas";

export default function GraphPage() {
  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Intelligence Graph</h1>
          <p className="text-muted-foreground">Interactive map of all discovered assets, exposures, and attack paths.</p>
        </div>
      </div>
      <div className="flex-1 min-h-[600px]">
        <GraphCanvas />
      </div>
    </div>
  );
}
