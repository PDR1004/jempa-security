import { loadEnvConfig } from "@next/env";

const projectDir = process.cwd();
loadEnvConfig(projectDir);

const groqApiKey = process.env.GROQ_API_KEY;
const dniEncryptionKey = process.env.DNI_ENCRYPTION_KEY;

if (!groqApiKey) {
  throw new Error("Falta configurar GROQ_API_KEY en el archivo .env");
}

if (!dniEncryptionKey) {
  throw new Error("Falta configurar DNI_ENCRYPTION_KEY en el archivo .env");
}

export const environment = {
  credentials: {
    groq: groqApiKey,
    dniEncryption: dniEncryptionKey,
  },
} as const;
