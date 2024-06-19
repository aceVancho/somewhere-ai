import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Edit, Ellipsis, Trash2 } from "lucide-react";
import { useEntryContext } from "@/contexts/entryContext";

interface EntryDropDownOptionsProps {
  entry: {
    _id: string;
    title: string;
  };
}

const EntryDropDownOptions: React.FC<EntryDropDownOptionsProps> = ({ entry }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleToggleClick = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const { toast } = useToast();
  const { removeEntry } = useEntryContext();
  // TODO: Sometimes this fails, it also doesn't rerender.
  const handleDelete = async (event: React.MouseEvent, entryId: string) => {
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
        removeEntry(entryId);
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

  const DeleteEntryAlertDialogue: React.FC<{ entry: EntryDropDownOptionsProps["entry"] }> = ({ entry }) => {
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
            <AlertDialogAction onClick={(event) => handleDelete(event, entry._id)}>
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
          <DeleteEntryAlertDialogue entry={entry} />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default EntryDropDownOptions;
