import { Injectable } from '@nestjs/common';
import { ConfigService } from '../../../config/service/config.service';
import { ChatGroq } from '@langchain/groq';
import * as fs from 'fs';

@Injectable()
export class ExternalAnalyseProcessing {
  constructor(private readonly configService: ConfigService) {}
  getAnalyse = async (
    curriculumRaw: string,
    resumeJobText: string,
  ): Promise<{ analysis: string; matchScore: string } | undefined> => {
    const resumeCurriculum = await this.resumeCurriculumGenerate(curriculumRaw);
    const matchScore = await this.generateScore(
      resumeCurriculum,
      resumeJobText,
    );
    if (!matchScore) {
      return undefined;
    }
    const match = await this.matchGenerate(resumeCurriculum, resumeJobText);
    if (!match) {
      return undefined;
    }
    return {
      analysis: match.toString(),
      matchScore: matchScore,
    };
  };
  private generateResponse = async (prompt: string) => {
    const groqToken = this.configService.get('groqApi').key;
    const llm = new ChatGroq({
      apiKey: groqToken,
      model: 'llama-3.3-70b-versatile',
      temperature: 0.5,
    });
    const response = await llm.invoke(prompt);
    return response.content;
  };

  private resumeCurriculumGenerate = async (curriculumRaw: string) => {
    const init = this.configService.get('prompt').resumeCurriculumInit;
    const final = this.configService.get('prompt').resumeCurriculumFinal;
    const prompt = `
      ${fs.readFileSync(init!, 'utf-8')}
      # Currículo para análise:
      ${curriculumRaw}
      ${fs.readFileSync(final!, 'utf-8')}
    `;
    const response = await this.generateResponse(prompt);
    return response.toString();
  };

  private generateScore = async (
    resumeCurriculum: string,
    resumeJobText: string,
  ) => {
    const init = this.configService.get('prompt').generateScoreInit;
    const final = this.configService.get('prompt').generateScoreFinal;
    const prompt = `
      ${fs.readFileSync(init!, 'utf-8')}
      **Currículo do Candidato:**
      ${resumeCurriculum}
      **Vaga:**
      ${resumeJobText}
      ${fs.readFileSync(final!, 'utf-8')}
    `;
    let response = await this.generateResponse(prompt);
    let score: any = 0;
    let attempt = 0;
    while (attempt < 10) {
      response = await this.generateResponse(prompt);
      const scoreExtract = this.extractScore(response.toString());
      if (scoreExtract) {
        score = scoreExtract;
        return score;
      }
      attempt++;
    }
  };

  private extractScore = (data: string) => {
    const regex =
      /(?:Pontua[çc][ãa]o\s*(?:[Ff]inal|[Tt]otal)|[Nn]ota\s*[Ff]inal)\s*:?\s*\** ../i;
    const match = data.match(regex);
    if (match && match[0]) {
      if (match[0].includes('/')) {
        return parseInt(match[0].replace(/\/100\b/, '').slice(-2));
      }
      return parseInt(match[0].slice(-2));
    }
    return null;
  };

  private matchGenerate = (resumeCurriculum: string, resumeJobText: string) => {
    const init = this.configService.get('prompt').generateMatch;
    const prompt = `
      ${fs.readFileSync(init!, 'utf-8')}
      **Currículo Original:**  
      ${resumeCurriculum}

      **Descrição da Vaga:**  
      ${resumeJobText}
    `;

    const response = this.generateResponse(prompt);
    return response;
  };
}
