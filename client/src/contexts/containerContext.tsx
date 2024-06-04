import React, { createContext, useContext, useState, ReactNode } from 'react';

type ContainerContextType = {
  selectedOption: string;
  setSelectedOption: (option: string) => void;
};

const ContainerContext = createContext<ContainerContextType | undefined>(undefined);

export const ContainerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedOption, setSelectedOption] = useState<string>('ALL_ENTRIES');

  return (
    <ContainerContext.Provider value={{ selectedOption, setSelectedOption }}>
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
