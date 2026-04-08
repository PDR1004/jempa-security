import { loadEnvConfig } from '@next/env'
 
const projectDir = process.cwd()
loadEnvConfig(projectDir)

export const environment = {
  credentials: {
    groq: process.env.groq_api_key,
  }
};