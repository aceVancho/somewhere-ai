import React, { createContext, useContext, useState, ReactNode } from 'react';

type ContainerContextType = {
  selectedContainer: string;
  setSelectedContainer: (option: string) => void;
};

const ContainerContext = createContext<ContainerContextType | undefined>(undefined);

export const ContainerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedContainer, setSelectedContainer] = useState<string>('ALL_ENTRIES');

  return (
    <ContainerContext.Provider value={{ selectedContainer, setSelectedContainer }}>
      {children}
    </ContainerContext.Provider>
  );
};

export const useContainerContext = () => {
  const context = useContext(ContainerContext);
  if (context === undefined) {
    throw new Error('useContainerContext must be used within a ContainerProvider');
  }
  return context;
};
