import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Info } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface SentimentCardProps {
  entry: {
    sentiment: number;
  };
}

const SentimentCard: React.FC<SentimentCardProps> = ({ entry }) => {
  const sentimentPercentage = ((entry.sentiment + 1) / 2) * 100;
  const sentimentLabel =
    entry.sentiment > 0.1
      ? "Positive"
      : entry.sentiment < -0.1
      ? "Negative"
      : "Neutral";

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Card className="cursor-pointer shadow:md h-40">
          <CardHeader className="pb-2">
            <CardDescription>Sentiment</CardDescription>
            <CardTitle className="text-4xl">
              {entry.sentiment.toFixed(2)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              {sentimentLabel} sentiment
            </div>
            <div className="flex mt-2 items-center">
              <Progress
                value={sentimentPercentage}
                aria-label="Sentiment Progress"
              />
              <p className="ml-2 text-xs text-muted-foreground">
                {sentimentPercentage.toFixed()}%
              </p>
            </div>
          </CardContent>
        </Card>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex space-x-4">
          <Info className="h-6 w-6 text-muted-foreground" />
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">Sentiment Scores</h4>
            <p className="text-sm">
              Sentiment scores range from -1 (very negative) to 1 (very
              positive).
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default SentimentCard;
