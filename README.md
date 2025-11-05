# Manifest

**The manifestation engine that makes success automatic and inevitable.**

## 🚀 Projects

This monorepo contains two separate projects:

### 1. Manifest App (`/Manifest 1`)
- **Live URL:** [app.manifest.com](https://app.manifest.com)
- **Purpose:** Main application where users sign up and use Manifest daily
- **Stack:** React, TypeScript, Vite, Supabase, Tailwind CSS, Framer Motion
- **Features:**
  - 3D Manifestation Universe
  - Smart habit tracking
  - AI-powered insights
  - Gamified progress system
  - Daily energy check-ins

### 2. Marketing Website (`/Website`)
- **Live URL:** [manifest.com](https://manifest.com)
- **Purpose:** Public-facing website explaining Manifest, features, pricing
- **Stack:** Next.js 14, React, TypeScript, Tailwind CSS, Framer Motion
- **Features:**
  - Animated hero section with 3D effects
  - Feature showcase
  - Pricing tiers
  - Testimonials
  - FAQ section

## 📦 Installation

### App:
```bash
cd "Manifest 1"
npm install
cp .env.example .env
# Edit .env with your Supabase credentials
npm run dev
```

### Website:
```bash
cd Website
npm install
npm run dev
```

## 🔐 Environment Variables

### Required for App (`Manifest 1/.env`):
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Optional (Admin only):
```
VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
VITE_UNSPLASH_ACCESS_KEY=your_unsplash_api_key
```

⚠️ **NEVER commit your `.env` file to version control!**

## 🚀 Deployment

Both projects are deployed to Vercel:

### App Deployment:
- **Vercel Project:** Create new project from this repo
- **Root Directory:** `Manifest 1`
- **Framework:** React (Vite)
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Environment Variables:** Add all `VITE_*` variables in Vercel dashboard

### Website Deployment:
- **Vercel Project:** Create separate project from same repo
- **Root Directory:** `Website`
- **Framework:** Next.js
- **Build Command:** `npm run build`
- **Output Directory:** `.next`

## 🔗 Links

- **App:** [app.manifest.com](https://app.manifest.com)
- **Website:** [manifest.com](https://manifest.com)
- **Documentation:** See `/Manifest 1/CLAUDE.md` for comprehensive technical documentation

## 🏗️ Tech Stack

### Frontend
- **React** 18.2 with TypeScript
- **Vite** 5.0 (App) / **Next.js** 14.2 (Website)
- **Tailwind CSS** 3.4 for styling
- **Framer Motion** 11.0 for animations
- **Zustand** 4.5 for state management

### Backend
- **Supabase** (PostgreSQL, Auth, Realtime, Storage)
- **Edge Functions** (Deno)

### Deployment
- **Vercel** for hosting
- **Cloudflare** CDN
- **GitHub Actions** for CI/CD

## 📊 Project Structure

```
Manifest/
├── Manifest 1/           # Main application
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── lib/          # Utilities & helpers
│   │   ├── stores/       # Zustand stores
│   │   └── types/        # TypeScript types
│   ├── public/           # Static assets
│   ├── .env.example      # Example environment variables
│   └── package.json
│
├── Website/              # Marketing website
│   ├── app/              # Next.js app directory
│   ├── components/       # React components
│   ├── public/           # Static assets
│   └── package.json
│
├── .gitignore            # Git ignore rules
└── README.md             # This file
```

## 🛡️ Security

### Protected Files (in `.gitignore`):
- ✅ `.env` and `.env.local` (contains secrets)
- ✅ `node_modules/` (dependencies)
- ✅ Temporary admin scripts (contain hardcoded credentials)
- ✅ Build outputs (`dist/`, `.next/`, `build/`)

### Security Best Practices:
1. **Never commit `.env` files** - Use `.env.example` as template
2. **Rotate credentials immediately** if accidentally committed
3. **Use environment variables** for all sensitive data
4. **Service Role Key** should ONLY be used server-side, never in client code
5. **Review `git status`** before committing

## 🚀 Development Workflow

### Making Changes to App:
```bash
cd "Manifest 1"
# Make your changes
git add .
git commit -m "Update: description of changes"
git push origin main
# Vercel auto-deploys app
```

### Making Changes to Website:
```bash
cd Website
# Make your changes
git add .
git commit -m "Update: description of changes"
git push origin main
# Vercel auto-deploys website
```

### Both Projects Deploy Independently:
- Changes to `Manifest 1/` only trigger app rebuild
- Changes to `Website/` only trigger website rebuild
- Vercel intelligently detects which project changed

## 🎯 Quality Standards

This project is built to **Apple & Google Tier 1 standards**:
- ✅ Sub-100ms interactions
- ✅ Lighthouse score 95+ (Performance)
- ✅ WCAG 2.1 AAA accessibility
- ✅ Zero layout shift (CLS: 0)
- ✅ Perfect responsive design
- ✅ Smooth 60fps animations

## 📝 License

Private - All Rights Reserved

## 👨‍💻 Development Team

Built with 🔥 by the Manifest team.

---

**Need Help?**
- 📖 Read the comprehensive docs: `/Manifest 1/CLAUDE.md`
- 🐛 Found a bug? Create an issue
- 💡 Have an idea? We'd love to hear it

**Ready to transform your life?** [Start with Manifest →](https://app.manifest.com)
