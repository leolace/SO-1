import reactHooks from "eslint-plugin-react-hooks";
import eslintPrettier from "eslint-plugin-prettier/recommended";
import eslintReact from "eslint-plugin-react";
import eslintTypescript from "typescript-eslint";

export default eslintTypescript.config([
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      "react-hooks": reactHooks,
      react: eslintReact,
    },
    rules: {
      "react-hooks/rules-of-hooks": "error", // Checks rules of Hooks
      "react-hooks/exhaustive-deps": "warn", // Checks effect dependencies
    },
  },
  eslintTypescript.configs.recommended,
  eslintPrettier,
]);
