import { CommandCenter } from "@/components/dashboard/CommandCenter";

export default async function AnalysisDashboardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CommandCenter analysisId={id} />;
}
