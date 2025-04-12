import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '../../../config/service/config.service';

@Injectable()
export class ExternalAnalyseProcessing {
  constructor(private readonly configService: ConfigService) {}
  getAnalyse = async (prompt: {
    model: string;
    temperature: number;
    max_tokens: number;
    messages: {
      role: string;
      content: string;
    }[];
  }): Promise<{ analysis: string } | undefined> => {
    try {
      const cohereToken = this.configService.get('cohereApi').key;
      const response = await axios.post(
        'https://api.cohere.ai/v2/chat',
        {
          model: prompt.model,
          messages: prompt.messages,
          max_tokens: prompt.max_tokens,
          temperature: prompt.temperature,
        },
        {
          headers: {
            Authorization: `Bearer ${cohereToken}`,
            'Content-Type': 'application/json',
          },
        },
      );
      const result = response.data.message.content[0].text;
      if (!result) throw new Error('No response from Cohere API');
      return {
        analysis: result?.trim() ?? '',
      };
    } catch (error) {
      throw error;
    }
  };
}
