import { Badge } from "@/components/ui/badge";
import SentimentCard from "./SentimentCard";

interface ScoresCardProps {
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
  
  export const ScoresCard: React.FC<ScoresCardProps> = ({ entry }) => (
    <div className="flex flex-col w-full mt-4 p-5">
      <h4 className="leading-7 scroll-m-20 text-2xl font-semibold tracking-tight">
        Scores
      </h4>
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
    </div>
  )