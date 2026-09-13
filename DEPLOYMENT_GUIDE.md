# Complete Guide to Deploying AI Resume Analyser on Render

This guide walks you step-by-step through deploying both your **Express Backend** and **React Frontend** on [Render](https://render.com).

---

## 📋 Prerequisites Checklist

Before you start, make sure you have:
1. **GitHub Account & Repo**: Your code pushed to a GitHub repository.
2. **Render Account**: Sign up for free at [render.com](https://render.com).
3. **MongoDB Atlas Database**:
   - Go to [MongoDB Atlas](https://cloud.mongodb.com/).
   - Go to **Security** > **Network Access** > **+ Add IP Address**.
   - Select **Allow Access From Anywhere** (`0.0.0.0/0`) and click **Confirm**.
     > ⚠️ **Important**: Render free tier services have dynamic IP addresses. If you don't allow `0.0.0.0/0`, your backend will not be able to connect to MongoDB!
   - Copy your MongoDB connection string (e.g. `mongodb+srv://<user>:<password>@cluster...`).
4. **OpenRouter API Key**:
   - Sign up at [OpenRouter](https://openrouter.ai/) and generate an API key at [openrouter.ai/keys](https://openrouter.ai/keys).
5. **JWT Secret**:
   - Any strong random secret string (e.g. `my_super_secure_jwt_secret_key_12345`).

---

## 🚀 Method 1: 1-Click Deployment via Render Blueprint (Recommended)

This repository includes a pre-configured `render.yaml` Blueprint that automatically sets up both your Backend Web Service and Frontend Static Site with the URLs connected together.

### Step 1: Push your latest changes to GitHub
```bash
git add .
git commit -m "Configure project for Render deployment"
git push origin main
```

### Step 2: Create Blueprint in Render
1. Log in to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** (top right) and select **Blueprint**.
3. Connect your GitHub repository: `AI-Resume-Analyser`.
4. Render will detect `render.yaml` and list two services to create:
   - `ai-resume-analyser-backend` (Web Service)
   - `ai-resume-analyser-frontend` (Static Site)
5. Fill in the required environment variables prompted by Render:
   - `MONGO_URI`: Your MongoDB Atlas connection URI
   - `JWT_SECRET`: Your secret string
   - `OPENROUTER_API_KEY`: Your OpenRouter API key (`sk-or-v1-...`)
   - `OPENROUTER_MODEL`: `openai/gpt-4o-mini` (or leave default)
6. Click **Apply**.
7. Render will build and deploy both services!

---

## 🛠️ Method 2: Manual Setup via Render Dashboard

If you prefer to configure each service manually or don't use Blueprints:

### Part A: Deploy the Backend (Web Service)

1. In Render Dashboard, click **New +** > **Web Service**.
2. Select your GitHub repository.
3. Configure the settings:
   - **Name**: `ai-resume-backend` (or any name you like)
   - **Region**: Select closest to your users (e.g., Oregon or Frankfurt)
   - **Branch**: `main`
   - **Root Directory**: `Backend`  *(Crucial!)*
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: `Free`
4. Add **Environment Variables** (click **Add Environment Variable**):
   | Key | Value |
   |---|---|
   | `PORT` | `10000` |
   | `NODE_ENV` | `production` |
   | `MONGO_URI` | `mongodb+srv://<username>:<password>@...` |
   | `JWT_SECRET` | `your_secret_key` |
   | `OPENROUTER_API_KEY` | `sk-or-v1-...` |
   | `OPENROUTER_MODEL` | `openai/gpt-4o-mini` |
5. Click **Create Web Service**.
6. Wait for deployment to finish. Once live, copy your backend URL:
   - Example: `https://ai-resume-backend.onrender.com`
   - Test it by visiting `https://ai-resume-backend.onrender.com/health` in your browser. You should see `{"status":"ok", ...}`.

---

### Part B: Deploy the Frontend (Static Site)

1. In Render Dashboard, click **New +** > **Static Site**.
2. Select the same GitHub repository.
3. Configure the settings:
   - **Name**: `ai-resume-frontend`
   - **Branch**: `main`
   - **Root Directory**: `ai-resume-analyser`  *(Crucial!)*
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Add **Environment Variable**:
   | Key | Value |
   |---|---|
   | `VITE_API_URL` | Your backend URL from Part A (e.g., `https://ai-resume-backend.onrender.com`) |
5. Configure **Redirects / Rewrites** (under settings):
   - Click **Add Rewrite / Redirect Rule**:
     - **Type**: `Rewrite`
     - **Source Path**: `/*`
     - **Destination**: `/index.html`
   > ℹ️ This rewrite is essential for React Router so refreshing pages like `/history` or `/login` won't return a 404 error!
6. Click **Create Static Site**.
7. Once deployed, open your frontend URL to use the app!

---

## ⚡ Method 3: Single Unified Web Service (Alternative)

If you only want to manage **one single service** on Render:

1. Click **New +** > **Web Service**.
2. Leave **Root Directory** blank (uses root).
3. **Build Command**: `npm run build`
4. **Start Command**: `npm start`
5. **Environment Variables**:
   - `MONGO_URI`, `JWT_SECRET`, `OPENROUTER_API_KEY`, `NODE_ENV=production`
   - `PORT=10000`
6. The Express server will automatically serve both the API endpoints and the React frontend static build from `ai-resume-analyser/dist` on the same URL!

---

## 🔍 Common Issues & Solutions

### 1. MongoDB Connection Timeout (`ECONNRESET` / ServerSelectionTimeout)
- **Cause**: MongoDB Atlas is blocking Render's IP address.
- **Fix**: In MongoDB Atlas -> Network Access, ensure `0.0.0.0/0` is added to the IP Whitelist.

### 2. "Page Not Found (404)" when refreshing the frontend
- **Cause**: Single-page apps (React Router) require server rewrites so subroutes are served by `index.html`.
- **Fix**: In your Frontend Static Site settings on Render, add a Rewrite rule from `/*` to `/index.html`.

### 3. First request is very slow (Cold Start)
- **Notice**: On Render's Free tier, web services spin down after 15 minutes of inactivity. The first request after sleep takes 30-50 seconds to wake up. Subsequent requests are fast.

### 4. OpenRouter 401 Unauthorized / Insufficient Credits
- Ensure `OPENROUTER_API_KEY` is pasted correctly without extra spaces or quotes.
- Verify your OpenRouter account has active balance or credit.
