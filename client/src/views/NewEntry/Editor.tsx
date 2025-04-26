import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
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
import { $getRoot, ParagraphNode } from "lexical";
import { EntryFormState } from "./useEntry";

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
          listitem: 'editor-nested-listitem',
        },
        ol: 'editor-list-ol',
        ul: 'editor-list-ul',
        listitem: 'editor-listItem',
        listitemChecked: 'editor-listItemChecked',
        listitemUnchecked: 'editor-listItemUnchecked',
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

interface EditorProps extends Pick<EntryFormState, 
  "setText" | "handleGetPrompts" | "promptsLoading" | "prompts" | "setPrompt" | "isEditing"
> {}

export default function Editor(props: EditorProps) {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="mb-4 flex flex-col h-full">
        <RichTextPlugin
          contentEditable={
            <ContentEditable className="p-4 outline-none h-full" />
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
            //   const text = $getRoot().getTextContent();
            //   props.setText(text);
            const editorStateJSON = editorState.toJSON();
            console.log('What we got here??', editorStateJSON);
            props.setText(editorStateJSON);
            });
          }}
        />
        <MarkdownShortcutPlugin />
        <ToolbarPlugin {...props} />
        <HistoryPlugin />
        <AutoFocusPlugin />
        <TabIndentationPlugin />
        <ListPlugin />
      </div>
    </LexicalComposer>
  );
}
