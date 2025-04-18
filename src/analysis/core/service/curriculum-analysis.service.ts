import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ExternalAnalyseProcessing } from '../../../analysis/http/client/external-analyse-processing.client';
import { AnalysisModel } from '../model/analysis.model';

@Injectable()
export class CurriculumAnalysisService {
  constructor(
    private readonly externalAnalyseProcessing: ExternalAnalyseProcessing,
  ) {}

  analyseProcess = async (data: { resumeText: string; jobText: string }) => {
    const resumeCurriculum = this.sanitizeInputText(data.resumeText);
    const resumeJobText = this.sanitizeInputText(data.jobText);
    const response = await this.externalAnalyseProcessing.getAnalyse(
      resumeCurriculum,
      resumeJobText,
    );
    if (!response) {
      throw new InternalServerErrorException('Falha na análise do currículo.');
    }
    const sanitizedOutput = this.sanitizeOutputText(response.analysis);
    const analysisCreated = AnalysisModel.create({
      resumeText: resumeCurriculum,
      jobText: resumeJobText,
      analysisResult: {
        score: sanitizedOutput.score,
        classification: sanitizedOutput.classificacao,
        strongPoints: sanitizedOutput.pontos_fortes,
        pointsToImprove: sanitizedOutput.pontos_a_melhorar.map((item) => ({
          description: item.descricao,
          studyRecommendation: item.recomendacao_estudo,
        })),
        resumeSuggestions: sanitizedOutput.sugestoes_curriculo,
      },
    });
    const result = {
      analysisResult: {
        score: analysisCreated.analysisResult.score,
        classification: analysisCreated.analysisResult.classification,
        strongPoints: analysisCreated.analysisResult.strongPoints,
        pointsToImprove: analysisCreated.analysisResult.pointsToImprove,
        resumeSuggestions: analysisCreated.analysisResult.resumeSuggestions,
      },
      createdAt: analysisCreated.createdAt,
      recruiterView: {
        alignmentView: response.alignment,
        misalignmentView: response.misalignment,
        attentionView: response.attention,
      },
    };
    return result;
  };

  private sanitizeInputText(value: string): string {
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
  private sanitizeOutputText(value: string) {
    const regex = /{.*}/s;
    const jsonString = value.match(regex)?.[0].replace(/}\s*\{/g, '}, {');
    const objParsed = JSON.parse(jsonString);
    return objParsed;
  }
}
