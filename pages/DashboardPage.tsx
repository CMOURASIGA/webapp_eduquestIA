
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { storageService } from '../services/storageService';
import { Exam } from '../types/exam';
import { EmptyState } from '../components/feedback/EmptyState';
import { Button } from '../components/ui/Button';
import { FilePlus, BookOpen, Clock, ChevronRight } from 'lucide-react';
import { serieLabels } from '../utils/seriesUtils';

export const DashboardPage: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setExams(storageService.getExams().sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ));
  }, []);

  if (exams.length === 0) {
    return (
      <div className="py-12">
        <EmptyState 
          title="Bem-vindo ao EduQuest IA"
          description="Você ainda não tem nenhuma prova gerada. Comece criando uma agora usando o poder da inteligência artificial."
          icon={FilePlus}
          actionLabel="Gerar minha primeira prova"
          onAction={() => navigate('/nova-prova')}
        />
      </div>
    );
  }

  const latestExams = exams.slice(0, 3);

  return (
    <div className="space-y-8 pb-12">
      <header>
        <h1 className="text-3xl font-bold text-slate-800">Seu Dashboard</h1>
        <p className="text-slate-500">Acompanhe suas provas e crie novos materiais de estudo.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-indigo-600 p-6 rounded-2xl text-white shadow-lg">
          <BookOpen className="mb-4 opacity-80" size={32} />
          <div className="text-3xl font-black mb-1">{exams.length}</div>
          <div className="text-indigo-100 text-sm font-medium">Provas Criadas</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <Clock className="mb-4 text-indigo-600 opacity-80" size={32} />
          <div className="text-3xl font-black mb-1 text-slate-800">
            {exams[0] ? new Date(exams[0].createdAt).toLocaleDateString('pt-BR') : 'N/A'}
          </div>
          <div className="text-slate-500 text-sm font-medium">Última Atualização</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="text-lg font-bold text-slate-800">Nova Prova?</div>
            <p className="text-slate-500 text-sm">Gere um novo simulado em segundos.</p>
          </div>
          <Button className="mt-4" onClick={() => navigate('/nova-prova')}>
            Começar Agora
          </Button>
        </div>
      </div>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800">Provas Recentes</h2>
          <Button variant="ghost" onClick={() => navigate('/provas')}>
            Ver todas <ChevronRight size={16} />
          </Button>
        </div>

        <div className="space-y-4">
          {latestExams.map((exam) => (
            <div 
              key={exam.id}
              onClick={() => navigate(`/provas/${exam.id}`)}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold">
                  {exam.questions.length}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                    {exam.title}
                  </h3>
                  <div className="flex gap-4 text-xs text-slate-400 font-medium">
                    <span>{exam.disciplina}</span>
                    <span>•</span>
                    <span>{serieLabels[exam.serie]}</span>
                  </div>
                </div>
              </div>
              <ChevronRight className="text-slate-300 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
