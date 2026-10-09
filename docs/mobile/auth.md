---
sidebar_position: 2
title: Authentification
---

# App Patient — Authentification

L'authentification utilise Supabase Auth avec email + mot de passe.

## Flux

1. L'utilisateur ouvre l'app → `LoginScreen`
2. Il saisit email + mot de passe
3. `supabase.auth.signInWithPassword()` est appelé
4. En cas de succès → `RootNavigator` redirige vers `PatientTabs`
5. Le profil est chargé depuis la table `profiles`

## Store Zustand

```js
import { useAuthStore } from '../stores/authStore';

const { session, profile, signOut } = useAuthStore();
```
