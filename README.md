# Wild Poise – Premium Unisex Apparel & Casual Shirts Catalog

A modern, highly-responsive fashion catalog web app built for **Wild Poise**. Backed by **Firebase Firestore** for real-time inventory management and optimized for continuous deployment to **Vercel** via **GitHub**.

---

## 🌟 Key Features

- **Firebase Firestore Integration**: Real-time sync with database fallback mode and 1-click catalog seeding.
- **Dual View Layouts**: Seamless toggle between Home Landing view and Etcetera-style Collections Catalog.
- **Multi-channel Checkout**: Quick links to Shopee, Tokopedia, and direct WhatsApp ordering.
- **Full Responsive Design**: Mobile-friendly navigation with Tailwind CSS.
- **Production Ready**: Built with Vue 3, TypeScript, Vite, and Vercel SPA routing (`vercel.json`).

---

## 🚀 Quick Start (Local Development)

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure Firebase (Optional)**:
   Create a `.env.local` file in the root directory (refer to `.env.example`):
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```
   *Note: If no Firebase keys are provided, the app will run gracefully using local fallback dataset.*

3. **Start Development Server**:
   ```bash
   npm run dev
   ```

---

## 🔥 Firebase Firestore Setup

1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. Add a **Web App** to your Firebase project.
3. Enable **Firestore Database** in test/production mode.
4. Copy your web app config keys into `.env.local` or Vercel Environment Variables.
5. In the app header, click **Seed Firestore** to automatically write initial catalog products into your Firestore `products` collection!

---

## 📦 Deployment to Vercel via GitHub

### Step 1: Initialize Git & Push to GitHub

Run the following commands in your project directory:

```bash
git init
git add .
git commit -m "feat: initial commit for Wild Poise catalog with Firebase Firestore & Vercel configuration"
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/wild-poise.git
git push -u origin main
```

### Step 2: Deploy on Vercel

1. Log in to [Vercel](https://vercel.com/) with your GitHub account.
2. Click **Add New** -> **Project**.
3. Import your `wild-poise` repository.
4. Expand **Environment Variables** and add your Firebase credentials:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
5. Click **Deploy**. Vercel will automatically build and publish your site! Any future push to `main` branch will trigger automatic deployment.

---

## 🛠 Tech Stack

- **Framework**: Vue 3 (Composition API with `<script setup>`)
- **Language**: TypeScript
- **Bundler**: Vite
- **Database**: Firebase Firestore
- **Styling**: Tailwind CSS
- **Icons**: Lucide Vue
- **Hosting**: Vercel

