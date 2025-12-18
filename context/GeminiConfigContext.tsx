
import React, { createContext, useContext, useState, useEffect } from 'react';
import { GeminiConfig } from '../types/settings';
import { storageService } from '../services/storageService';
import { AppMode } from '../types/exam';

interface GeminiConfigContextType {
  config: GeminiConfig;
  setConfig: (config: GeminiConfig) => void;
  appMode: AppMode;
  setAppMode: (mode: AppMode) => void;
  isConfigured: boolean;
}

const GeminiConfigContext = createContext<GeminiConfigContextType | undefined>(undefined);

export const GeminiConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfigState] = useState<GeminiConfig>({
    apiKey: '',
    model: 'gemini-3-flash-preview'
  });
  const [appMode, setAppMode] = useState<AppMode>('professor');

  useEffect(() => {
    const saved = storageService.getGeminiConfig();
    if (saved) {
      setConfigState(saved);
    }
  }, []);

  const setConfig = (newConfig: GeminiConfig) => {
    setConfigState(newConfig);
    storageService.saveGeminiConfig(newConfig);
  };

  const isConfigured = !!config.apiKey;

  return (
    <GeminiConfigContext.Provider value={{ config, setConfig, appMode, setAppMode, isConfigured }}>
      {children}
    </GeminiConfigContext.Provider>
  );
};

export const useGeminiConfig = () => {
  const context = useContext(GeminiConfigContext);
  if (!context) {
    throw new Error("useGeminiConfig must be used within a GeminiConfigProvider");
  }
  return context;
};
