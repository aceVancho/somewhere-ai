import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Ellipsis } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@radix-ui/react-accordion";

interface Entry {
    _id: string;
    title: string;
    text: string;
    tags: string[];
    analysis: string;
    sentiment: number;
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
                  <CardContent>
                    <p>Tags:{entry.tags.map((t) => <p>{t}</p>)}</p>
                    <p>Sentiment: {entry.sentiment}</p>
                    <p>Analysis: {entry.analysis.slice(0, 500)}...</p>
                    <p>Entry Text:{entry.text.slice(0, 500)}...</p>
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
