---
sidebar_position: 1
title: Vue d'ensemble
---

# Déploiement — Vue d'ensemble

## Architecture de déploiement

| Composant | Hébergement |
|---|---|
| `greenmap-web` | Vercel |
| `greenmap-admin` | Vercel |
| `greenmap-mobile` | Expo Go (dev) / EAS Build (prod) |
| Backend Supabase | supabase.com (cloud) |
| Documentation | GitHub Pages |

## Variables d'environnement requises

Chaque app nécessite les clés Supabase :

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```
