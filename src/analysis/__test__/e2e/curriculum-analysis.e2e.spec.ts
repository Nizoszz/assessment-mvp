import { AnalysisModule } from '@analysisModule/analysis.module';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import * as fs from 'fs';
import * as path from 'path';

describe('MatchingAnalyser (e2e)', () => {
  let module: TestingModule;
  let app: INestApplication;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [AnalysisModule],
    }).compile();
    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await module.close();
    fs.rmSync('./uploads', { recursive: true, force: true });
  });

  it('/chat/matching-analysis (POST)', async () => {
    const input = {
      jobText: fs.readFileSync(
        path.join(__dirname, '../fixtures/resume-job.fixture.txt'),
        'utf8',
      ),
    };
    const output = await request(app.getHttpServer())
      .post('/chat/matching-analysis')
      .field('jobDescription', input.jobText)
      .attach('file', './src/analysis/__test__/fixtures/fake-curriculum.pdf');
    expect(output.body).toHaveProperty('createdAt');
    expect(output.body).toHaveProperty('recruiterView');
    expect(output.body).toHaveProperty('strongPoints');
    expect(output.body).toHaveProperty('pointsToImprove');
    expect(output.body).toHaveProperty('resumeSuggestions');
    expect(output.body.resumeSuggestions).toHaveLength(5);
  }, 15000);
});
