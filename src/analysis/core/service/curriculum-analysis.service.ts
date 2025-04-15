import { Injectable } from '@nestjs/common';
import { ExternalAnalyseProcessing } from '../../../analysis/http/client/external-analyse-processing.client';
import { AnalysisModel } from '../model/analysis.model';

@Injectable()
export class CurriculumAnalysisService {
  constructor(
    private readonly externalAnalyseProcessing: ExternalAnalyseProcessing,
  ) {}

  analyseProcess = async (data: { resumeText: string; jobText: string }) => {
    const resumeCurriculum = this.sanitizeText(data.resumeText);
    const resumeJobText = this.sanitizeText(data.jobText);
    const response = await this.externalAnalyseProcessing.getAnalyse(
      resumeCurriculum,
      resumeJobText,
    );
    if (!response) {
      throw new Error('Falha na análise do currículo.');
    }
    const regex = /{.*}/s;
    const jsonString = response.analysis.match(regex)?.[0];
    const obj = jsonString.replace(/}\s*\{/g, '}, {');
    const analysisObject = JSON.parse(obj);
    console.log(analysisObject);
    const analysisCreated = AnalysisModel.create({
      resumeText: resumeCurriculum,
      jobText: resumeJobText,
      analysisResult: {
        classification: analysisObject.classificacao,
        strongPoints: analysisObject.pontos_fortes,
        pointsToImprove: analysisObject.pontos_a_melhorar.map((item) => ({
          description: item.descricao,
          studyRecommendation: item.recomendacao_estudo,
        })),
        resumeSuggestions: analysisObject.sugestoes_curriculo,
      },
      matchScore: response.matchScore,
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
