
declare global {
  interface IUser {
    _id: string;
    email: string;
    password?: string;
    createdAt?: string;
  }
  
  type SignUpParams = Pick<IUser, 'email' | 'password'>
  interface IAuthContextType {
      user: IUser | null;
      isAuthenticated: boolean;
      login: (userData: SignUpParams) => Promise<void>;
      logout: () => void;
      signUp: (userData: SignUpParams) => Promise<void>;
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
      trends: string;
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