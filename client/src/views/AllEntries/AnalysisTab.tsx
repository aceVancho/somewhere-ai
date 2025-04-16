import React from "react";
import GoalsCard from "./GoalsCard";
import AnalysisCard from "./AnalysisCard";
import QuestionsCard from "./QuestionsCard";
import { TabsContent } from "@/components/ui/tabs";
import TrendsCard from "./TrendsCard";
import { ScoresCard } from "./ScoresCard";

interface AnalysisTabProps {
  entry: {
    _id: string;
    tags: string[];
    sentiment: number;
    analysis: string;
    trends: string;
    goals: string[];
    questions: string[];
  };
}

const AnalysisTab: React.FC<AnalysisTabProps> = ({ entry }) => (
  <TabsContent value="Analysis" className="pt-2 flex flex-col">
    <ScoresCard entry={entry} />
    <AnalysisCard entry={entry} />
    <TrendsCard entry={entry} />
    <QuestionsCard entry={entry} />
    <GoalsCard entry={entry} />
  </TabsContent>
);

export default AnalysisTab;
