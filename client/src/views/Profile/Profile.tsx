import { useToast } from "@/components/ui/use-toast";
import { useEntryContext } from "@/contexts/entryContext";
import { useEffect, useState } from "react";
import DeleteAllEntriesBtn from "./DeleteAllEntriesBtn";

const Profile: React.FC = () => {
  const { entries, setEntries } = useEntryContext();
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

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

  return (
    <div>
      <p>Profile Stuff</p>
      <DeleteAllEntriesBtn deleteAllEntries={handleDeleteAllEntries}/>
    </div>
  );
};

export default Profile;
