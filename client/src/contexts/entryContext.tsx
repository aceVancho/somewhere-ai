import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

const EntryContext = createContext<IEntryContextType | undefined>(undefined);

const useEntryContext = () => {
  const context = useContext(EntryContext);
  if (context === undefined) throw new Error("useEntryContext needs an EntryProvider");
  return context;
}

interface EntryProviderProps {
  children: ReactNode;
}

export const EntryProvider: React.FC<EntryProviderProps> = ({ children }) => {
  const [entries, setEntries] = useState<IEntry[]>([]);

  const setEntry = (entry: IEntry) => {
    setEntries(prevEntries => {
      const entryIndex = prevEntries.findIndex(e => e._id === entry._id);
      if (entryIndex !== -1) {
        const updatedEntries = [...prevEntries];
        updatedEntries[entryIndex] = entry;
        return updatedEntries;
      } else {
        return [...prevEntries, entry];
      }
    });
  };

  const removeEntry = (entryId: string) => {
    setEntries(prevEntries => prevEntries.filter(e => e._id !== entryId));
  };

  const removeEntries = (entryIds: string[]) => {
    setEntries(prevEntries => prevEntries.filter(e => !entryIds.includes(e._id)));
  };

  return (
    <EntryContext.Provider value={{ entries, setEntry, setEntries, removeEntry, removeEntries }}>
      {children}
    </EntryContext.Provider>
  );
}

export { useEntryContext };
