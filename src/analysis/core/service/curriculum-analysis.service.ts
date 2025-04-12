import { Injectable } from '@nestjs/common';
import { ExternalAnalyseProcessing } from '../../../analysis/http/client/external-analyse-processing.client';
import { ExternalEvaluationProcessing } from '../../../analysis/http/client/external-evaluation-processing.client';
import { AnalysisModel } from '../model/analysis.model';

@Injectable()
export class CurriculumAnalysisService {
  constructor(
    private readonly externalAnalyseProcessing: ExternalAnalyseProcessing,
    private readonly externalEvaluationProcessing: ExternalEvaluationProcessing,
  ) {}

  analyseProcess = async (data: { resumeText: string; jobText: string }) => {
    const sanitizedData = this.sanitizeText(data.resumeText);
    const sanitizedJobText = this.sanitizeText(data.jobText);
    const matchScore = await this.externalEvaluationProcessing.getMatchScore(
      sanitizedData,
      sanitizedJobText,
    );
    if (!matchScore) {
      throw new Error('Falha na avaliação de compatibilidade.');
    }
    const prompt = {
      model: 'command-a-03-2025',
      temperature: 0.5,
      max_tokens: 1024,
      messages: [
        {
          role: 'system',
          content: `
        Você é um assistente especializado em análise de currículos e recomendação profissional.
        Com base no currículo e na descrição da vaga, avalie o quão compatível é o perfil do candidato com a vaga.
        Use apenas o conteúdo fornecido abaixo.
        Responda exclusivamente em JSON **estritamente válido**:
        - Todas as chaves e strings devem estar entre aspas duplas.
        - Não inclua nenhum texto fora do JSON (nem comentários).
        - Use exatamente o formato exigido abaixo.`,
        },
        {
          role: 'user',
          content: `
            Currículo:
            ${sanitizedData}
            Descrição da vaga:
            ${sanitizedJobText}
            Score vetorial de compatibilidade: ${matchScore}
            Com base nas informações acima:
            - Gere um score de compatibilidade de 0 a 100.
            - Classifique como "Baixo", "Médio" ou "Alto".
            - Liste os 3  **maiores pontos de destaque** do candidato.
            - Liste os 3 principais conhecimentos ou habilidades que mais distanciam o candidato da vaga, com foco em impacto prático.
            - Para cada ponto a melhorar, sugira um recurso ou tema de estudo prático (ex: artigo, curso, tópico de aprofundamento).
            Além disso, identifique até 5 pontos onde o currículo pode ser adaptado para melhor alinhamento com a vaga.
            Traga sugestões claras de modificação ou adição de informações no currículo.
            Responda apenas no seguinte formato JSON:
            {
              "score": number,
              "classificacao": "Baixo" | "Médio" | "Alto",
              "pontos_fortes": [string, string, string],
              "pontos_a_melhorar": [
                {
                  "descricao": string,
                  "recomendacao_estudo": string
                },
                {
                  "descricao": string,
                  "recomendacao_estudo": string
                },
                {
                  "descricao": string,
                  "recomendacao_estudo": string
                }
              ],
              "sugestoes_curriculo": [
                string, string, string
              ]
            }
          `,
        },
      ],
    };
    const response = await this.externalAnalyseProcessing.getAnalyse(prompt);
    if (!response) {
      throw new Error('Falha na análise do currículo.');
    }

    const cleanJsonString = response.analysis
      ?.replace(/```json\n?/, '')
      .replace(/```$/, '')
      .trim();
    const analysisObject = JSON.parse(cleanJsonString ?? '{}');
    const analysisCreated = AnalysisModel.create({
      resumeText: sanitizedData,
      jobText: sanitizedJobText,
      analysisResult: {
        classification: analysisObject.classificacao,
        strongPoints: analysisObject.pontos_fortes,
        pointsToImprove: analysisObject.pontos_a_melhorar.map((item) => ({
          description: item.descricao,
          studyRecommendation: item.recomendacao_estudo,
        })),
        resumeSuggestions: analysisObject.sugestoes_curriculo,
      },
      matchScore: matchScore?.toString() ?? '',
    });
    return analysisCreated;
  };

  private sanitizeText(value: string): string {
    return value
      .replace(/\b\d{3}\.\d{3}\.\d{3}-\d{2}\b/g, '')
      .replace(/\b\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}\b/g, '')
      .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, '')
      .replace(/(\(?0?\d{2,3}\)?\s?-?)?9\d{4}-?\d{4}/g, '')
      .replace(/https?:\/\/[^\s]+/g, '')
      .replace(/^[\s•\-\*\u2022]+/gm, '')
      .replace(
        /\b(Rua|Avenida|Travessa|Rodovia|Estrada|Alameda|Praça|R\.|Av\.|Tv\.)\s+[^\d\n]+?\s+\d+[^\n–-]*([–-]\s*[^\n–-]+)*?/gi,
        '',
      );
  }
}
