import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '../../../config/service/config.service';

@Injectable()
export class ExternalEvaluationProcessing {
  constructor(private readonly configService: ConfigService) {}

  getMatchScore = async (
    resumeText: string,
    jobText: string,
  ): Promise<number | undefined> => {
    try {
      const cohereToken = this.configService.get('cohereApi').key;

      const response = await axios.post(
        'https://api.cohere.ai/v2/embed',
        {
          texts: [resumeText, jobText],
          model: 'embed-multilingual-v3.0',
          input_type: 'search_document',
          embedding_types: ['float'],
        },
        {
          headers: {
            Authorization: `Bearer ${cohereToken}`,
            'Content-Type': 'application/json',
          },
        },
      );
      const [resumeVector, jobVector] = response.data.embeddings.float;
      if (!resumeVector || !jobVector) return undefined;
      const score = this.cosineSimilarity(resumeVector, jobVector);
      return Math.round(score * 100);
    } catch (error) {
      console.error('[Cohere Embed Error]', error);
      return undefined;
    }
  };

  private cosineSimilarity(a: number[], b: number[]): number {
    const dot = a.reduce((acc, val, i) => acc + val * b[i], 0);
    const magA = Math.sqrt(a.reduce((acc, val) => acc + val * val, 0));
    const magB = Math.sqrt(b.reduce((acc, val) => acc + val * val, 0));
    return dot / (magA * magB);
  }
}
