import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

import reactCompiler from 'eslint-plugin-react-compiler';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript", "prettier"),
  {
    rules: {
      "@next/next/no-img-element": "off",
      "@next/next/no-html-link-for-pages": "off",
    },
  },
  {
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
    plugins: {
      'react-compiler': reactCompiler,
    },
    settings: {
      "import/resolver": {
        alias: {
          map: [["@kenstack", "./kenstack/src"], ["@", "./src"]],
          extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
        },
      },
    },    
    rules: {
      "prefer-const": "off",
      "@typescript-eslint/no-explicit-any": "off",      
      "no-unreachable": "error",
      "@typescript-eslint/no-unused-vars": ["error", { "args": "none" }],
      "no-unused-vars": "off",
      "@typescript-eslint/no-shadow": ["error", { "hoist": "all", "builtinGlobals": false }],
      "no-console": "error",
      "no-undef": "error",
      "import/no-unresolved": "error",

    }
  },
  {
    files: ["src/layouts/**/*", "src/tailwind-plugin/**/*", "src/lib/utils/taxonomyFilter.ts"],
    rules: {
      "@typescript-eslint/no-shadow": "off",
    },
  },  

 {
    languageOptions: {
      globals: { React: "readonly" },
    },
    files: ["**/*.{js,jsx,ts,tsx}"],
    // other settings...
  },  
];

export default eslintConfig;
