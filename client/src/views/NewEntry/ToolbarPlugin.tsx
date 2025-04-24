import {
  FORMAT_TEXT_COMMAND,
  $getSelection,
  $isRangeSelection,
  TextFormatType,
} from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useCallback, useEffect, useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Bold, Italic, Underline } from "lucide-react";
import { CornerDownLeft, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import GeneratePromptsBtn from "./GeneratePromptsBtn";


interface NewEntryFormBtnBarProps {
    handleGetPrompts: () => void;
    promptsLoading: boolean;
    prompts: string[];
    setPrompt: (v: string) => void;
    isEditing: boolean;
  }

export default function ToolbarPlugin(props: NewEntryFormBtnBarProps) {
  const [editor] = useLexicalComposerContext();
  const [activeFormats, setActiveFormats] = useState<string[]>([]);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const formats: string[] = [];
      if (selection.hasFormat("bold")) formats.push("bold");
      if (selection.hasFormat("italic")) formats.push("italic");
      if (selection.hasFormat("underline")) formats.push("underline");
      setActiveFormats(formats);
    }
  }, []);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => updateToolbar());
    });
  }, [editor, updateToolbar]);

  const toggleFormat = (format: TextFormatType) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  return (
    <div className="flex items-center p-3 pt-0 justify-between">
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button type="button" variant="ghost" size="icon">
              <Mic className="size-4" />
              <span className="sr-only">Use Microphone</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">Use Microphone</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <GeneratePromptsBtn
        handleGetPrompts={props.handleGetPrompts}
        promptsLoading={props.promptsLoading}
        prompts={props.prompts}
        setPrompt={props.setPrompt}
      />
    </div>
    <ToggleGroup
        type="multiple"
        value={activeFormats}
        onValueChange={(newVals) => {
            const diff = newVals.find(v => !activeFormats.includes(v)) ||
                        activeFormats.find(v => !newVals.includes(v));
            if (diff) toggleFormat(diff as TextFormatType);
        }}
        className="flex gap-2 px-3 py-2"
        >
        <ToggleGroupItem value="bold" aria-label="Bold">
            <Bold className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Italic">
            <Italic className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Underline">
            <Underline className="h-4 w-4" />
        </ToggleGroupItem>
        </ToggleGroup>
    <Button type="submit" size="sm" className="">
      {props.isEditing ? "Update" : "Submit"}
      <CornerDownLeft className="size-3.5" />
    </Button>
  </div>
  );
}