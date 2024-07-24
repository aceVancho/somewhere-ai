import React, { useEffect, useState, useRef } from "react";
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
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/authContext";
import { io, Socket } from "socket.io-client";
import { useNavigate } from "react-router-dom";

export default function NewEntry() {
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const socketRef = useRef<Socket | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    if (!isAuthenticated || !user) {
      toast({
        variant: "destructive",
        title: "Not authenticated",
        description: "You need to be logged in to create an entry.",
      });
      setLoading(false);
      return;
    }

    if (!socketRef.current) {
      const newEntrySocketOptions = { auth: { token: localStorage.getItem("somewhereAIToken") } };
      socketRef.current = io('http://localhost:4001', newEntrySocketOptions);

      socketRef.current.on('connect', () => {
        console.log('newEntrySocket connected to meGPT Server.');
        socketRef.current?.emit('newEntry', { email: user.email });
      });

      socketRef.current.on('disconnect', () => {
        console.log('Socket disconnected.');
      });
    } else {
      socketRef.current.emit('newEntry', { email: user.email });
    }

    try {
      const response = await fetch("http://localhost:4001/api/entries/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("somewhereAIToken")}`,
        },
        body: JSON.stringify({ text, title }),
      });

      if (response.ok) {
        toast({
          title: "Entry created",
          description: `Your entry has been created successfully.`,
        });
        setTitle("");
        setText("");
        navigate('/all-entries')
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error creating entry");
      }
    } catch (error) {
      console.error("Error creating entry:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: (error as Error).message,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div id="newEntryLoading" className="h-1/2 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <h2 className="font-medium text-xl text-muted-foreground mb-3">Just a sec.</h2>
          <div className="spinner flex gap-1">
            <div className="rect1"></div>
            <div className="rect2"></div>
            <div className="rect3"></div>
            <div className="rect4"></div>
            <div className="rect5"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
      <form
        onSubmit={handleSubmit}
        className="my-5 w-11/12 h-full rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring overflow-y-auto p-5 flex flex-col"
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
  );
}
