import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Editor from "./Editor";



interface EntryFormProps {
  title: string;
  text: string;
  prompt?: string;
  isEditing: boolean;
  prompts: string[];
  promptsLoading: boolean;
  setTitle: (v: string) => void;
  setText: (v: string) => void;
  setPrompt: (v: string) => void;
  handleGetPrompts: () => void;
  handleEntrySubmit: (e: React.FormEvent) => void;
}

export function EntryForm({
        title,
        text,
        prompt,
        isEditing,
        prompts,
        promptsLoading,
        setTitle,
        setText,
        setPrompt,
        handleGetPrompts,
        handleEntrySubmit,
    }: EntryFormProps) {
    
    return (
        <div className="h-full overflow-y-auto p-5 flex flex-col">
      {prompt && (
          <div className="mb-4 text-sm border p-4 rounded bg-muted text-muted-foreground">
          <p><strong>Prompt:</strong> {prompt}</p>
        </div>
      )}
      <form
        onSubmit={handleEntrySubmit}
        className="my-5 h-full rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring overflow-y-auto p-5 flex flex-col"
      >
        <Label htmlFor="title" className="sr-only">Title</Label>
        <Textarea
          id="title"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="whitespace-pre-wrap min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0 mb-4 flex-2"
        />
        <Label htmlFor="text" className="sr-only">Message</Label>
        <Editor           
            setText={setText}  
            handleGetPrompts={handleGetPrompts}
            promptsLoading={promptsLoading}
            prompts={prompts}
            setPrompt={setPrompt}
            isEditing={isEditing} />
      </form>
    </div>
  );
}
