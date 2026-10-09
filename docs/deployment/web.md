---
sidebar_position: 3
title: Web (Vercel)
---

# Déploiement — Web & Admin

## greenmap-web et greenmap-admin sur Vercel

### 1. Importer le repo

[vercel.com](https://vercel.com) → New Project → importer depuis GitHub.

### 2. Configurer le dossier racine

Vercel doit pointer sur le bon sous-dossier :
- Pour `greenmap-web` → Root Directory : `greenmap-web`
- Pour `greenmap-admin` → Root Directory : `greenmap-admin`

### 3. Variables d'environnement

Dans Vercel → Settings → Environment Variables :

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Déployer

```bash
git push origin main
```

Vercel rebuild automatiquement à chaque push.
