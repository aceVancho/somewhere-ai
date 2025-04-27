import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { EditorRefPlugin } from "@lexical/react/LexicalEditorRefPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import ToolbarPlugin from "./ToolbarPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { CodeNode } from "@lexical/code";
import { LinkNode } from "@lexical/link";
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import {
  $getRoot,
  LexicalEditor,
  ParagraphNode,
  SerializedEditorState,
  SerializedLexicalNode,
} from "lexical";
import { EntryFormState } from "./useEntry";
import { useEffect, useRef, } from "react";

interface EditorProps
  extends Pick<
    EntryFormState,
    | "setText"
    | "handleGetPrompts"
    | "promptsLoading"
    | "prompts"
    | "setPrompt"
    | "isEditing"
    | "editorStateJSON"
    | "setEditorStateJSON"
  > {}

export default function Editor(props: EditorProps) {
  const editorConfig = {
    namespace: "JournalEditor",
    theme: {
      text: {
        bold: "font-bold",
        italic: "italic",
        underline: "underline",
        strikethrough: "strikethrough",
      },
      list: {
        nested: {
          listitem: "editor-nested-listitem",
        },
        ol: "editor-list-ol",
        ul: "editor-list-ul",
        listitem: "editor-listItem",
        listitemChecked: "editor-listItemChecked",
        listitemUnchecked: "editor-listItemUnchecked",
      },
    },
    onError(error: Error) {
      throw error;
    },
    nodes: [
      HeadingNode,
      QuoteNode,
      ListNode,
      ListItemNode,
      CodeNode,
      LinkNode,
      HorizontalRuleNode,
      ParagraphNode,
    ],
  };

  // TODO: Come back and clean up this code
  const hasInitialized = useRef(false);
  const loadInitialEditorState = (
    editorStateJSON: SerializedEditorState<SerializedLexicalNode> | "",
    isEditing: boolean
  ) => {
    if (!isEditing) {
      return;
    }
    if (hasInitialized.current) {
      return;
    }
    const editor = editorRef.current;
    editor?.update(() => {
      const newState = editor.parseEditorState(editorStateJSON);
      editor.setEditorState(newState);
    });

    return (hasInitialized.current = true);
  };

  const editorRef = useRef<LexicalEditor | null>(null);
  const isEditingRef = useRef(false);
  useEffect(() => {
    if (props.isEditing) {
      isEditingRef.current = true;
    }
  }, [props.isEditing]);

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="mb-4 flex flex-col h-full">
        <RichTextPlugin
          contentEditable={
            // TODO: Relative position could be spooky
            <div className="relative h-full">
              <ContentEditable className="p-4 outline-none h-full" />
            </div>
          }
          placeholder={
            <div className="p-4 text-sm text-muted-foreground absolute ">
              Let it all out...
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <OnChangePlugin
          onChange={(editorState) => {
            editorState.read(() => {
              const text = $getRoot().getTextContent();
              const editorStateJSON = editorState.toJSON();
              props.setEditorStateJSON(editorStateJSON);
              props.setText(text);
            });
          }}
        />
        <MarkdownShortcutPlugin />
        <ToolbarPlugin {...props} />
        <HistoryPlugin />
        <AutoFocusPlugin />
        <TabIndentationPlugin />
        <ListPlugin />
        <EditorRefPlugin editorRef={editorRef} />
        {loadInitialEditorState(props.editorStateJSON, isEditingRef.current)}
      </div>
    </LexicalComposer>
  );
}
