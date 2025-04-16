import { Module } from '@nestjs/common';
import { CurriculumAnalysisService } from './core/service/curriculum-analysis.service';
import { ExternalAnalyseProcessing } from './http/client/external-analyse-processing.client';
import { MatchingAnalyzerController } from './http/rest/controller/matching-analyser.controller';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [CurriculumAnalysisService, ExternalAnalyseProcessing],
  controllers: [MatchingAnalyzerController],
  exports: [CurriculumAnalysisService],
})
export class AnalysisModule {}
