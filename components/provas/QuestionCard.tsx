
import React, { useState } from 'react';
import { Question, AppMode } from '../../types/exam';
import { Badge } from '../ui/Badge';
import { CheckCircle2, XCircle, Info } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  index: number;
  mode: AppMode;
  onAnswer?: (questionId: string, alternativeId: string) => void;
  selectedAnswerId?: string;
  isCorrect?: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ 
  question, 
  index, 
  mode, 
  onAnswer, 
  selectedAnswerId,
  isCorrect 
}) => {
  const [showExplanation, setShowExplanation] = useState(mode === 'professor');

  const handleSelect = (altId: string) => {
    if (mode === 'aluno' && !selectedAnswerId && onAnswer) {
      onAnswer(question.id, altId);
      setShowExplanation(true);
    }
  };

  const isAnswered = !!selectedAnswerId;

  return (
    <div className={`p-6 bg-white rounded-xl shadow-sm border transition-all ${isAnswered ? 'border-slate-200' : 'border-transparent'}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
            {index + 1}
          </span>
          {question.competenciaOuHabilidade && (
            <Badge variant="info">{question.competenciaOuHabilidade}</Badge>
          )}
        </div>
        {mode === 'professor' && (
          <Badge variant="default">Modo Edição</Badge>
        )}
      </div>

      <p className="text-slate-800 font-medium text-lg leading-relaxed mb-6">
        {question.enunciado}
      </p>

      <div className="space-y-3 mb-6">
        {question.alternativas.map((alt) => {
          const isSelected = selectedAnswerId === alt.id;
          const isRightAnswer = alt.id === question.alternativaCorretaId;
          
          let stateStyles = "border-slate-200 hover:border-indigo-300 bg-slate-50";
          if (isAnswered) {
            if (isRightAnswer) stateStyles = "border-emerald-500 bg-emerald-50 text-emerald-800";
            else if (isSelected) stateStyles = "border-red-500 bg-red-50 text-red-800";
            else stateStyles = "border-slate-100 opacity-50 bg-slate-50";
          } else if (mode === 'professor' && isRightAnswer) {
            stateStyles = "border-emerald-500 bg-emerald-50 text-emerald-800";
          }

          return (
            <button
              key={alt.id}
              disabled={isAnswered && mode === 'aluno'}
              onClick={() => handleSelect(alt.id)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-3 ${stateStyles}`}
            >
              <span className={`font-bold mt-0.5 ${isRightAnswer && isAnswered ? 'text-emerald-600' : isSelected && !isRightAnswer ? 'text-red-600' : 'text-slate-400'}`}>
                {alt.label})
              </span>
              <span className="flex-1">{alt.texto}</span>
              {isAnswered && isRightAnswer && <CheckCircle2 className="text-emerald-600 shrink-0" size={20} />}
              {isAnswered && isSelected && !isRightAnswer && <XCircle className="text-red-600 shrink-0" size={20} />}
            </button>
          );
        })}
      </div>

      {showExplanation && (
        <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center gap-2 mb-2 text-indigo-700 font-bold">
            <Info size={18} />
            <h4>Orientação de Estudo</h4>
          </div>
          <p className="text-indigo-900 text-sm leading-relaxed">
            {question.explicacao}
          </p>
        </div>
      )}
    </div>
  );
};
