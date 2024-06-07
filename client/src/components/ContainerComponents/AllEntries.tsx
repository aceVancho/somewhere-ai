import React, { useEffect, useState } from 'react';
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Entry {
  _id: string;
  title: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  analysis: string;
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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='h-screen flex flex-col items-center w-full overflow-y-auto'>
        {entries.slice(0, 5).map(entry => (
            <Card className='shadow-md w-1/2 my-2' key={entry._id}>
                <CardHeader className="px-7">
                    <CardTitle>{entry.title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead className="text-left">Date</TableHead>
                        <TableHead className="text-left">ID</TableHead>
                        <TableHead className="text-left">Tags</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell>{new Date(entry.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>{entry._id}</TableCell>
                            <TableCell>
                                {entry.tags.map((tag, index) => (
                                  <Badge key={index} className="text-xs" variant="outline">{tag}</Badge>
                                ))}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                    </Table>
                    <div className="mt-4">
                        <div>
                            <strong>Text:</strong> {entry.text.split(' ').slice(0, 100).join(' ')}
                        </div>
                        <div className="mt-2">
                            <strong>Analysis:</strong> {entry.analysis.split(' ').slice(0, 100).join(' ')}
                        </div>
                    </div>
                </CardContent>
                </Card>
        ))}
    </div>
  );
};

export default AllEntries;
