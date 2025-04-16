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
  ): Promise<AnalyseType | undefined> => {
    const resumeCurriculum = await this.resumeCurriculumGenerate(curriculumRaw);
    const matchScore = await this.generateScore(
      resumeCurriculum,
      resumeJobText,
    );

    if (!matchScore) {
      return undefined;
    }
    const matchGenerate = await this.matchGenerate(
      resumeCurriculum,
      resumeJobText,
    );
    if (!matchGenerate) {
      return undefined;
    }
    const extractRecruitView = this.extractRecruitView(
      matchGenerate.toString(),
    );
    if (!extractRecruitView) {
      return undefined;
    }
    return {
      analysis: matchGenerate.toString(),
      matchScore: matchScore.toString(),
      alignment: extractRecruitView.alignment,
      misalignment: extractRecruitView.misalignment,
      attention: extractRecruitView.attention,
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

  private matchGenerate = async (
    resumeCurriculum: string,
    resumeJobText: string,
  ) => {
    const init = this.configService.get('prompt').generateMatch;
    const prompt = `
      ${fs.readFileSync(init!, 'utf-8')}
      **Currículo Original:**  
      ${resumeCurriculum}

      **Descrição da Vaga:**  
      ${resumeJobText}
    `;

    const response = await this.generateResponse(prompt);
    return response;
  };
  private extractRecruitView = (data: string) => {
    try {
      const attempt1Regex =
        /### \*\*1\. PONTOS DE ALINHAMENTO\*\*([\s\S]*?)### \*\*2\. PONTOS DE DESALINHAMENTO\*\*([\s\S]*?)### \*\*3\. PONTOS DE ATENÇÃO\*\*([\s\S]*?)(?=(\n###|\n##|\n\*\*attemptE|\n---|$))/;
      const match = data.match(attempt1Regex);
      if (match) {
        const alignment = match[1].trim();
        const misalignment = match[2].trim();
        const attention = match[3].trim();

        return {
          alignment,
          misalignment,
          attention,
        };
      }
      const attemp2Regex =
        /### PONTOS DE ALINHAMENTO([\s\S]*?)### PONTOS DE DESALINHAMENTO([\s\S]*?)### PONTOS DE ATENÇÃO([\s\S]*?)(?=\n?\*\*PARTE 2|\Z)/;
      const attempt2 = data.match(attemp2Regex);
      if (attempt2) {
        const alignment = attempt2[1].trim();
        const misalignment = attempt2[2].trim();
        const attention = attempt2[3].trim();
        return {
          alignment,
          misalignment,
          attention,
        };
      }
      const attemp3Regex =
        /### 1\. PONTOS DE ALINHAMENTO([\s\S]*?)### 2\. PONTOS DE DESALINHAMENTO([\s\S]*?)### 3\. PONTOS DE ATENÇÃO([\s\S]*?)(?=\n?\*\*PARTE 2|\Z)/;
      const attempt3 = data.match(attemp3Regex);
      if (attempt3) {
        const alignment = attempt3[1].trim();
        const misalignment = attempt3[2].trim();
        const attention = attempt3[3].trim();

        return {
          alignment,
          misalignment,
          attention,
        };
      }
      const attemp4Regex =
        /### \*\*PONTOS DE ALINHAMENTO\*\*\n*([\s\S]*|\?)### \*\*PONTOS DE DESALINHAMENTO\*\*\n*([\s\S]*?)### \*\*PONTOS DE ATENÇÃO\*\*\n*([\s\S]*?)(?=\n?-|\Z)/;
      const attempt4 = data.match(attemp4Regex);
      if (attempt4) {
        const alignment = attempt4[1].trim();
        const misalignment = attempt4[2].trim();
        const attention = attempt4[3].trim();
        return {
          alignment,
          misalignment,
          attention,
        };
      }
    } catch (error) {
      console.error('Erro ao extrair dados:', error);
      return null;
    }
  };
}

type AnalyseType = {
  analysis: string;
  matchScore: string;
  alignment: string;
  misalignment: string;
  attention: string;
};
