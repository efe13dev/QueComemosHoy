# Agent Guidelines

## Commands

- `npm run lint` - Run ESLint
- `npm run lint:fix` - Auto-fix ESLint issues
- `npm start` - Start development server
- `npm run android/ios/web` - Platform-specific dev servers

## Code Style

- **Imports**: Order: builtin → external → internal → parent → sibling → index → type. Separate groups with blank lines.
- **Formatting**: Prettier with `endOfLine: "auto"`. No trailing commas in JSX.
- **Console**: Only allow `console.error()` and `console.info()`.
- **Spacing**: Blank lines before returns/exports, after variable declarations, and around block statements.
- **Components**: Use PascalCase for components, camelCase for variables/functions.
- **Error Handling**: Use try-catch with async operations, log errors with `console.error()`.
