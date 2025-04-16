import { ConfigException } from '../exception/config.exception';
import { configSchema } from './config.schema';
import { Config } from './config.type';

export const factory = (): Config => {
  const result = configSchema.safeParse({
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    database: {
      host: process.env.DATABASE_HOST,
      database: process.env.DATABASE_NAME,
      password: process.env.DATABASE_PASSWORD,
      port: process.env.DATABASE_PORT,
      url: process.env.DATABASE_URL,
      username: process.env.DATABASE_USERNAME,
    },
    groqApi: {
      key: process.env.GROQ_API_KEY,
    },
    prompt: {
      generateMatch: process.env.PROMPT_SYSTEM_GENERATE_MATCH,
      generateScoreInit: process.env.PROMPT_SYSTEM_GENERATE_SCORE_INIT,
      generateScoreFinal: process.env.PROMPT_SYSTEM_GENERATE_SCORE_FINAL,
      resumeCurriculumInit: process.env.PROMPT_SYSTEM_RESUME_CURRICULO_INIT,
      resumeCurriculumFinal: process.env.PROMPT_SYSTEM_RESUME_CURRICULO_FINAL,
    },
  });

  if (result.success) {
    return result.data;
  }

  throw new ConfigException(
    `Invalid application configuration: ${result.error.message}`,
  );
};
