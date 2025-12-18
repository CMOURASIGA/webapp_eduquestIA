
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppMode, UserProfile } from '../types/exam';

interface AppContextType {
  appMode: AppMode;
  userName: string;
  userProfile: UserProfile | null;
  login: (profile: UserProfile) => void;
  logout: () => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const GeminiConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [selectedModel, setSelectedModel] = useState('gemini-3-flash-preview');

  useEffect(() => {
    const saved = localStorage.getItem('eduquest-user-profile');
    if (saved) {
      setUserProfile(JSON.parse(saved));
    }
  }, []);

  const login = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem('eduquest-user-profile', JSON.stringify(profile));
  };

  const logout = () => {
    setUserProfile(null);
    localStorage.removeItem('eduquest-user-profile');
  };

  return (
    <AppContext.Provider value={{ 
      appMode: userProfile?.role || 'professor', 
      userName: userProfile?.name || '',
      userProfile,
      login,
      logout,
      selectedModel, 
      setSelectedModel 
    }}>
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
