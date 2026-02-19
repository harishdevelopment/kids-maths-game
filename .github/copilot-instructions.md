# Copilot Instructions

## Project Overview

Kids Maths Test is a React + TypeScript single-page application that lets children practice maths skills. Users can configure the test type (addition, subtraction, multiplication, division), digit range, number of questions, and time limit, then answer questions using an on-screen number pad. A score summary is shown at the end.

## Tech Stack

- **Framework**: React 19 with TypeScript
- **Build tool**: Vite
- **Styling**: Bootstrap 5 + Bootstrap Icons
- **Testing**: Vitest + React Testing Library + jsdom
- **Linting**: ESLint with typescript-eslint and react-hooks / react-refresh plugins
- **Deployment**: GitHub Pages via `gh-pages`

## Project Structure

```
src/
  components/        # React components (ConfigPanel, NumberPad, ScorePanel, UIControls)
  utils/             # Pure utility functions (math question generation, device type hook)
  test/              # Vitest test files mirroring src structure
  types.ts           # Shared TypeScript types (TestType, Question, TestConfig, etc.)
  constants.ts       # Shared constants
  App.tsx            # Root component with all game state
  main.tsx           # Entry point
```

## Common Commands

```sh
npm install          # Install dependencies
npm run dev          # Start Vite dev server (localhost:5173)
npm run build        # Type-check and build for production
npm run lint         # Run ESLint
npm run test         # Run Vitest in watch mode
npm run test:coverage # Run tests with coverage report
npm run deploy       # Build and deploy to GitHub Pages
```

## Code Conventions

- Use **named exports** for components (e.g. `export function ConfigPanel`).
- All React components live in `src/components/` and have a matching test file in `src/test/`.
- Shared types go in `src/types.ts`; shared constants go in `src/constants.ts`.
- Pure helper functions belong in `src/utils/`; React hooks are also placed there.
- Prefer functional components with React hooks; avoid class components.
- Use Bootstrap utility classes for layout and spacing rather than custom CSS where possible.
- Keep state management in `App.tsx`; child components receive data and callbacks as props.
- Write tests using Vitest (`describe`/`it`/`expect`) and React Testing Library (`render`, `screen`, `fireEvent`).

## Testing Notes

- Tests live in `src/test/` with filenames matching `<component>.test.tsx` or `<util>.test.ts`.
- The test setup file is `src/test/setup.ts` (imported automatically by Vitest).
- Run a single test file: `npx vitest run src/test/<file>.test.tsx`
