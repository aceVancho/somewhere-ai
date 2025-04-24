import { CornerDownLeft, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import GeneratePromptsBtn from "./GeneratePromptsBtn";
import ToolbarPlugin from "./ToolbarPlugin";



interface NewEntryFormBtnBarProps {
  handleGetPrompts: () => void;
  promptsLoading: boolean;
  prompts: string[];
  setPrompt: (v: string) => void;
  isEditing: boolean;
}

const NewEntryFormBtnBar = (props: NewEntryFormBtnBarProps) => {
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
      <Button type="submit" size="sm" className="ml-auto gap-1.5">
        {props.isEditing ? "Update" : "Submit"}
        <CornerDownLeft className="size-3.5" />
      </Button>
    </div>
  );
};

export default NewEntryFormBtnBar;
