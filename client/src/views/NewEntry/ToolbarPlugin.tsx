import {
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  $getSelection,
  $isRangeSelection,
  TextFormatType,
  ElementFormatType,
} from "lexical";
import { $getNearestNodeOfType, $findMatchingParent } from "@lexical/utils";
import {
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  ListNode,
  ListNodeTagType,
  $isListItemNode,
  $isListNode,
} from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useCallback, useEffect, useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Bold,
  Italic,
  Underline,
  CornerDownLeft,
  Mic,
  LucideStrikethrough,
  AlignRightIcon,
  AlignLeftIcon,
  AlignCenter,
  List,
  ListOrdered,
  EllipsisVertical,
  Menu,
  Strikethrough,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import GeneratePromptsBtn from "./GeneratePromptsBtn";
import { Separator } from "@radix-ui/react-separator";

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
  const [activeAlignment, setActiveAlignment] = useState<string>("");
  const [activeListType, setActiveListType] = useState<"ul" | "ol" | "">("");

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const formats: string[] = [];
      if (selection.hasFormat("bold")) formats.push("bold");
      if (selection.hasFormat("italic")) formats.push("italic");
      if (selection.hasFormat("underline")) formats.push("underline");
      if (selection.hasFormat("strikethrough")) formats.push("strikethrough");
      setActiveFormats(formats);

      const anchorNode = selection.anchor.getNode();
      const element = anchorNode.getTopLevelElementOrThrow();
      const format = element.getFormatType();
      setActiveAlignment(format);

      const parentList = $findMatchingParent(anchorNode, $isListNode);
      if (parentList) {
        setActiveListType(parentList?.__listType === "bullet" ? "ul" : "ol");
      } else {
        setActiveListType("");
      }
    }
  }, []);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => updateToolbar());
    });
  }, [editor, updateToolbar]);

  const toggleTextFormat = (format: TextFormatType) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const toggleElementFormat = (format: ElementFormatType) => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, format);
  };

  const toggleListFormat = (format: ListNodeTagType) => {
    if (format === activeListType) {
      return editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
    if (format === "ul") {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else if (format === "ol") {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  return (
    <div className="flex items-center p-3 pt-0 justify-between flex-wrap gap-2">
      {/* Desktop controls */}
      <div className="hidden md:flex items-center gap-2">
        <ToggleGroup
          type="single"
          value={activeAlignment}
          onValueChange={(val) =>
            val && toggleElementFormat(val as ElementFormatType)
          }
        >
          <ToggleGroupItem value="left">
            <AlignLeftIcon className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="center">
            <AlignCenter className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="right">
            <AlignRightIcon className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
        <Separator orientation="vertical" className="h-5 w-px bg-border mx-2" />
        <ToggleGroup
          type="multiple"
          value={activeFormats}
          onValueChange={(newVals) => {
            const diff =
              newVals.find((v) => !activeFormats.includes(v)) ||
              activeFormats.find((v) => !newVals.includes(v));
            if (diff) toggleTextFormat(diff as TextFormatType);
          }}
        >
          <ToggleGroupItem value="bold">
            <Bold className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic">
            <Italic className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="underline">
            <Underline className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="strikethrough">
            <LucideStrikethrough className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
        <Separator orientation="vertical" className="h-5 w-px bg-border mx-2" />
        <ToggleGroup
          type="single"
          value={activeListType}
          onValueChange={(val) => toggleListFormat(val as ListNodeTagType)}
        >
          <ToggleGroupItem value="ul">
            <List className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="ol">
            <ListOrdered className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Ellipsis menu for mobile */}
      <div className="block md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              <Bold className="h-4 w-4" />
              <Italic className="h-4 w-4" />
              <Underline className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => toggleTextFormat("bold")}>
                Bold
                <DropdownMenuShortcut>
                  <Bold className="h-4 w-4" />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toggleTextFormat("italic")}>
                Italics
                <DropdownMenuShortcut>
                  <Italic className="h-4 w-4" />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toggleTextFormat("underline")}>
                Underline
                <DropdownMenuShortcut>
                  <Underline className="h-4 w-4" />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => toggleTextFormat("strikethrough")}
              >
                Strikethrough
                <DropdownMenuShortcut>
                  <Strikethrough className="h-4 w-4" />
                </DropdownMenuShortcut>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => toggleElementFormat("left")}>
                Align Left
                <DropdownMenuShortcut>
                  <AlignLeftIcon className="h-4 w-4" />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toggleElementFormat("center")}>
                Align Center
                <DropdownMenuShortcut>
                  <AlignCenter className="h-4 w-4" />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toggleElementFormat("right")}>
                Align Right
                <DropdownMenuShortcut>
                  <AlignRightIcon className="h-4 w-4" />
                </DropdownMenuShortcut>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => toggleListFormat("ol")}>
                Ordered List
                <DropdownMenuShortcut>
                  <List className="h-4 w-4" />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toggleListFormat("ul")}>
                Unordered List
                <DropdownMenuShortcut>
                  <ListOrdered className="h-4 w-4" />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Separator orientation="vertical" className="h-5 w-px bg-border mx-2" />

      {/* Prompt Generation & Mic */}
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="button" variant="ghost" size="icon">
                <Mic className="size-4" />
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

      <Separator orientation="vertical" className="h-5 w-px bg-border mx-2" />

      {/* Submit Button */}
      <Button type="submit" size="sm">
        {props.isEditing ? "Update" : "Submit"}
        <CornerDownLeft className="size-3.5" />
      </Button>
    </div>
  );
}
