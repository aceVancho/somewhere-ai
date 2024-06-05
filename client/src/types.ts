export interface IUser {
    email: string;
    password?: string;
}

export interface IAuthContextType {
    user: IUser | null;
    isAuthenticated: boolean;
    login: (user: IUser) => Promise<void>;
    logout: () => void;
    signUp: (user: IUser) => Promise<void>;
    loading: boolean;
}

export interface IWordBankContextType {
    word: string | undefined;
    setWord: (word: string) => void;
    wordData: any;
    setWordData: (data: string) => void;
    isLoading: boolean;
    setIsLoading: (isLoading: IWordBankContextType["isLoading"]) => void;
    wordBankIdx: number;
    setWordBankIdx: (idx: number) => void;
}

export type RhymesWith = {
    syllable1: string[];
    syllable2: string[];
    syllable3: string[];
    syllable4: string[];
  };
  
  export type Thesaurus = {
    level1: string[];
    level2: string[];
    level3: string[];
    level4: string[];
  };

  export interface ITextToSpeechURLs {
    word: string;
    definition: string;
    usages: string[];
    pronunciation: string;
  }
  
  export type WordDefinition = {
    createdAt: string;
    definition: string;
    etymology: string;
    meaningId: string;
    partOfSpeech: string;
    pronunciation: string;
    rhymesWith: RhymesWith;
    thesaurus: Thesaurus;
    updatedAt: string;
    usages: string[];
    word: string;
    ttsUrls: ITextToSpeechURLs;
  };