---
sidebar_position: 2
title: Supabase
---

# Déploiement — Supabase

## 1. Créer le projet

Aller sur [supabase.com](https://supabase.com) → New Project → choisir la région la plus proche (Europe West).

## 2. Appliquer les migrations

```bash
cd greenmap-backend
supabase login
supabase link --project-ref xxxx
supabase db push
```

## 3. Récupérer les clés

**Settings → API** :
- `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
- `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 4. Activer l'Auth

**Authentication → Providers → Email** → activer.

## 5. Storage

Créer un bucket `product-images` pour les photos des médicaments.
