import { TabsContent } from "@/components/ui/tabs";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { ParagraphNode, SerializedEditorState, SerializedLexicalNode } from "lexical";
import React from "react";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { ListNode, ListItemNode } from "@lexical/list";

interface EntryTabProps {
  entry: {
    text: string;
    editorStateJSON?: SerializedEditorState<SerializedLexicalNode>;
  };
}

const EntryTab: React.FC<EntryTabProps> = ({ entry }) => {
  const hasRichText = entry.editorStateJSON && entry.editorStateJSON.root;

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
  editorState: hasRichText ? JSON.stringify(entry.editorStateJSON) : undefined,
  onError(error: Error) {
    throw error;
  },
  nodes: [
    ParagraphNode,
    ListNode,
    ListItemNode
  ],
};

  return (
    <TabsContent value="Entry" className="px-4">
      {hasRichText ? (
        <LexicalComposer initialConfig={editorConfig}>
          <RichTextPlugin
            contentEditable={<ContentEditable className="outline-none" />}
            placeholder={<div />}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <ListPlugin />
        </LexicalComposer>
      ) : (
        <p className="leading-7 whitespace-pre-wrap">{entry.text}</p>
      )}
    </TabsContent>
  );
};

export default EntryTab;