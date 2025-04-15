import { z } from 'zod';

export const environmentSchema = z.enum(['test', 'development', 'production']);

export const databaseSchema = z.object({
  host: z.string(),
  database: z.string(),
  password: z.string(),
  port: z.coerce.number(),
  url: z.string().startsWith('postgresql://'),
  username: z.string(),
});

export const groqApiSchema = z.object({
  key: z.string(),
});

export const promptSchema = z.object({
  generateMatch: z.string().startsWith('./prompts/'),
  generateScoreInit: z.string().startsWith('./prompts/'),
  generateScoreFinal: z.string().startsWith('./prompts/'),
  resumeCurriculumInit: z.string().startsWith('./prompts/'),
  resumeCurriculumFinal: z.string().startsWith('./prompts/'),
});

export const configSchema = z.object({
  env: environmentSchema,
  database: databaseSchema,
  port: z.coerce.number().positive().int(),
  prompt: promptSchema,
  groqApi: groqApiSchema,
});
