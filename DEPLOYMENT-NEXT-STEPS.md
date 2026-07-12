# Next deployment steps

1. Create or confirm the backend service on Render.
2. Add the backend environment variables listed in DEPLOYMENT-SETUP.md.
3. Copy the Render deploy hook URL into the GitHub repository secrets:
   - RENDER_STAGING_DEPLOY_HOOK_URL
   - RENDER_PRODUCTION_DEPLOY_HOOK_URL
4. Deploy the frontend to Netlify, Vercel, or Cloudflare Pages using the repo root.
5. Set the frontend environment variable:
   - VITE_API_BASE_URL=https://founders-capstone-backend.onrender.com
6. Trigger the GitHub Actions workflow for the frontend after the host is connected.
