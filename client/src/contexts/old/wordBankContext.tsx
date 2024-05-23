import { IWordBankContextType } from "@/types";
import React, { createContext, useContext, useState, ReactNode } from "react";

const WordBankContext = createContext<IWordBankContextType | undefined>(undefined)

// eslint-disable-next-line react-refresh/only-export-components
export const useWordBank = () => {
    const context = useContext(WordBankContext)
    if (context === undefined) throw new Error('useWordBank needs a provider.')
    return context;
}

interface WordBankProvider {
    children: ReactNode;
  }

export const WordBankProvider: React.FC<WordBankProvider> = ({ children }) => {
    const [word, setWord] = useState('');
    const [wordData, setWordData] = useState('')
    const [isLoading, setIsLoading] = useState(false);
    const [wordBankIdx, setWordBankIdx] = useState(0);

    return (
        <WordBankContext.Provider value={{ 
          word, setWord, wordData, setWordData, isLoading, setIsLoading,
          wordBankIdx, setWordBankIdx }}>
          {children}
        </WordBankContext.Provider>
      );
}