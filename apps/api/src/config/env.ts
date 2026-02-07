import { config } from "dotenv";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";

const currentDir = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(currentDir, "../../.env") });

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().url(),
  EMAIL_PROVIDER: z.enum(["smtp"]).default("smtp"),
  EMAIL_FROM: z.string().email(),
  SMTP_HOST: z.string().min(1),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().min(1),
  SMTP_PASS: z.string().min(1),
  SMTP_SECURE: z.enum(["true", "false"]).default("false"),
  RSS_REFRESH_SCHEDULER_ENABLED: z.enum(["true", "false"]).default("false"),
  RSS_REFRESH_INTERVAL_MINUTES: z.coerce.number().int().min(1).default(30),
  RSS_REFRESH_BATCH_LIMIT: z.coerce.number().int().min(1).max(100).optional(),
  RSS_REFRESH_RUN_ON_START: z.enum(["true", "false"]).default("false")
});

export const env = envSchema.parse(process.env);
