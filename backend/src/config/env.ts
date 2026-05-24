import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default("5000"),
  PRIVATE_KEY: z.string(),
  RPC_URL: z.string(),
  CONTRACT_ADDRESS: z.string(),
  PINATA_JWT: z.string().optional(),
  PINATA_API_KEY: z.string().optional(),
  PINATA_SECRET_KEY: z.string().optional(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Invalid environment variables:\n", _env.error.format());
  process.exit(1);
}

export const env = _env.data;