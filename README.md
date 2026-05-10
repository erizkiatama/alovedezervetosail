# Ezra & Salsa — Wedding Invitation

A mobile-first wedding invitation website built with Next.js 14, Tailwind CSS, and Framer Motion.

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) on your phone or browser.

### 3. Customize wedding details

Edit `lib/wedding-data.ts` to update names, date, venue, and other details.

---

## Deploy to Vercel (Recommended)

1. Push this project to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
3. Vercel auto-detects Next.js — just click **Deploy**
4. Add your custom domain in Vercel Dashboard → Settings → Domains

---

## Deploy to VPS (Nginx + PM2)

### Build the project

```bash
npm run build
```

### Install PM2

```bash
npm install -g pm2
```

### Start the app

```bash
pm2 start npm --name "wedding" -- start
pm2 save
pm2 startup
```

### Nginx config

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Then enable HTTPS with Certbot:

```bash
sudo certbot --nginx -d yourdomain.com
```

---

## Project Structure

```
app/
  page.tsx          → Envelope landing screen
  invitation/       → Main wedding invitation
  details/          → Event details + countdown
  gallery/          → Photo gallery
  layout.tsx        → Root layout + metadata
lib/
  wedding-data.ts   → All wedding info (edit this!)
styles/
  globals.css       → Global styles + fonts
```

## Stack

- **Next.js 14** (App Router)
- **Tailwind CSS**
- **Framer Motion** (animations)
- **Google Fonts** — Cinzel + Cormorant Garamond
