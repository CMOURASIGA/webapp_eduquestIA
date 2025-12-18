
import React, { useState } from 'react';
import { useGeminiConfig } from '../context/GeminiConfigContext';
import { Button } from '../components/ui/Button';
import { Key, ShieldCheck, AlertCircle, ExternalLink } from 'lucide-react';

export const ConfigGeminiPage: React.FC = () => {
  const { config, setConfig } = useGeminiConfig();
  const [apiKey, setApiKey] = useState(config.apiKey);
  const [model, setModel] = useState(config.model);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setConfig({ apiKey, model });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Configurações</h1>
        <p className="text-slate-500">Configure sua integração com a API do Google Gemini.</p>
      </header>

      <form onSubmit={handleSave} className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 space-y-6">
        <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex items-start gap-4">
          <AlertCircle className="text-indigo-600 shrink-0 mt-1" size={20} />
          <div className="text-sm text-indigo-800">
            <p className="font-bold mb-1">Privacidade Garantida</p>
            <p>Sua chave de API é armazenada apenas no seu navegador (localStorage) e nunca é enviada para nossos servidores.</p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-700 flex items-center gap-2">
            <Key size={16} /> Gemini API Key
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Cole sua chave aqui..."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
            required
          />
          <a 
            href="https://aistudio.google.com/app/apikey" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-indigo-600 hover:underline flex items-center gap-1 mt-1"
          >
            Obter chave no Google AI Studio <ExternalLink size={10} />
          </a>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-700">
            Modelo do Gemini
          </label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="gemini-3-flash-preview">Gemini 3 Flash (Recomendado - Rápido)</option>
            <option value="gemini-3-pro-preview">Gemini 3 Pro (Alta Qualidade)</option>
            <option value="gemini-2.5-flash-latest">Gemini 2.5 Flash</option>
          </select>
        </div>

        <div className="pt-4">
          <Button type="submit" className="w-full" variant={saved ? 'secondary' : 'primary'}>
            {saved ? <><ShieldCheck size={20} /> Configurações Salvas!</> : 'Salvar Configurações'}
          </Button>
        </div>
      </form>
    </div>
  );
};
