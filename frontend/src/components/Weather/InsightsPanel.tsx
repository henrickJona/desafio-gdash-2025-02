import { Card, CardContent } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";

export function InsightsPanel({ insights }: any) {
  if (!insights) return null;
  const insightText = insights.text || "Carregando insights...";
  return (
    <Card className="mt-4">
      <CardContent className="pt-4">
        <h2 className="font-semibold mb-2">Insights da IA</h2>
        <ReactMarkdown>{insightText}</ReactMarkdown>
      </CardContent>
    </Card>
  );
}
