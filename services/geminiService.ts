
import { GoogleGenAI, Type } from "@google/genai";
import { Exam, Question, SerieEscolar } from "../types/exam";
import { buildExamGenerationPrompt } from "../utils/examGenerationPromptBuilder";

interface GenerateParams {
  serie: SerieEscolar;
  disciplina: string;
  objetivo: string;
  conteudoBase: string[];
  nivelDificuldade: "baixa" | "media" | "alta";
  apiKey: string;
  modelName: string;
}

export async function generateExamWithGemini(params: GenerateParams): Promise<Partial<Exam>> {
  const ai = new GoogleGenAI({ apiKey: params.apiKey });
  const prompt = buildExamGenerationPrompt(params);

  const response = await ai.models.generateContent({
    model: params.modelName || 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                enunciado: { type: Type.STRING },
                alternativas: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      label: { type: Type.STRING, description: "A, B, C, D ou E" },
                      texto: { type: Type.STRING }
                    },
                    required: ["id", "label", "texto"]
                  }
                },
                alternativaCorretaId: { type: Type.STRING, description: "O ID da alternativa correta" },
                explicacao: { type: Type.STRING },
                competenciaOuHabilidade: { type: Type.STRING }
              },
              required: ["id", "enunciado", "alternativas", "alternativaCorretaId", "explicacao"]
            }
          }
        },
        required: ["questions"]
      }
    }
  });

  const resultText = response.text;
  if (!resultText) {
    throw new Error("Não foi possível obter resposta do Gemini.");
  }

  const parsed = JSON.parse(resultText);
  return {
    questions: parsed.questions as Question[],
    createdAt: new Date().toISOString()
  };
}
