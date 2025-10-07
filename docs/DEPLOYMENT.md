# Deployment Guide

This guide will help you deploy the Job Application Bot to free hosting platforms.

## 🚀 Recommended: Render (Free Tier)

Render offers free hosting for both frontend and backend with these benefits:
- ✅ Free tier available
- ✅ Automatic deployments from GitHub
- ✅ Free PostgreSQL database
- ✅ SSL certificates included
- ✅ Easy environment variable management

### Step-by-Step Deployment to Render

#### Prerequisites
- GitHub account (already done ✓)
- Render account (free) - Sign up at https://render.com

---

### Part 1: Deploy Backend

1. **Go to Render Dashboard**
   - Visit https://dashboard.render.com
   - Click "New +" → "Web Service"

2. **Connect GitHub Repository**
   - Select "Connect a repository"
   - Choose `x0VIER/job-application-bot`
   - Click "Connect"

3. **Configure Backend Service**
   ```
   Name: job-application-bot-backend
   Region: Choose closest to you
   Branch: main
   Root Directory: backend
   Runtime: Node
   Build Command: npm install
   Start Command: node server.js
   ```

4. **Set Environment Variables**
   Click "Advanced" → "Add Environment Variable":
   ```
   PORT=5000
   OPENAI_API_KEY=your_openai_key_here
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_gmail_app_password
   DAILY_LIMIT=50
   ```

5. **Select Free Plan**
   - Instance Type: Free
   - Click "Create Web Service"

6. **Wait for Deployment**
   - Takes 2-5 minutes
   - You'll get a URL like: `https://job-application-bot-backend.onrender.com`
   - **Save this URL!** You'll need it for the frontend

---

### Part 2: Deploy Frontend

1. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Select same repository

2. **Configure Frontend Service**
   ```
   Name: job-application-bot-frontend
   Region: Same as backend
   Branch: main
   Root Directory: frontend
   Runtime: Node
   Build Command: pnpm install && pnpm build
   Start Command: pnpm start
   ```

3. **Set Environment Variables**
   ```
   NEXT_PUBLIC_API_URL=https://job-application-bot-backend.onrender.com
   NODE_ENV=production
   ```

4. **Select Free Plan**
   - Instance Type: Free
   - Click "Create Web Service"

5. **Get Your Live URL**
   - You'll get: `https://job-application-bot-frontend.onrender.com`
   - This is your live application! 🎉

---

### Part 3: Update Frontend API Calls

The frontend needs to know where the backend is:

1. **Create `.env.local` in frontend directory**
   ```env
   NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
   ```

2. **Update API calls** (if not already using env variable)
   
   In `frontend/app/page.tsx`, replace:
   ```javascript
   const API_URL = 'http://localhost:5000';
   ```
   
   With:
   ```javascript
   const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
   ```

3. **Commit and push changes**
   ```bash
   git add .
   git commit -m "Configure for production deployment"
   git push origin main
   ```

   Render will automatically redeploy!

---

## 🎯 Alternative: Vercel (Frontend) + Render (Backend)

### Deploy Frontend to Vercel

1. **Go to Vercel**
   - Visit https://vercel.com
   - Sign in with GitHub

2. **Import Project**
   - Click "Add New..." → "Project"
   - Select `job-application-bot`
   - Click "Import"

3. **Configure Build**
   ```
   Framework Preset: Next.js
   Root Directory: frontend
   Build Command: pnpm build
   Output Directory: .next
   Install Command: pnpm install
   ```

4. **Environment Variables**
   ```
   NEXT_PUBLIC_API_URL=https://your-render-backend.onrender.com
   ```

5. **Deploy**
   - Click "Deploy"
   - Get URL: `https://job-application-bot.vercel.app`

---

## 🔧 Alternative: Railway

Railway is another great option with $5 free credit per month.

### Deploy to Railway

1. **Sign up at Railway**
   - Visit https://railway.app
   - Sign in with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose `job-application-bot`

3. **Add Backend Service**
   - Click "Add Service" → "GitHub Repo"
   - Root Directory: `backend`
   - Start Command: `node server.js`

