**Project Overview**
- **Name**: TaskFlow (a lightweight React + TypeScript todo app)
- **Purpose**: Create and manage lists and tasks with priorities, due dates, simple tools (timer/stopwatch), light/dark theme, and local persistence.

**Quick Start**
- **Prerequisites**: Node 20.x, npm, and optionally AWS CLI (for S3 deploy) and GitHub CLI (optional).
- **Install dependencies**:
```bash
npm install
```
- **Run development server**:
```bash
npm run dev
```
- **Build for production**:
```bash
npm run build
```

**Files & Structure**
- **`index.html`**: App entry HTML.
- **`package.json`**: Scripts and deps. Useful scripts:
  - `npm run dev` — start Vite dev server
  - `npm run build` — build for production
  - `npm run build:pages` — build with relative base (for GitHub Pages)
  - `npm run deploy:pages` — build + deploy via `gh-pages` (npx)
  - `npm run deploy:aws` — build + sync `dist/` to S3 (requires `BUCKET` env var and `aws` CLI configured)
- **`src/main.tsx`**: React entry mount.
- **`src/App.tsx`**: Root component — list management, UI layout, handlers, and uses `useLists()` (see below).
- **`src/components/Sidebar.tsx`**: Sidebar UI (lists, new list, theme toggle).
- **`src/components/TodoCard.tsx`**: Task card UI (mark done, rename, comments via `RichTextEditor`).
- **`src/components/ToolsPanel.tsx`**: Timer and Stopwatch tool UI.
- **`src/components/RichTextEditor.tsx`**: Lazy-loaded rich text editor used for task comments (uses TipTap).
- **`src/utils/storage.ts`**: Persistence utilities: `loadLists()`, `saveLists()`, `loadTheme()`, `saveTheme()`, and `uuid()` fallback.
- **`src/index.css`**: Global styling, variables, and responsive rules.

**Key Functions & How The App Is Built**
- `useLists()` (defined in `src/App.tsx`): core state manager for all lists. It:
  - Loads saved lists from `localStorage` via `loadLists()`.
  - Provides `createList()`, `deleteList()`, `renameList()`.
  - Provides item operations: `addItem()`, `deleteItem()`, `deleteManyItems()`, `toggleItem()`, `renameItem()`, `updateComment()`.
  - Persists updates using `saveLists()` on every change.
- Theme handling:
  - `loadTheme()` reads `localStorage` and `saveTheme()` persists it.
  - `App` applies `.dark` class on `document.documentElement` to switch themes.
- Task rendering & filtering:
  - `visibleItems` is computed with `useMemo` using `query` and `sortBy` to filter and sort tasks.
  - Each task is rendered with `TodoCard` which supports edit, comment, select-for-bulk-delete, and done toggling.

**Components Explained**
- `Sidebar` (`src/components/Sidebar.tsx`):
  - Props: `lists`, `selectedId`, `onSelect`, `onNew`, `onRename`, `onDelete`, `theme`, `onToggleTheme`.
  - Supports creating/renaming/deleting lists, and toggling theme.
- `TodoCard` (`src/components/TodoCard.tsx`):
  - Renders a single task card with title, priority, due date, done state, and comment editor.
  - Uses lazy `RichTextEditor` for comments to keep initial bundle small.
- `ToolsPanel` (`src/components/ToolsPanel.tsx`):
  - Small toolset with `Timer` and `Stopwatch` components.
  - Timer uses `Notification` (if allowed) and simple countdown state.

**Persistence & IDs**
- All lists and tasks are saved in `localStorage` under key `todoapp_lists` (see `loadLists()` / `saveLists()` in `src/utils/storage.ts`).
- IDs are generated using `crypto.randomUUID()` when available, otherwise a secure fallback `uuid()` is used.

**Styling & Theme**
- Styling is in `src/index.css`. Theme toggling is CSS variable-based and controlled by the `.dark` class on the document root.

**How the Application Functions (user flow)**
- Create a new list with the **New List** button in the sidebar.
- Select a list; add tasks using the add form (title, priority, optional due date).
- Tasks show priority, due date, and allow:
  - Toggle Done (check button)
  - Edit title (pencil)
  - Delete
  - Add rich comments (lazy-loaded editor)
- Use search and sort controls to find and order tasks.
- Select tasks using each card checkbox and use **Delete Selected** to remove them in batch.

**Deploying**

GitHub Pages (recommended for static hosting)
- This repo already includes a GitHub Actions workflow to build and publish on push to `main`.
- Manual local deploy steps:
```bash
# Build with relative base for Pages
npm run build:pages

# Deploy via script (uses npx gh-pages)
npm run deploy:pages
```
- If `gh-pages` is not present, install it as a dev-dependency:
```bash
npm install --save-dev gh-pages
```
- The included workflow file `.github/workflows/deploy.yml` will also build and publish when you push to `main`.

AWS S3 static hosting
- Prereqs: `aws` CLI installed and configured (`aws configure`) with credentials that can write to the target S3 bucket.
- Build and upload (script expects `BUCKET` env var):
```bash
# build for production
npm run build

# set bucket and deploy
export BUCKET=my-static-site-bucket
npm run deploy:aws
```
- The `deploy:aws` script runs `npm run build` then `aws s3 sync dist/ s3://$BUCKET/ --delete`.

**Troubleshooting**
- Blank screen / HMR errors: open DevTools → Console. Common causes:
  - JSX/parse errors (fix indicated file/line in overlay)
  - Missing props on components (check console stack trace)
- If deployment fails on AWS, ensure `aws configure` was run and the IAM user has `s3:PutObject`, `s3:DeleteObject`, and `s3:ListBucket` on the target bucket.

**Development Notes & Tips**
- The rich text editor (`src/components/RichTextEditor.tsx`) is lazy-loaded to reduce initial bundle size.
- Theme preference is saved per-browser via `localStorage` (`todoapp_theme`).
- If you want to reset state during development, open DevTools → Application → Local Storage → remove `todoapp_lists`.

**Useful Links (files)**
- [src/App.tsx](src/App.tsx)
- [src/utils/storage.ts](src/utils/storage.ts)
- [src/components/Sidebar.tsx](src/components/Sidebar.tsx)
- [src/components/TodoCard.tsx](src/components/TodoCard.tsx)
- [src/components/ToolsPanel.tsx](src/components/ToolsPanel.tsx)
- [src/index.css](src/index.css)
- [package.json](package.json)

If you want, I can now:
- run a quick static check for obvious TypeScript/JS errors,
- or run the dev server and confirm the app mounts locally (tell me if you want me to run `npm run dev`).

---
Built and documented by the repository tooling assistant.
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
