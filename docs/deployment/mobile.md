---
sidebar_position: 4
title: Mobile (Expo)
---

# Déploiement — Mobile

## Développement (Expo Go)

```bash
cd greenmap-mobile
npm install
npx expo start
```

Scanner le QR code avec l'app **Expo Go** sur ton téléphone.

## Production (EAS Build)

### 1. Installer EAS CLI

```bash
npm install -g eas-cli
eas login
```

### 2. Configurer

```bash
eas build:configure
```

### 3. Build Android

```bash
eas build --platform android
```

### 4. Build iOS

```bash
eas build --platform ios
```

### 5. Variables d'environnement

Dans `eas.json` :

```json
{
  "build": {
    "production": {
      "env": {
        "EXPO_PUBLIC_SUPABASE_URL": "https://xxxx.supabase.co",
        "EXPO_PUBLIC_SUPABASE_ANON_KEY": "your-anon-key"
      }
    }
  }
}
```
