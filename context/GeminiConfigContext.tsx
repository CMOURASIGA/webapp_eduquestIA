
import React, { createContext, useContext, useState } from 'react';
import { AppMode } from '../types/exam';

interface AppContextType {
  appMode: AppMode;
  setAppMode: (mode: AppMode) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const GeminiConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appMode, setAppMode] = useState<AppMode>('professor');
  const [selectedModel, setSelectedModel] = useState('gemini-3-flash-preview');

  return (
    <AppContext.Provider value={{ appMode, setAppMode, selectedModel, setSelectedModel }}>
      {children}
    </AppContext.Provider>
  );
};

export const useGeminiConfig = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useGeminiConfig must be used within a GeminiConfigProvider");
  }
  return context;
};
