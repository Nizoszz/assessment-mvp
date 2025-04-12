import { randomUUID } from 'crypto';

export class AnalysisModel {
  analysisId: string;
  resumeText: string;
  jobText: string;
  analysisResult: AnalysisModelType;
  matchScore: string;
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
      matchScore: data.matchScore,
      createdAt: new Date(),
    });
  }
}

type AnalysisModelType = {
  classification: 'Baixo' | 'Médio' | 'Alto';
  strongPoints: string[];
  pointsToImprove: AnalysisModelTypePointsToImprove[];
  resumeSuggestions: string[];
};

type AnalysisModelTypePointsToImprove = {
  description: string;
  studyRecommendation: string;
};
