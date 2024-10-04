import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [...compat.extends("eslint:recommended"), {
    languageOptions: {
        globals: {
            ...globals.node,
            it: false,
            describe: false,
        },

        ecmaVersion: 2020,
        sourceType: "module",

        parserOptions: {
            ecmaFeatures: {
                impliedStrict: true,
            },

            allowImportExportEverywhere: true,
        },
    },

    rules: {
        "no-eval": "error",
        "no-implied-eval": "error",
        "dot-notation": "error",
        eqeqeq: ["error", "smart"],
        "no-caller": "error",
        "no-extra-bind": "error",
        "no-unused-expressions": "error",
        "no-useless-call": "error",
        "no-useless-return": "error",
        radix: "warn",

        "no-unused-vars": ["error", {
            args: "none",
            vars: "all",
        }],

        "no-empty": ["error", {
            allowEmptyCatch: true,
        }],

        "no-control-regex": "off",
        "require-atomic-updates": "off",
        "no-async-promise-executor": "off",
        "brace-style": ["error", "1tbs"],
        "block-spacing": "error",
        "array-bracket-spacing": "error",
        "comma-spacing": "error",
        "comma-style": "error",
        "computed-property-spacing": "error",
        "no-trailing-spaces": "warn",
        "eol-last": "error",
        "func-call-spacing": "error",

        "key-spacing": ["warn", {
            mode: "minimum",
        }],

        indent: ["error", 4, {
            ignoreComments: true,
            ArrayExpression: "first",
            SwitchCase: 1,
        }],

        "linebreak-style": ["error", "unix"],

        quotes: ["error", "double", {
            avoidEscape: true,
        }],

        camelcase: ["error", {
            properties: "always",
        }],

        semi: ["error", "always"],
        "unicode-bom": "error",

        "keyword-spacing": ["error", {
            before: true,
            after: true,
        }],

        "no-multiple-empty-lines": ["warn", {
            max: 2,
            maxEOF: 1,
            maxBOF: 0,
        }],

        "no-whitespace-before-property": "error",
        "operator-linebreak": ["error", "after"],
        "space-in-parens": "error",
        "no-var": "error",
        "prefer-const": "error",
    },
}, {
    files: ["test/**/*"],

    rules: {
        "no-unused-expressions": "off",
        "no-console": "off",
    },
}];
