import { FileText } from "lucide-react";

interface PlotSummaryProps {
  summary: string;
}

export function PlotSummary({ summary }: PlotSummaryProps) {
  if (!summary) {
    return null;
  }

  return (
    <div>
      <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
        <FileText className="h-5 w-5 text-blue-500" />
        Plot Summary
      </h3>
      <p className="text-muted-foreground leading-relaxed" data-testid="text-plot">
        {summary}
      </p>
    </div>
  );
}
