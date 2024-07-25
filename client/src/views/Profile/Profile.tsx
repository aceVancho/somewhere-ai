import { useToast } from "@/components/ui/use-toast";
import { useEntryContext } from "@/contexts/entryContext";
import { useEffect, useState } from "react";
import DeleteAllEntriesBtn from "./DeleteAllEntriesBtn";
import { useAuth } from "@/contexts/authContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RequestPasswordResetBtn } from "./RequestPasswordResetBtn";

const Profile: React.FC = () => {
  const { entries, setEntries } = useEntryContext();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
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
      }
    };

    fetchEntries();
  }, [setEntries]);

  const handleDeleteAllEntries = async () => {
    const deleteEntryPromises: Promise<Response>[] = [];

    entries.forEach((e: IEntry) => {
      const deleteEntryCallback = fetch(
        `http://localhost:4001/api/entries/${e._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("somewhereAIToken")}`,
          },
        }
      );
      deleteEntryPromises.push(deleteEntryCallback);
    });

    try {
        await Promise.all(deleteEntryPromises)
        toast({
            title: "Entry deleted",
            description: `Your entries have been deleted successfully.`,
          });
    } catch (error) {
        console.error('Could not delete all entries:', error);
        toast({
            variant: "destructive",
            title: "Error",
            description: (error as Error).message,
          });
    }
  };

  const requestPasswordResetBtnProps = {
      email: user?.email || '',
      isAuthenticated: isAuthenticated
  }

  return (
    <div className="flex h-4/5 justify-center items-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>{user?.email}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col mt-2 space-y-3">
            <Label>Actions</Label>
            <RequestPasswordResetBtn {...requestPasswordResetBtnProps } />
            <DeleteAllEntriesBtn deleteAllEntries={handleDeleteAllEntries}/>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
