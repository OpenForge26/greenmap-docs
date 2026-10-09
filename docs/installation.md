---
sidebar_position: 3
title: Installation
---

# Installation

## Prérequis

- Node.js >= 18
- npm ou yarn
- Un projet Supabase créé sur [supabase.com](https://supabase.com)
- Expo Go installé sur ton téléphone (pour le mobile)

## 1. Cloner le repo

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/GreenMap.git
cd GreenMap
```

## 2. Configurer les variables d'environnement

### greenmap-web et greenmap-admin

```bash
# Dans greenmap-web/
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

```bash
# Dans greenmap-admin/
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### greenmap-mobile

```bash
# Dans greenmap-mobile/
EXPO_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

:::info Où trouver les clés ?
Dans ton projet Supabase → **Settings → API** → `Project URL` et `anon public key`.
:::

## 3. Lancer le web pharmacien

```bash
cd greenmap-web
npm install
npm run dev
# → http://localhost:3000
```

## 4. Lancer l'admin

```bash
cd greenmap-admin
npm install
npm run dev
# → http://localhost:3001 (ou 3000 si web non lancé)
```

## 5. Lancer le mobile

```bash
cd greenmap-mobile
npm install
npx expo start
# Scanner le QR code avec Expo Go
```
