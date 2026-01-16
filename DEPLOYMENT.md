# Polresta Admin - Dashboard Admin

Dashboard admin untuk mengelola konten Polresta Sorong Kota.

## 🚀 Deployment

### Deploy ke Vercel

1. Push ke GitHub:
```bash
git add .
git commit -m "Update"
git push origin main
```

2. Vercel akan otomatis deploy

### Environment Variables

Tambahkan di Vercel Dashboard:

```env
VITE_API_URL=https://api.polrestasorongkota.com
VITE_STORAGE_URL=https://api.polrestasorongkota.com/storage
```

### Domain
- Production: `admin.polrestasorongkota.com`
- Preview: `polresta-admin.vercel.app`

## 📦 Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔗 Links

- [Vercel Dashboard](https://vercel.com/dashboard)
- [GitHub Repository](https://github.com/USERNAME/polresta-admin)
- [API Documentation](https://api.polrestasorongkota.com/docs)
