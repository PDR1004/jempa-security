import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {                                                       //ini-evito el error de no-explicit-any
    files: ["application/command/AddMessageHandler.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },                                                    //fin- evito el error de no-explicit-any
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
