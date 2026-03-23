# React + TypeScript + Vite

## Local setup

If you hit native binding or optional dependency errors during build/dev, run a clean reinstall:

npm uninstall vite @vitejs/plugin-react
npm install
npm install -D vite@^5.4.19 @vitejs/plugin-react@^4.4.1

Then start the app:

npm run dev

## Deploy to GitHub Pages and AWS

This repo is configured to deploy on push to main.

### 1) GitHub Pages

In your repository settings:

- Go to Settings > Pages
- Set Source to GitHub Actions

The workflow builds with:

- npm run build:pages

### 2) AWS (S3 + optional CloudFront)

AWS deployment is automated end-to-end in CI:

- Builds app for root hosting
- Creates S3 bucket if it does not exist
- Configures S3 static website hosting and public-read policy
- Syncs files and cache-busts index.html
- Optionally invalidates CloudFront

Add these GitHub repository secrets:

- AWS_ROLE_TO_ASSUME (recommended, OIDC)

or

- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY

Optional (secret or repo variable):

- AWS_REGION (default: us-east-1)
- AWS_S3_BUCKET (if omitted, auto-generated as owner-repo-web)
- AWS_CLOUDFRONT_DISTRIBUTION_ID
- AWS_HEALTHCHECK_URL (override URL used by CI health checks)
- SLACK_WEBHOOK_URL (optional failure notification)

The workflow deploys with:

- npm run build:aws
- bash scripts/deploy-aws.sh

### 4) Hardening recommendations

Set these in GitHub for safer production deploys:

- Environment protection: require approvals for production environment
- Branch protection on main: require status checks to pass before merge
- Required checks: deploy_pages and deploy_aws
- Use OIDC role (AWS_ROLE_TO_ASSUME) instead of long-lived access keys

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
