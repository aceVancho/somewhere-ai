import React from "react";
import SentimentCard from "./SentimentCard";
import GoalsCard from "./GoalsCard";
import AnalysisCard from "./AnalysisCard";
import QuestionsCard from "./QuestionsCard";
import { Badge } from "@/components/ui/badge";
import { TabsContent } from "@/components/ui/tabs";

interface AnalysisTabProps {
  entry: {
    _id: string;
    tags: string[];
    sentiment: number;
    analysis: string;
    goals: string[];
    questions: string[];
  };
}

const AnalysisTab: React.FC<AnalysisTabProps> = ({ entry }) => (
  <TabsContent value="Analysis" className="pt-2 flex flex-col">
    <section className="flex mt-4 justify-evenly w-full items-center">
      <SentimentCard entry={entry} />
      <div className="w-1/2 mt-4">
        {entry.tags.map((t, index) => (
          <Badge key={`badge-${index}`} className="m-1 leading-7" variant="outline">
            {t}
          </Badge>
        ))}
      </div>
    </section>
    <AnalysisCard entry={entry} />
    <QuestionsCard entry={entry} />
    <GoalsCard entry={entry} />
  </TabsContent>
);

export default AnalysisTab;
