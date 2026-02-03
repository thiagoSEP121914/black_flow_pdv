// eslint.config.js
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-plugin-prettier";

export default [
    // 🔥 IGNORE GLOBAL
    {
        ignores: ["dist/**", "node_modules/**"],
    },

    // Base JS
    js.configs.recommended,

    // TypeScript
    ...tseslint.configs.recommended,

    {
        files: ["**/*.ts"],

        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
        },

        plugins: {
            "@typescript-eslint": tseslint.plugin,
            prettier,
        },

        rules: {
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "@typescript-eslint/no-explicit-any": "off",

            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    varsIgnorePattern: "^_",
                    argsIgnorePattern: "^_",
                    caughtErrorsIgnorePattern: "^_",
                },
            ],

            "prettier/prettier": "error",

            "padding-line-between-statements": [
                "error",
                { blankLine: "always", prev: "*", next: "return" },

                { blankLine: "always", prev: "*", next: "if" },
                { blankLine: "always", prev: "if", next: "*" },

                { blankLine: "always", prev: "*", next: "for" },
                { blankLine: "always", prev: "for", next: "*" },

                { blankLine: "always", prev: "*", next: "while" },
                { blankLine: "always", prev: "while", next: "*" },

                { blankLine: "always", prev: "*", next: "function" },
                { blankLine: "always", prev: "function", next: "*" },
            ],
        },
    },
    {
        files: ["**/*.cjs"],
        languageOptions: {
            sourceType: "commonjs",
        },
    },
];
