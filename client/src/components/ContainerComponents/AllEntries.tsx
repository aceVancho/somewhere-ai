import React, { useEffect, useState } from 'react';
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Entry {
  _id: string;
  title: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
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
        {entries.slice(0,5).map(entry => (
            <Card className='shadow-md w-1/2 my-2' key={entry._id}>
                <CardHeader className="px-7">
                    <CardTitle>Entry #: {entry.title}</CardTitle>
                    <CardDescription>Entry Id: {entry._id}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                    <TableHeader>
                        <TableRow>
                        {/* <TableHead>Customer</TableHead> */}
                        <TableHead className="text-left hidden sm:table-cell">Date</TableHead>
                        <TableHead className="text-center hidden sm:table-cell">Number</TableHead>
                        <TableHead className="text-center hidden sm:table-cell">Tags</TableHead>
                        <TableHead className="hidden md:table-cell">Text</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow className="mx-5">
                            <TableCell className="text-right">{new Date(entry.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell className="text-center hidden sm:table-cell">
                                    {entry.title}
                            </TableCell>
                            <TableCell className="text-center hidden md:table-cell">
                                <Badge className="text-xs" variant="outline">Tag1</Badge>
                                <Badge className="text-xs" variant="default">Tag2</Badge>
                                <Badge className="text-xs" variant="secondary">Tag2</Badge>
                                <Badge className="text-xs" variant="destructive">Tag4</Badge>
                            </TableCell>
                            <TableCell>
                                <div className="font-medium">{entry.text.slice(0, 200)}</div>
                                {/* <div className="hidden text-sm text-muted-foreground md:inline"> */}
                                {/* {entry.title} */}
                                {/* </div> */}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                    </Table>
                </CardContent>
                </Card>
        //   <li key={entry._id}>
        //     <h2>{entry.title}</h2>
        //     <p>{entry.text}</p>
        //     <p>{new Date(entry.createdAt).toLocaleDateString()}</p>
        //   </li>
        ))}
    </div>
  );
};

export default AllEntries;
