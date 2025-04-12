import { Module } from '@nestjs/common';
import { CurriculumAnalysisService } from './core/service/curriculum-analysis.service';
import { ExternalAnalyseProcessing } from './http/client/external-analyse-processing.client';
import { ExternalEvaluationProcessing } from './http/client/external-evaluation-processing.client';
import { PrismaModule } from '../prisma/prisma.module';
import MatchingAnalyzerController from './http/rest/controller/matching-analyser.controller';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [ConfigModule.forRoot(), PrismaModule],
  providers: [
    CurriculumAnalysisService,
    ExternalAnalyseProcessing,
    ExternalEvaluationProcessing,
  ],
  controllers: [MatchingAnalyzerController],
  exports: [CurriculumAnalysisService],
})
export class AnalysisModule {}
