import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import ToolbarPlugin from "./ToolbarPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListNode, ListItemNode } from '@lexical/list';
import { CodeNode } from '@lexical/code';
import { LinkNode } from '@lexical/link';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { $getRoot } from 'lexical';


const editorConfig = {
  namespace: "JournalEditor",
  theme: {
    text: {
        bold: 'font-bold',
        italic: 'italic',
        underline: 'underline',
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
  ],
};

interface EditorProps {
    setText: (v: string) => void;
    handleGetPrompts: () => void;
    promptsLoading: boolean;
    prompts: string[];
    setPrompt: (v: string) => void;
    isEditing: boolean;
}

export default function Editor(props: EditorProps) {
  return (
    <LexicalComposer initialConfig={editorConfig} >
      <div className="mb-4 border rounded flex flex-col h-full">
      
        <RichTextPlugin
          contentEditable={
              <ContentEditable 
              className="p-4 outline-none h-full"
              />
            }
        //   placeholder={
        //       <div className="p-4 text-md text-muted-foreground">
        //     Let it all out...</div>
        // }
          ErrorBoundary={LexicalErrorBoundary}
        />
                <OnChangePlugin
          onChange={(editorState) => {
            editorState.read(() => {
              const text = $getRoot().getTextContent();
              props.setText(text);
            });
          }}
        />
        <MarkdownShortcutPlugin />
        <ToolbarPlugin 
            handleGetPrompts={props.handleGetPrompts}
            promptsLoading={props.promptsLoading}
            prompts={props.prompts}
            setPrompt={props.setPrompt}
            isEditing={props.isEditing}/>
        <HistoryPlugin />
        <AutoFocusPlugin />
        
      </div>
    </LexicalComposer>
  );
}