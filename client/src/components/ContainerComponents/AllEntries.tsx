import React, { useEffect, useState } from "react";
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
import { Edit, Ellipsis, Info, Pencil, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@radix-ui/react-accordion";
import { Progress } from "@/components/ui/progress";
import { Badge } from "../ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/contexts/authContext";
import { useToast } from "../ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Entry {
  _id: string;
  title: string;
  text: string;
  tags: string[];
  analysis: string;
  sentiment: number;
  goals: string[];
  encouragements: string[];
  questions: string[];
  createdAt: Date;
  updatedAt: Date;
}

const AllEntries: React.FC = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  const SentimentCard: React.FC<{ entry: Entry }> = ({ entry }) => {
    const sentimentPercentage = ((entry.sentiment + 1) / 2) * 100;
    const sentimentLabel =
      entry.sentiment > 0.2
        ? "Positive"
        : entry.sentiment < -0.2
        ? "Negative"
        : "Neutral";

    return (
      <HoverCard>
        <HoverCardTrigger asChild>
          <Card className="cursor-pointer">
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

  const GoalsCard: React.FC<{ entry: Entry }> = ({ entry }) => (
    <div className="flex flex-col w-full mt-4 p-5">
      <h4 className="leading-7 scroll-m-20 text-2xl font-semibold tracking-tight">
        Goals
      </h4>
      {entry.goals.map((g, index) => {
        const goalId = `${entry._id}-goal-${index}`;
        return (
          <div className="flex items-center justify-between space-x-2 my-1 leading-7">
            <p className="leading-7">
              <Label htmlFor={goalId}>{g}</Label>
            </p>
            <Switch id={goalId} />
          </div>
        );
      })}
    </div>
  );

  const AnalysisCard: React.FC<{ entry: Entry }> = ({ entry }) => (
    <div className="flex flex-col w-full mt-4 p-5">
      <h4 className="leading-7 scroll-m-20 text-2xl font-semibold tracking-tight">
        Analysis
      </h4>
      <p className="my-1 leading-7">{entry.analysis}...</p>
    </div>
  );

  const QuestionsCard: React.FC<{ entry: Entry }> = ({ entry }) => (
    <div className="flex flex-col w-full mt-4 p-5">
      <h4 className="leading-7 scroll-m-20 text-2xl font-semibold tracking-tight">
        Questions
      </h4>
      {entry.questions.map((q, index) => (
        <p key={index} className="my-1 leading-7">
          {q}
        </p>
      ))}
    </div>
  );

  const EditDeleteOptions: React.FC<{ entry: Entry }> = ({ entry }) => {
    const { toast } = useToast();
    const handleDelete = async (entryId: string) => {
      try {
        const response = await fetch(
          `http://localhost:4001/api/entries/${entryId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem(
                "somewhereAIToken"
              )}`,
            },
          }
        );
        if (response.ok) {
          setEntries((prevEntries) =>
            prevEntries.filter((entry) => entry._id !== entryId)
          );
          toast({
            title: "Entry deleted",
            description: `Your entry has been deleted successfully.`,
          });
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error deleting entry");
        }
      } catch (error) {
        console.error("Error deleting entry:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: (error as Error).message,
        });
      }
    };

    return (
      <div className="flex w-full justify-end mt-4">
        <Button>
          <Pencil className="mr-2 h-4 w-4" /> Edit
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="ml-2">
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to delete "{entry.title}"?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                entry and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleDelete(entry._id)}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  };

  const EntryDropDownOptions: React.FC<{ entry: Entry }> = ({ entry }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleToggleClick = () => {
      setIsDropdownOpen((prev) => !prev);
    };

    const { toast } = useToast();
    const handleDelete = async (entryId: string) => {
      try {
        const response = await fetch(
          `http://localhost:4001/api/entries/${entryId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem(
                "somewhereAIToken"
              )}`,
            },
          }
        );
        if (response.ok) {
          setEntries((prevEntries) =>
            prevEntries.filter((entry) => entry._id !== entryId)
          );
          toast({
            title: "Entry deleted",
            description: `Your entry has been deleted successfully.`,
          });
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error deleting entry");
        }
      } catch (error) {
        console.error("Error deleting entry:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: (error as Error).message,
        });
      }
    };

    const DeleteEntryAlertDialogue: React.FC<{ entry: Entry }> = ({
      entry,
    }) => {
      return (
        <AlertDialog>
          <DropdownMenuItem onClick={(e) => e.preventDefault()}>
            <AlertDialogTrigger asChild>
              <div className="flex text-sm">
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </div>
            </AlertDialogTrigger>
          </DropdownMenuItem>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to delete "{entry.title}"?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                entry and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleDelete(entry._id)}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    };

    return (
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <div onClick={handleToggleClick}>
            <Ellipsis
              aria-label="Toggle options"
              className={`h-4 w-4 cursor-pointer transition-transform ${
                isDropdownOpen ? "rotate-90-cw" : "rotate-90-ccw"
              }`}
            />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DeleteEntryAlertDialogue entry={entry} />
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
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
              <AccordionTrigger asChild>
                <Card className="shadow-md flex justify-between items-center p-4">
                  <div className="flex flex-col">
                    <CardTitle>{entry.title}</CardTitle>
                    <CardDescription className="mt-1">
                      Created on:{" "}
                      {new Date(entry.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <EntryDropDownOptions entry={entry} />
                </Card>
              </AccordionTrigger>
              <AccordionContent asChild className="">
                <Tabs defaultValue="Entry" className="w-full mt-5">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="Entry">Entry</TabsTrigger>
                    <TabsTrigger value="Analysis">Analysis</TabsTrigger>
                  </TabsList>
                  <TabsContent value="Entry" className="pt-2">
                    <p className="leading-7">{entry.text}...</p>
                  </TabsContent>
                  <TabsContent value="Analysis" className="pt-2 flex flex-col">
                    <section className="flex flex-col sm:flex-row justify-evenly items-center">
                      <SentimentCard entry={entry} />
                      <p className="w-3/4">
                        {entry.tags.map((t, index) => (
                          <Badge
                            key={`badge-${index}`}
                            className="mx-1 leading-7"
                            variant="outline"
                          >
                            {t}
                          </Badge>
                        ))}
                      </p>
                    </section>
                    <AnalysisCard entry={entry} />
                    <GoalsCard entry={entry} />
                    <QuestionsCard entry={entry} />
                  </TabsContent>
                </Tabs>
              </AccordionContent>
            </AccordionItem>
          ))}
      </Accordion>
    </div>
  );
};

export default AllEntries;