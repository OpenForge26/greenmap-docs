---
sidebar_position: 1
title: Introduction
---

# GreenMap — Documentation

GreenMap est une plateforme **B2B2C** de gestion de pharmacies et de recherche de médicaments, conçue pour le **Togo (Lomé)** et le **Bénin (Cotonou)**.

## Les 3 applications

| Application | Technologie | Cible |
|---|---|---|
| **App Patient** (mobile) | React Native + Expo | Grand public — gratuit |
| **App Pharmacien** (web) | Next.js 14 + Tailwind | Pharmaciens — 12 500 FCFA/mois |
| **Admin Dashboard** | Next.js 14 + Tailwind | Super admins GreenMap |

## Le problème résolu

**Pour les pharmaciens :**
- Pertes financières sur les médicaments périmés
- Gestion manuelle du stock (papier ou Excel)
- Pas de visibilité sur les ventes et les tendances

**Pour les patients :**
- Impossible de savoir où trouver un médicament précis
- Pharmacies de garde difficiles à localiser
- Déplacements inutiles pour des ruptures de stock

## Stack technique

```
Mobile       React Native 0.76 + Expo 52
Web / Admin  Next.js 14 + Tailwind CSS + shadcn/ui
Backend      Supabase (PostgreSQL + Auth + Storage + Edge Functions)
Paiements    CinetPay / Klasha (Flooz, Mixx, MTN MoMo, Moov)
Notifs       Firebase FCM + WhatsApp Business API
Cartes       Leaflet + OpenStreetMap
```

## Démarrage rapide

```bash
# 1. Cloner le repo
git clone https://github.com/YOUR_GITHUB_USERNAME/GreenMap.git

# 2. Variables d'environnement
cp greenmap-web/.env.local.example greenmap-web/.env.local
cp greenmap-admin/.env.local.example greenmap-admin/.env.local
cp greenmap-mobile/.env.example greenmap-mobile/.env

# 3. Renseigner les clés Supabase dans chaque .env

# 4. Installer et lancer
cd greenmap-web && npm install && npm run dev
cd greenmap-admin && npm install && npm run dev
cd greenmap-mobile && npm install && npx expo start
```
