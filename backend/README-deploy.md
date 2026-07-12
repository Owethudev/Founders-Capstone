# Render deployment notes

1. Push this repository to GitHub.
2. In Render, create a Web Service from the repository.
3. Use the following settings:
   - Build Command: cd backend && npm install
   - Start Command: cd backend && npm start
4. Add these environment variables in Render:
   - PORT=10000
   - MONGODB_URI=<your atlas connection string>
   - JWT_SECRET=<strong random string>
   - JWT_EXPIRES_IN=7d
   - BCRYPT_SALT_ROUNDS=12
   - CORS_ORIGIN=https://your-frontend-url
5. Deploy.
