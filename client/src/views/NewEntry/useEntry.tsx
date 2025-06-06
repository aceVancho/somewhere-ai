import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/authContext";
import { io, Socket } from "socket.io-client";
import { SerializedEditorState, SerializedLexicalNode } from "lexical";
import { set } from "react-hook-form";

export interface EntryFormState {
  title: string;
  text: string;
  editorStateJSON: SerializedEditorState<SerializedLexicalNode> | "";
  prompt: string;
  prompts: string[];
  promptsLoading: boolean;
  isEditing: boolean;
  setTitle: (v: string) => void;
  setText: (v: string) => void;
  setEditorStateJSON: (v: SerializedEditorState<SerializedLexicalNode>) => void;
  setPrompt: (v: string) => void;
  handleGetPrompts: () => void;
  handleEntrySubmit: (e: React.FormEvent) => void;
}

export function useEntry() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const [text, setText] = useState("");
  const [editorStateJSON, setEditorStateJSON] = useState<
    SerializedEditorState<SerializedLexicalNode> | ""
  >("");
  const [title, setTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [prompts, setPrompts] = useState<string[]>([]);
  const [promptsLoading, setPromptsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [entryIdToEdit, setEntryIdToEdit] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const editMode = searchParams.get("edit") === "true";
    const entryId = searchParams.get("entryId");

    if (editMode && entryId) {
      setIsEditing(true);
      fetchEntryToEdit(entryId);
    }
  }, [searchParams]);

  async function fetchEntryToEdit(entryId: string) {
    try {
      const res = await fetch(`http://localhost:4001/api/entries/${entryId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("somewhereAIToken")}`,
        },
      });

      const data = await res.json();
      const { title, text, editorStateJSON } = data;
      setTitle(title);
      setText(text);
      setEditorStateJSON(editorStateJSON);
      setEntryIdToEdit(entryId);
    } catch (err) {
      console.error("Failed to fetch entry", err);
    }
  }

  async function handleGetPrompts() {
    setPromptsLoading(true);
    try {
      const res = await fetch(
        `http://localhost:4001/api/entries/prompts/${user?._id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("somewhereAIToken")}`,
          },
        }
      );

      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      setPrompts(data.prompts);
      toast({ title: "Prompt Generation Complete ✏️" });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setPromptsLoading(false);
    }
  }

  async function handleEntrySubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text || !title) {
      return toast({ variant: "destructive", title: "Missing fields" });
    }
    setLoading(true);

    if (!isAuthenticated || !user) {
      toast({ variant: "destructive", title: "Auth required" });
      setLoading(false);
      return;
    }

    if (!socketRef.current) {
      socketRef.current = io("http://localhost:4001", {
        auth: { token: localStorage.getItem("somewhereAIToken") },
      });
      socketRef.current.on("connect", () => {
        socketRef.current?.emit("newEntry", { email: user.email });
      });
    } else {
      socketRef.current.emit("newEntry", { email: user.email });
    }

    const method = isEditing ? "PUT" : "POST";
    const url = isEditing
      ? `http://localhost:4001/api/entries/${entryIdToEdit}`
      : `http://localhost:4001/api/entries/create`;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("somewhereAIToken")}`,
        },
        body: JSON.stringify({ title, text, editorStateJSON }),
      });

      if (!res.ok) throw new Error("Failed to save entry");

      toast({ title: isEditing ? "Entry updated" : "Entry created" });
      setTitle("");
      setText("");
      navigate("/all-entries");
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  }

  return {
    state: {
      title,
      text,
      editorStateJSON,
      loading,
      prompts,
      prompt,
      promptsLoading,
      isEditing,
    },
    actions: {
      setTitle,
      setText,
      setEditorStateJSON,
      setPrompt,
      handleGetPrompts,
      handleEntrySubmit,
    },
  };
}
