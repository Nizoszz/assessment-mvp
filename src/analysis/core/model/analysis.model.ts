import { randomUUID } from 'crypto';

export class AnalysisModel {
  analysisId: string;
  resumeText: string;
  jobText: string;
  analysisResult: AnalysisModelType;
  createdAt: Date;
  constructor(data: AnalysisModel) {
    Object.assign(this, data);
  }
  static create(
    data: Omit<AnalysisModel, 'analysisId' | 'createdAt'>,
  ): AnalysisModel {
    const id = randomUUID();
    return new AnalysisModel({
      analysisId: id,
      resumeText: data.resumeText,
      jobText: data.jobText,
      analysisResult: data.analysisResult,
      createdAt: new Date(),
    });
  }
}

type AnalysisModelType = {
  score: number;
  classification: 'Baixo' | 'Médio' | 'Alto';
  strongPoints: string[];
  pointsToImprove: AnalysisModelTypePointsToImprove[];
  resumeSuggestions: string[];
};

type AnalysisModelTypePointsToImprove = {
  description: string;
  studyRecommendation: string;
};
