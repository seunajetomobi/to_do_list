TaskFlow — Warm & Lovely To‑Do App

A minimal, client-side to‑do list app with a warm visual theme, delightful fonts, and fast UX.

This repository contains the TaskFlow single-page application built with React + TypeScript and Vite.

Key features
- Local-only storage using `localStorage` (no backend required).
- Rich-text comments for tasks (TipTap editor, lazy-loaded to reduce initial bundle).
- Multiple lists, priorities, due dates, bulk actions, and accessibility improvements.
- Deploy scripts for GitHub Pages and AWS S3, plus a GitHub Actions workflow for CI/CD.

Quick start (development)
1. Install dependencies:

```bash
npm ci --legacy-peer-deps
```

2. Run the dev server:

```bash
npm run dev
# Open http://localhost:5173
```

Build & publish
- Build for production:

```bash
npm run build
```

- Build for GitHub Pages (relative base):

```bash
npm run build:pages
```

- Deploy to GitHub Pages (local):

```bash
npm run deploy:pages
```

- Deploy to AWS S3 (local):

```bash
export BUCKET=your-bucket-name
npm run deploy:aws
```

Continuous deployment
- A GitHub Actions workflow is included at `.github/workflows/deploy.yml`. Set these repository secrets to enable automatic S3 deploys:

  - `AWS_S3_BUCKET` — S3 bucket name
  - `AWS_REGION` — AWS region (e.g., eu-north-1)
  - `AWS_ACCESS_KEY_ID` — IAM access key ID
  - `AWS_SECRET_ACCESS_KEY` — IAM secret access key

Notes & recommendations
- The TipTap editor is lazy-loaded to keep the initial bundle small; a visual skeleton displays while it loads.
- If you want HTTPS for the S3 site or better caching/CDN, consider adding CloudFront in front of the bucket.
- Consider additional code-splitting or dependency trimming if you need smaller bundles.

Credits
- Built and styled for a warm, lovely experience.
# React + TypeScript + Vite

## Local setup

If you hit native binding or optional dependency errors during build/dev, run a clean reinstall:

npm uninstall vite @vitejs/plugin-react
npm install
npm install -D vite@^5.4.19 @vitejs/plugin-react@^4.4.1

Then start the app:

npm run dev

## Deploy to GitHub Pages

This repo is configured to deploy on push to main.

### 1) GitHub Pages

In your repository settings:

- Go to Settings > Pages
- Set Source to GitHub Actions

The workflow builds with:

- npm run build:pages

### 3) Push to trigger deploy

git add .
git commit -m "feat: bulk actions, responsive UI, and deployment setup"
git push origin main

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
