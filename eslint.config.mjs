import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      "@next/next/no-img-element": "off",
      "@next/next/no-html-link-for-pages": "off",

      "no-console": "error",
    },
  },
]);

export default eslintConfig;

// import js from "@eslint/js";
// import * as tseslint from "typescript-eslint";
// import nextPlugin from "@next/eslint-plugin-next";
// import importPlugin from "eslint-plugin-import";
// import reactCompiler from "eslint-plugin-react-compiler";
// import prettierConfig from "eslint-config-prettier";
// import globals from "globals";

// export default [

//   // Base JS recommendations (flat)
//   js.configs.recommended,

//   // TypeScript recommendations (flat)
//   ...tseslint.configs.recommended,
//   // If you want type-aware rules later, switch to:
//   // ...tseslint.configs.recommendedTypeChecked,
//   // and add languageOptions.parserOptions.project = ['./tsconfig.json']

//   {
//     files: [
//       "src/**/*.{js,jsx,ts,tsx}",
//       "app/**/*.{js,jsx,ts,tsx}",
//       "pages/**/*.{js,jsx,ts,tsx}",
//       "components/**/*.{js,jsx,ts,tsx}",
//     ],
//     plugins: {
//       import: importPlugin,
//       "@next/next": nextPlugin,
//       "react-compiler": reactCompiler,
//     },
//     settings: {
//       "import/resolver": {
//         typescript: {
//           project: "./tsconfig.json",
//         },
//       },
//     },
//     rules: {
//       // Next.js core-web-vitals without legacy compat
//       ...nextPlugin.configs["core-web-vitals"].rules,

//       // Your overrides
//       "@next/next/no-img-element": "off",
//       "@next/next/no-html-link-for-pages": "off",

//       "no-unreachable": "error",
//       "@typescript-eslint/no-unused-vars": ["error", { args: "none" }],
//       "no-unused-vars": "off",
//       "no-console": "error",
//       "import/no-unresolved": "error",
//       "@typescript-eslint/no-redeclare": "error",
//       "no-undef": "error",
//     },
//   },

//   // TS-only overrides
//   {
//     files: ["**/*.{ts,tsx}"],
//     rules: {
//       "no-undef": "off",
//     },
//   },

//   // Prettier compatibility (flat)
//   prettierConfig,
// ];
