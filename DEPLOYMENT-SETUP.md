# Deployment setup

## 1. Render service

- Create a Web Service in Render using this repository.
- Set the build command to: `cd backend && npm install`
- Set the start command to: `cd backend && npm start`

## 2. Environment variables

Add these in Render for the backend service:

- `NODE_ENV=production`
- `PORT=10000`
- `JWT_SECRET=<strong secret>`
- `MONGODB_URI=<MongoDB Atlas connection string>`
- `CORS_ORIGIN=<frontend URL>`
- `JWT_EXPIRES_IN=7d`
- `BCRYPT_SALT_ROUNDS=12`

## 3. GitHub Actions secrets

Create these repository secrets in GitHub:

- `RENDER_STAGING_DEPLOY_HOOK_URL`
- `RENDER_PRODUCTION_DEPLOY_HOOK_URL`

## 4. Frontend deploy

- The repository now includes a frontend deployment workflow at `.github/workflows/frontend-deploy.yml`.
- Netlify deployment settings are also defined in `netlify.toml`.
- Set the frontend hosting provider to build from the repo root with `npm install` and `npm run build`.
- Set the environment variable `VITE_API_BASE_URL` to `https://founders-capstone-backend.onrender.com`.
- See NETLIFY-SETUP.md for the required Netlify secrets and site settings.

## 5. Deploy

- Run the staging workflow manually to trigger the staging deploy hook.
- Run the production workflow manually to trigger the production deploy hook.
- Run the frontend deployment workflow once the hosting provider is configured.
- See DEPLOYMENT-NEXT-STEPS.md for the exact sequence to follow.
