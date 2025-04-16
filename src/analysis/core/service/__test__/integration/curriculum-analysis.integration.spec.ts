import { Test, TestingModule } from '@nestjs/testing';
import * as fs from 'fs';
import { CurriculumAnalysisService } from '../../curriculum-analysis.service';
import { ExternalAnalyseProcessing } from '../../../../http/client/external-analyse-processing.client';
import { ConfigModule } from '../../../../../config/config.module';
import * as path from 'path';

describe('Curriculum Processing', () => {
  let curriculumAnalysisService: CurriculumAnalysisService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [CurriculumAnalysisService, ExternalAnalyseProcessing],
    }).compile();

    curriculumAnalysisService = module.get<CurriculumAnalysisService>(
      CurriculumAnalysisService,
    );
  });

  it('get analyse curriculum', async () => {
    const input = {
      resumeText: fs.readFileSync(
        path.join(__dirname, '../fixtures/curriculum.fixture.txt'),
        'utf8',
      ),
      jobText: fs.readFileSync(
        path.join(__dirname, '../fixtures/resume-job.fixture.txt'),
        'utf8',
      ),
    };
    const output = await curriculumAnalysisService.analyseProcess(input);
    expect(output).toBeDefined();
    expect(output).toHaveProperty('analysisResult');
    expect(output).toHaveProperty('createdAt');
    expect(output.analysisResult).toHaveProperty('classification');
    expect(output.analysisResult).toHaveProperty('strongPoints');
    expect(output.analysisResult).toHaveProperty('pointsToImprove');
    expect(output.analysisResult).toHaveProperty('resumeSuggestions');
    expect(output.analysisResult.strongPoints).toHaveLength(5);
  }, 15000);
});
