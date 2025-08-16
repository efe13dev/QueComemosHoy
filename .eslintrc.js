module.exports = {
  root: true,
  extends: ["universe/native", "prettier"],
  rules: {
    // Consola solo permite error
    "no-console": ["warn", { allow: ["error", "info"] }],

    // Espaciado entre declaraciones
    "padding-line-between-statements": [
      "warn",
      // antes de return/export
      { blankLine: "always", prev: "*", next: ["return", "export"] },

      // después de declaraciones de variables
      { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
      {
        blankLine: "any",
        prev: ["const", "let", "var"],
        next: ["const", "let", "var"],
      },

      // separar imports del resto
      { blankLine: "always", prev: "import", next: "*" },
      { blankLine: "any", prev: "import", next: "import" },

      // separar bloques (if/for/while/switch/try/function/class)
      { blankLine: "always", prev: "*", next: "block-like" },
      { blankLine: "always", prev: "block-like", next: "*" },
    ],
    // Orden y separación de imports
    "import/order": [
      "warn",
      {
        groups: [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index",
          "object",
          "type",
        ],
        "newlines-between": "always",
        alphabetize: { order: "asc", caseInsensitive: true },
      },
    ],
  },
};
