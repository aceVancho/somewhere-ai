import React, { useState } from "react";
import { CornerDownLeft, Mic, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "../ui/use-toast";
import { useAuth } from "@/contexts/authContext";
import { useContainerContext } from "@/contexts/containerContext";

export default function NewEntry() {
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const {setSelectedContainer} = useContainerContext()
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isAuthenticated || !user) {
      toast({
        variant: "destructive",
        title: "Not authenticated",
        description: "You need to be logged in to create an entry.",
      });
      return;
    };

    console.log('Fake post...')
    setTimeout(() => {
      console.log('Switch to All Entries...')
      setSelectedContainer('ALL_ENTRIES')
    }, 5000);

    // try {
    //   const response = await fetch("http://localhost:4001/api/entries/create", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       "Authorization": `Bearer ${localStorage.getItem("somewhereAIToken")}`,
    //     },
    //     body: JSON.stringify({ text, title }),
    //   });

    //   if (response.ok) {
    //     toast({
    //       title: "Entry created",
    //       description: `Your entry has been created successfully.`,
    //     });
    //     // Clear the form
    //     setTitle("");
    //     setText("");
    //     setTags([]);
    //   } else {
    //     const errorData = await response.json();
    //     throw new Error(errorData.message || "Error creating entry");
    //   }
    // } catch (error) {
    //   console.error("Error creating entry:", error);
    //   toast({
    //     variant: "destructive",
    //     title: "Error",
    //     description: (error as Error).message,
    //   });
    // }
  };

  return (
    <div className="flex items-start justify-center h-full py-5">
      <form
        onSubmit={handleSubmit}
        className="w-11/12 h-full rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring overflow-y-auto p-5 flex flex-col"
      >
        <Label htmlFor="title" className="sr-only">
          Title
        </Label>
        <Textarea
          id="title"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="whitespace-pre-wrap min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0 mb-4 flex-2"
        />
        <Label htmlFor="text" className="sr-only">
          Message
        </Label>
        <Textarea
          id="text"
          placeholder="What are you feeling..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0 mb-4 flex-grow"
        />
        <div className="flex items-center p-3 pt-0 justify-between">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Paperclip className="size-4" />
                  <span className="sr-only">Attach file</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Attach File</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Mic className="size-4" />
                  <span className="sr-only">Use Microphone</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Use Microphone</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button type="submit" size="sm" className="ml-auto gap-1.5">
            Submit
            <CornerDownLeft className="size-3.5" />
          </Button>
        </div>
      </form>
    </div>
  );
}
