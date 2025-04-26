import { useEntry } from "./useEntry";
import { EntryForm } from "./EntryForm";

export default function NewEntry() {
  const {
    state: { title, text, editorStateJSON, loading, prompts, prompt, promptsLoading, isEditing },
    actions: { setTitle, setText, setEditorStateJSON, setPrompt, handleGetPrompts, handleEntrySubmit },
  } = useEntry();

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
    <div className="sm:w-11/12 md:w-11/12 my-5 lg:w-7/12 h-full overflow-y-auto p-5 flex flex-col">
      <EntryForm
        title={title}
        text={text}
        editorStateJSON={editorStateJSON}
        prompt={prompt}
        isEditing={isEditing}
        prompts={prompts}
        promptsLoading={promptsLoading}
        setTitle={setTitle}
        setText={setText}
        setEditorStateJSON={setEditorStateJSON}
        setPrompt={setPrompt}
        handleGetPrompts={handleGetPrompts}
        handleEntrySubmit={handleEntrySubmit}
      />
    </div>
  );
}