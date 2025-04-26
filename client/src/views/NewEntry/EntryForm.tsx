import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Editor from "./Editor";
import { EntryFormState } from "./useEntry";

export function EntryForm(props: EntryFormState) {
    
    return (
        <div className="h-full overflow-y-auto p-5 flex flex-col">
      {props.prompt && (
          <div className="mb-4 text-sm border p-4 rounded bg-muted text-muted-foreground">
          <p><strong>Prompt:</strong> {props.prompt}</p>
        </div>
      )}
      <form
        onSubmit={props.handleEntrySubmit}
        className="my-5 h-full rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring overflow-y-auto p-5 flex flex-col"
      >
        <Label htmlFor="title" className="sr-only">Title</Label>
        <Textarea
          id="title"
          placeholder="Title"
          value={props.title}
          onChange={(e) => props.setTitle(e.target.value)}
          className="whitespace-pre-wrap min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0 mb-4 flex-2"
        />
        <Label htmlFor="text" className="sr-only">Message</Label>
        <Editor {...props} />
      </form>
    </div>
  );
}
