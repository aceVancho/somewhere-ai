// 2. Extract PromptCard
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PromptCard({ prompt }: { prompt: string }) {
  return (
    <Card className="shadow-none">
      <CardHeader className="font-light">
        <CardTitle className="text-sm font-medium">Prompt</CardTitle>
      </CardHeader>
      <CardContent className="text-sm">
        {prompt}
      </CardContent>
    </Card>
  );
}