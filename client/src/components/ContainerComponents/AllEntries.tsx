import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Ellipsis, Plus, Minus, Info } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@radix-ui/react-accordion";
import { Progress } from "@/components/ui/progress"
import { Badge } from "../ui/badge";
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"

interface Entry {
    _id: string;
    title: string;
    text: string;
    tags: string[];
    analysis: string;
    sentiment: number;
    goals: string[];
    encouragements: string[];
    questions: string[]
    createdAt: Date;
    updatedAt: Date;
}

const AllEntries: React.FC = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [rotated, setRotated] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await fetch("http://localhost:4001/api/entries", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("somewhereAIToken")}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch entries");
        }
        const data = await response.json();
        setEntries(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center w-full overflow-y-auto">
        <Skeleton className="w-1/2 h-20 my-2" />
        <Skeleton className="w-1/2 h-20 my-2" />
        <Skeleton className="w-1/2 h-20 my-2" />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleToggleClick = (id: string) => {
    setRotated((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  interface SentimentCardProps {
    entry: {
      sentiment: number;
    };
  }

  const SentimentCard: React.FC<SentimentCardProps> = ({ entry }) => {
    const sentimentPercentage = ((entry.sentiment + 1) / 2) * 100;
    const sentimentLabel = entry.sentiment > 0.2 ? 'Positive' : entry.sentiment < -0.2 ? 'Negative' : 'Neutral';
  
    return (
      <HoverCard>
        <HoverCardTrigger asChild>
          <Card className="cursor-pointer">
            <CardHeader className="pb-2">
              <CardDescription>Sentiment</CardDescription>
              <CardTitle className="text-4xl">{entry.sentiment.toFixed(2)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">{sentimentLabel} sentiment</div>
              <div className="flex mt-2 items-center">
                <Progress value={sentimentPercentage} aria-label="Sentiment Progress" />
                <p className="ml-2 text-xs text-muted-foreground">{sentimentPercentage.toFixed()}%</p>
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
                Sentiment scores range from -1 (very negative) to 1 (very positive).
              </p>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    );
  };

  return (
    <div className="h-screen flex flex-col items-center w-full overflow-y-auto">
      <Accordion type="multiple" className="w-5/6">
        {entries
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .map((entry) => (
            <AccordionItem value={entry._id} key={entry._id} className="my-4">
              <Card className="shadow-md">
                <AccordionTrigger asChild>
                  <div className="flex justify-between items-center p-4">
                    <div>
                      <CardTitle>{entry.title}</CardTitle>
                      <CardDescription className="mt-1">
                        Created on: {new Date(entry.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Ellipsis
                      aria-label="Toggle options"
                      className={`h-4 w-4 cursor-pointer transition-transform ${
                        rotated[entry._id] ? "rotate-90-cw" : "rotate-90-ccw"
                      }`}
                      onClick={() => handleToggleClick(entry._id)}
                    />
                  </div>
                </AccordionTrigger>
                <AccordionContent asChild>
                  <CardContent className="flex flex-col">
                    <p className="my-1 leading-7">{entry.text}...</p>
                    <Separator className="my-4" />
                    <div className="flex items-center justify-evenly">
                      <p className="w-3/4">{entry.tags.map((t) => <Badge className="mx-1 leading-7" variant="outline">{t}</Badge>)}</p>
                      <SentimentCard entry={entry} />                    
                    </div>
                    <h4 className="leading-7 scroll-m-20 text-2xl font-semibold tracking-tight">Analysis</h4>
                    <p className="my-1 leading-7">Analysis {entry.analysis}...</p>
                    <div className="flex flex-col">
                      <h4 className="leading-7 scroll-m-20 text-2xl font-semibold tracking-tight">Goals</h4>
                      {entry.goals.map((g, index) => {
                      const goalId = `${entry._id}-goal-${index}`
                      return (
                      // <p className="my-1 leading-7">{g}</p>
                      <div className="flex items-center justify-between space-x-2 my-1">
                        <Label htmlFor={goalId}>{g}</Label>
                        <Switch id={goalId} />
                      </div>
                    )
                    })}</div>
                    <p>Encouragements:{entry.encouragements.map((e) => <p className="my-1 leading-7">{e}</p>)}</p>
                    <p>Questions:{entry.questions.map((q) => <p className="my-1 leading-7">{q}</p>)}</p>
                  </CardContent>
                </AccordionContent>
              </Card>
            </AccordionItem>
          ))}
      </Accordion>
    </div>
  );
};

export default AllEntries;