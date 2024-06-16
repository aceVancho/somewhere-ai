
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
  interface EntryProps {
    entry: {
      _id: string;
      title: string;
      text: string;
      tags: string[];
      analysis: string;
      sentiment: number;
      goals: string[];
      encouragements: string[];
      questions: string[];
      createdAt: Date;
      updatedAt: Date;
    };
  }
}

export { EntryProps, IUser, IAuthContextType }