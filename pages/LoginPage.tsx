
import React, { useState, useEffect } from 'react';
import { useGeminiConfig } from '../context/GeminiConfigContext';
import { storageService } from '../services/storageService';
import { Button } from '../components/ui/Button';
import { GraduationCap, UserCircle, School, BookOpen, History } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useGeminiConfig();
  const [name, setName] = useState('');
  const [role, setRole] = useState<'professor' | 'aluno'>('aluno');
  const [recentNames, setRecentNames] = useState<string[]>([]);

  useEffect(() => {
    setRecentNames(storageService.getRecentNames());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (trimmedName) {
      storageService.addRecentName(trimmedName);
      login({ name: trimmedName, role });
    }
  };

  const handleSelectRecent = (recentName: string) => {
    setName(recentName);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-500">
        <div className="bg-indigo-600 p-8 text-center text-white">
          <div className="inline-flex p-3 bg-white/20 rounded-2xl mb-4">
            <GraduationCap size={48} />
          </div>
          <h1 className="text-3xl font-black italic">EduQuest IA</h1>
          <p className="opacity-80 text-sm mt-2">Bem-vindo à plataforma de estudos inteligente</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700">Como podemos te chamar?</label>
            <input
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="Digite seu nome..."
            />
            
            {recentNames.length > 0 && (
              <div className="pt-2">
                <p className="text-[10px] font-black uppercase text-slate-400 mb-2 flex items-center gap-1">
                  <History size={12} /> Usados recentemente:
                </p>
                <div className="flex flex-wrap gap-2">
                  {recentNames.map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => handleSelectRecent(n)}
                      className="px-3 py-1 text-xs bg-slate-100 hover:bg-indigo-100 hover:text-indigo-600 text-slate-600 rounded-full transition-colors border border-transparent hover:border-indigo-200"
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700">Você é...</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole('aluno')}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${role === 'aluno' ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
              >
                <BookOpen size={24} />
                <span className="font-bold text-sm">Aluno</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('professor')}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${role === 'professor' ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
              >
                <School size={24} />
                <span className="font-bold text-sm">Professor</span>
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full py-4 text-lg">
            Acessar Plataforma
          </Button>
        </form>
      </div>
    </div>
  );
};
