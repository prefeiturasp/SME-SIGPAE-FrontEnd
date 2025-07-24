import js from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import parserTypeScript from "@typescript-eslint/parser";
import pluginImport from "eslint-plugin-import";
import globals from "globals";

const cleanBrowserGlobals = Object.fromEntries(
  Object.entries(globals.browser).filter(([key]) => !key.includes(" "))
);

export default [
  js.configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
    languageOptions: {
      parser: parserTypeScript,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...cleanBrowserGlobals,
        Atomics: "readonly",
        SharedArrayBuffer: "readonly",
        global: "readonly",
        process: "readonly",
      },
    },
    plugins: {
      react: pluginReact,
      import: pluginImport,
    },
    settings: {
      react: {
        version: "detect",
      },
      "import/resolver": {
        node: {
          paths: ["src"],
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      },
    },
    rules: {
      eqeqeq: "error",
      yoda: "error",
      "react/prop-types": "off",
      "react/display-name": "off",
      "no-var": "error",
      "no-class-assign": "off",
      "react/no-string-refs": "off",
      "no-dupe-else-if": "off",
      "no-import-assign": "off",
      "no-setter-return": "off",
      "no-console": "error",
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "react/react-in-jsx-scope": "off",
    },
  },
  {
    files: [
      "**/__tests__/**/*.[jt]s?(x)",
      "**/?(*.)+(spec|test).[jt]s?(x)",
      "**/setupTests.[jt]s",
    ],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
];
