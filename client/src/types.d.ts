
declare global {
  interface IUser {
      email: string;
      password?: string;
  }
  
  interface IAuthContextType {
      user: IUser | null;
      isAuthenticated: boolean;
      login: (user: IUser) => Promise<void>;
      logout: () => void;
      signUp: (user: IUser) => Promise<void>;
      loading: boolean;
  }
  interface IEntry {
      _id: string;
      title: string;
      text: string;
      tags: string[];
      analysis: string;
      sentiment: number;
      goals: string[];
      questions: string[];
      createdAt: Date;
      updatedAt: Date;
  }
  interface EntryProps {
    entry: IEntry
  }

  interface IEntryContextType {
    entries: IEntry[];
    setEntry: (entry: IEntry) => void;
    setEntries: (entries: IEntry[]) => void;
    removeEntry: (entryId: string) => void;
    removeEntries: (entryIds: string[]) => void;
  }
}

export { IEntry, IUser, IAuthContextType }