4. **Add Environment Variables**
   Same as Render configuration

5. **Add Frontend Service**
   - Click "Add Service" → "GitHub Repo"
   - Root Directory: `frontend`
   - Build Command: `pnpm install && pnpm build`
   - Start Command: `pnpm start`

6. **Generate Domain**
   - Click on each service
   - Settings → Generate Domain
   - Get your public URLs

---

## 🆓 Alternative: Fly.io

Fly.io offers free tier with generous limits.

### Deploy to Fly.io

1. **Install Fly CLI**
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Login**
   ```bash
   fly auth login
   ```

3. **Deploy Backend**
   ```bash
   cd backend
   fly launch --name job-bot-backend
   fly deploy
   ```

4. **Deploy Frontend**
   ```bash
   cd ../frontend
   fly launch --name job-bot-frontend
   fly deploy
   ```

---

## 📊 Comparison Table

| Platform | Frontend | Backend | Database | Free Tier | Auto Deploy |
|----------|----------|---------|----------|-----------|-------------|
| **Render** | ✅ | ✅ | ✅ | 750 hrs/mo | ✅ |
| **Vercel** | ✅ | Limited | ❌ | Unlimited | ✅ |
| **Railway** | ✅ | ✅ | ✅ | $5/month | ✅ |
| **Fly.io** | ✅ | ✅ | ✅ | 3 VMs | ✅ |
| **Netlify** | ✅ | ❌ | ❌ | 100 GB | ✅ |

**Recommendation:** Use **Render** for simplest setup with both frontend and backend.

---

## 🔐 Security Checklist

Before deploying:

- [ ] Add `.env` to `.gitignore` (already done ✓)
- [ ] Use environment variables for secrets
- [ ] Enable HTTPS (automatic on all platforms)
- [ ] Set strong API keys
- [ ] Configure CORS properly
- [ ] Add rate limiting
- [ ] Review security headers

---

## 🐛 Troubleshooting

### Backend won't start
- Check environment variables are set
- Verify Node version (18+)
- Check logs in platform dashboard

### Frontend can't reach backend
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check CORS settings in backend
- Ensure backend is running

### Build fails
- Check build logs
- Verify all dependencies in package.json
- Try building locally first

### Free tier limitations
- Render: Spins down after 15 min inactivity (first request takes ~30s)
- Vercel: 100 GB bandwidth/month
- Railway: $5 credit/month (~500 hours)

---

## 🚀 Post-Deployment

After deployment:

1. **Test the application**
   - Visit your frontend URL
   - Try searching for jobs
   - Verify backend connectivity

2. **Configure DNS (Optional)**
   - Buy a custom domain
   - Point it to your deployment
   - Most platforms support custom domains

3. **Set up monitoring**
   - Enable platform monitoring
   - Set up uptime checks
   - Configure error alerts

4. **Update README**
   - Add live demo link
   - Update deployment status badge

---

## 📝 Example: Complete Render Deployment

Here's a complete example with actual commands:

```bash
# 1. Ensure code is pushed to GitHub
git add .
git commit -m "Prepare for deployment"
git push origin main

# 2. Go to Render dashboard
# https://dashboard.render.com

# 3. Create backend service
# - Connect GitHub repo
# - Root: backend
# - Build: npm install
# - Start: node server.js
# - Add env variables

# 4. Create frontend service
# - Connect same repo
# - Root: frontend
# - Build: pnpm install && pnpm build
# - Start: pnpm start
# - Add NEXT_PUBLIC_API_URL

# 5. Wait for deployment (2-5 minutes)

# 6. Visit your live app!
# https://your-app.onrender.com
```

---

## 🎉 Success!

Your Job Application Bot is now live and accessible to anyone on the internet!

**Next steps:**
- Share your deployment URL
- Add it to your portfolio
- Update your GitHub README with live demo link
- Consider adding analytics

---

## 📞 Need Help?

- Check platform documentation
- Review deployment logs
- Open an issue on GitHub
- Join our Discord community

Happy deploying! 🚀
