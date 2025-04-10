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

export const openAiSchema = z.object({
  key: z.string().startsWith('sk-proj'),
});

export const configSchema = z.object({
  env: environmentSchema,
  database: databaseSchema,
  port: z.coerce.number().positive().int(),
});
