import { loadEnvConfig } from "@next/env";

const projectDir = process.cwd();
loadEnvConfig(projectDir);

const groqApiKey = process.env.GROQ_API_KEY;

if (!groqApiKey) {
  throw new Error("Falta configurar GROQ_API_KEY en el archivo .env");
}

export const environment = {
  credentials: {
    groq: groqApiKey,
  },
} as const;
