import React, { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion } from "@/components/ui/accordion";
import Entry from "./Entry";
import { useEntryContext } from "../../contexts/entryContext";
import { Button } from "@/components/ui/button";
import NavPanel from "@/components/NavPanel";
import { useNavigate } from "react-router-dom";

interface IEntry {
  _id: string;
  title: string;
  text: string;
  tags: string[];
  analysis: string;
  sentiment: number;
  goals: string[];
  questions: string[];
  createdAt: Date;
  updatedAt: Date;
}

const AllEntries: React.FC = () => {
  const { entries, setEntries } = useEntryContext();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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
  }, [setEntries]);

  if (entries.length === 0) {
    return (
      <div className="flex justify-center items-center h-2/4">
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-2xl font-semibold mb-2">Nothing to see here.</h1>
          <Button
            className="text-2xl font-semibold text-primary"
            onClick={() => navigate('/new-entry')}
            variant="link"
          >
            Write more
          </Button>
        </div>
      </div>
    );
  }

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

  return (
      <div className="h-screen flex flex-col items-center w-full overflow-y-auto">
        <Accordion type="multiple" className="w-5/6">
          {entries
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .map((entry) => (
              <Entry key={entry._id} entry={entry} />
            ))}
        </Accordion>
      </div>
  );
};

export default AllEntries;
