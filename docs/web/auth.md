---
sidebar_position: 2
title: Authentification
---

# App Pharmacien — Authentification

Login via Supabase Auth. Après connexion, le rôle `pharmacist` est vérifié dans `profiles`.

## Page login

`/login` — formulaire React Hook Form + Zod.

```js
const { data, error } = await supabase.auth.signInWithPassword({ email, password });
if (!error) router.push('/dashboard');
```
