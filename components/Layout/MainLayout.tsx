
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useGeminiConfig } from '../../context/GeminiConfigContext';
import { 
  LayoutDashboard, 
  PlusCircle, 
  FileText, 
  Menu, 
  X,
  GraduationCap,
  UserCircle
} from 'lucide-react';

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { appMode, setAppMode } = useGeminiConfig();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Nova Prova', path: '/nova-prova', icon: PlusCircle, professorOnly: true },
    { label: 'Provas Salvas', path: '/provas', icon: FileText },
  ];

  const filteredNavItems = navItems.filter(item => !item.professorOnly || appMode === 'professor');

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <GraduationCap className="text-indigo-600" size={28} />
          <h1 className="font-bold text-xl text-slate-800">EduQuest IA</h1>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Sidebar */}
      <aside className={`
        fixed inset-0 z-40 transform transition-transform duration-300 
        md:sticky md:top-0 md:h-screen md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        w-56 bg-slate-900 text-slate-300 flex flex-col shrink-0
      `}>
        <div className="p-6 hidden md:flex items-center gap-2 border-b border-slate-800">
          <GraduationCap className="text-indigo-400" size={28} />
          <h1 className="font-bold text-lg text-white">EduQuest IA</h1>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm
                  ${isActive ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 text-slate-400'}
                `}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-800 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-semibold uppercase text-slate-500">Modo Ativo</span>
              <UserCircle size={14} className="text-slate-500" />
            </div>
            <div className="flex bg-slate-900 p-1 rounded-lg">
              <button
                onClick={() => setAppMode('professor')}
                className={`flex-1 py-1 text-[10px] rounded-md transition-all font-bold ${appMode === 'professor' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
              >
                PROF
              </button>
              <button
                onClick={() => setAppMode('aluno')}
                className={`flex-1 py-1 text-[10px] rounded-md transition-all font-bold ${appMode === 'aluno' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
              >
                ALUNO
              </button>
            </div>
          </div>
          <div className="mt-4 p-2 bg-indigo-900/30 border border-indigo-800/50 rounded-lg">
            <p className="text-[10px] leading-tight text-indigo-200">
              Powered by Gemini 3 IA
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>

      {/* Backdrop for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};
