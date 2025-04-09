import { randomUUID } from 'crypto';

export class AnalysisModel {
  analysisId: string;
  resumeText: string;
  jobText: string;
  analysis: string;
  matchScore: string;
  createdAt: Date;
  constructor(data: AnalysisModel) {
    Object.assign(data);
  }
  static create(
    data: Omit<AnalysisModel, 'analysisId' | 'createdAt'>,
  ): AnalysisModel {
    const id = randomUUID();
    return new AnalysisModel({
      analysisId: id,
      resumeText: data.resumeText,
      jobText: data.jobText,
      analysis: data.analysis,
      matchScore: data.matchScore,
      createdAt: new Date(),
    });
  }
}
