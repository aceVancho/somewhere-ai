import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Toggle } from "@/components/ui/toggle";
import { Ellipsis } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Entry {
  _id: string;
  title: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  sentiment: number;
}

const AllEntries: React.FC = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await fetch('http://localhost:4001/api/entries', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('somewhereAIToken')}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch entries');
        }
        const data = await response.json();
        setEntries(data);
      } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
          } else {
            setError('An unknown error occurred');
          }
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, []);

  if (loading) {
    return (
      <div className='h-screen flex flex-col items-center w-full overflow-y-auto'>
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
    <div className='h-screen flex flex-col items-center w-full overflow-y-auto'>
      {entries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((entry) => (
        <Card className='flex justify-between shadow-md w-5/6 my-2' key={entry._id}>
          <CardHeader className="px-7 flex justify-evenly">
              <CardTitle>{entry.title}</CardTitle>
              <CardDescription>Created on: {new Date(entry.createdAt).toLocaleDateString()}</CardDescription>
          </CardHeader>
          <CardContent className='flex items-center'>
            <Toggle aria-label="Toggle options">
              <Ellipsis className="h-4 w-4 transition-transform transform rotate-0 group-hover:rotate-90" />
            </Toggle>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AllEntries;
