
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SerieEscolar } from '../types/exam';
import { serieLabels, getAgeRange, getSchoolLevel } from '../utils/seriesUtils';
import { useGeminiConfig } from '../context/GeminiConfigContext';
import { generateExamWithGemini } from '../services/geminiService';
import { storageService } from '../services/storageService';
import { Button } from '../components/ui/Button';
import { LoadingOverlay } from '../components/feedback/LoadingOverlay';
import { BrainCircuit, BookOpen, Target, FileText, AlertTriangle } from 'lucide-react';

export const NovaProvaPage: React.FC = () => {
  const { config, isConfigured } = useGeminiConfig();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    serie: '6_ano_fundamental' as SerieEscolar,
    disciplina: '',
    objetivo: '',
    conteudoBase: '',
    nivelDificuldade: 'media' as 'baixa' | 'media' | 'alta'
  });

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConfigured) {
      setError("Configure sua chave de API do Gemini antes de continuar.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const generated = await generateExamWithGemini({
        ...formData,
        conteudoBase: [formData.conteudoBase],
        apiKey: config.apiKey,
        modelName: config.model
      });

      const newExam = {
        ...generated,
        id: crypto.randomUUID(),
        title: formData.title,
        disciplina: formData.disciplina,
        serie: formData.serie,
        objetivo: formData.objetivo,
        conteudoBase: [formData.conteudoBase],
      };

      storageService.saveExam(newExam as any);
      navigate(`/provas/${newExam.id}`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Ocorreu um erro ao gerar a prova. Verifique sua chave de API e tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pb-12">
      {isLoading && <LoadingOverlay message="O Gemini está processando seu conteúdo e elaborando 40 questões pedagógicas... Por favor, não feche esta aba." />}

      <header className="mb-10 text-center max-w-2xl mx-auto">
        <div className="inline-flex p-3 rounded-2xl bg-indigo-100 text-indigo-600 mb-4">
          <BrainCircuit size={40} />
        </div>
        <h1 className="text-4xl font-black text-slate-800 mb-2">Criar Prova de Estudo</h1>
        <p className="text-slate-500">Utilize inteligência artificial para gerar materiais didáticos personalizados baseados no seu conteúdo.</p>
      </header>

      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <AlertTriangle className="shrink-0" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleGenerate} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white p-8 rounded-3xl shadow-lg border border-slate-200 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><FileText size={20} /></div>
              <h2 className="text-xl font-bold text-slate-800">Conteúdo Base</h2>
            </div>
            <p className="text-sm text-slate-500">
              Cole abaixo o texto, tópicos ou resumos que servirão de base para a prova.
            </p>
            <textarea
              required
              value={formData.conteudoBase}
              onChange={(e) => setFormData({ ...formData, conteudoBase: e.target.value })}
              className="w-full h-80 px-4 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none text-slate-700 font-serif leading-relaxed"
              placeholder="Ex: O Ciclo da Água compreende quatro etapas principais..."
            />
          </section>
        </div>

        <div className="space-y-8">
          <section className="bg-white p-8 rounded-3xl shadow-lg border border-slate-200 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Target size={20} /></div>
              <h2 className="text-xl font-bold text-slate-800">Definições</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Título da Prova</label>
                <input
                  required
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Simulado de Ciências"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Série / Ano</label>
                <select
                  value={formData.serie}
                  onChange={(e) => setFormData({ ...formData, serie: e.target.value as SerieEscolar })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {Object.entries(serieLabels).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
                <div className="mt-2 flex gap-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    {getAgeRange(formData.serie)}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    {getSchoolLevel(formData.serie)}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Disciplina</label>
                <input
                  required
                  type="text"
                  value={formData.disciplina}
                  onChange={(e) => setFormData({ ...formData, disciplina: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Ex: Geografia"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Objetivo Pedagógico</label>
                <textarea
                  required
                  rows={2}
                  value={formData.objetivo}
                  onChange={(e) => setFormData({ ...formData, objetivo: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                  placeholder="Ex: Revisar conceitos de sustentabilidade e ecossistemas"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Nível de Dificuldade</label>
                <div className="flex bg-slate-100 p-1 rounded-xl">
                  {['baixa', 'media', 'alta'].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setFormData({ ...formData, nivelDificuldade: lvl as any })}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg capitalize transition-all ${formData.nivelDificuldade === lvl ? 'bg-white shadow text-indigo-600' : 'text-slate-500'}`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full py-4 text-lg" isLoading={isLoading}>
              Gerar Prova com IA
            </Button>
            <p className="text-[10px] text-center text-slate-400 uppercase tracking-widest font-bold">
              Gera 40 questões estilo ENEM
            </p>
          </section>
        </div>
      </form>
    </div>
  );
};
