import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CurriculumAnalysisService } from '../../../core/service/curriculum-analysis.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AnalyseRequestDto } from '../dto/request/analyse-request.dto';
import * as fs from 'fs';
import * as pdfParse from 'pdf-parse';
import { randomUUID } from 'crypto';
import { extname } from 'path';
import { AnalyseResultResponseDto } from '../dto/response/analyse-response.dto';
import { RestResponseInterceptor } from '../../interceptor/rest-response.interceptor';

@Controller('chat')
export default class MatchingAnalyzerController {
  constructor(private readonly service: CurriculumAnalysisService) {}
  @Post('matching-analysis')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          return cb(
            null,
            `${Date.now()}-${randomUUID()}${extname(file.originalname)}`,
          );
        },
      }),
      fileFilter: (_req, file, cb) => {
        const allowedMimes = ['application/pdf', 'text/plain'];
        const allowedExts = ['.pdf', '.txt'];
        if (
          !allowedMimes.includes(file.mimetype) &&
          !allowedExts.includes(extname(file.originalname))
        ) {
          return cb(new BadRequestException('Invalid file type'), false);
        }
        return cb(null, true);
      },
    }),
  )
  @UseInterceptors(new RestResponseInterceptor(AnalyseResultResponseDto))
  async analysis(
    @UploadedFile() file: Express.Multer.File,
    @Body() data: AnalyseRequestDto,
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    try {
      const pdfBuffer = fs.readFileSync(file.path);
      const parsed = await pdfParse(pdfBuffer);
      const resumeText = parsed.text.trim();
      const jobText = data.jobDescription;
      const result = await this.service.analyseProcess({
        resumeText,
        jobText,
      });

      return {
        classification: result.analysisResult.classification,
        strongPoints: result.analysisResult.strongPoints,
        pointsToImprove: result.analysisResult.pointsToImprove,
        resumeSuggestions: result.analysisResult.resumeSuggestions,
        matchScore: result.matchScore,
        createdAt: new Date(result.createdAt).toLocaleString('pt-BR'),
      };
    } finally {
      fs.unlink(file.path, (err) => {
        if (err) {
          console.error(`Erro ao remover o arquivo: ${file.path}`, err);
        }
      });
    }
  }
}
