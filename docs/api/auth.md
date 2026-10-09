---
sidebar_position: 2
title: Authentification
---

# API — Authentification

GreenMap utilise **Supabase Auth** (JWT). Trois rôles existent : `patient`, `pharmacist`, `super_admin`.

---

## Connexion

<span class="api-badge api-badge--post">POST</span> `/auth/v1/token?grant_type=password`

### Corps

```json
{
  "email": "user@example.com",
  "password": "motdepasse"
}
```

### Réponse `200`

```json
{
  "access_token": "eyJhbGci...",
  "token_type": "bearer",
  "expires_in": 3600,
  "refresh_token": "...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "authenticated"
  }
}
```

:::tip Client Supabase
Utilise toujours le client Supabase plutôt que d'appeler l'API directement :

```js
const { data, error } = await supabase.auth.signInWithPassword({
  email, password
});
```
:::

---

## Inscription

<span class="api-badge api-badge--post">POST</span> `/auth/v1/signup`

```json
{
  "email": "nouveau@example.com",
  "password": "motdepasse",
  "data": {
    "full_name": "Kofi Mensah",
    "role": "patient",
    "country": "TG"
  }
}
```

:::info Trigger automatique
À l'inscription, un trigger Supabase crée automatiquement une entrée dans `profiles` avec le rôle et les infos fournies dans `data`.
:::

---

## Rafraîchir le token

<span class="api-badge api-badge--post">POST</span> `/auth/v1/token?grant_type=refresh_token`

```json
{
  "refresh_token": "..."
}
```

---

## Déconnexion

<span class="api-badge api-badge--post">POST</span> `/auth/v1/logout`

```http
Authorization: Bearer <token>
```

---

## Récupérer le profil

<span class="api-badge api-badge--get">GET</span> `/rest/v1/profiles?id=eq.{user_id}&select=*`

### Réponse `200`

```json
[
  {
    "id": "uuid",
    "full_name": "Kofi Mensah",
    "role": "pharmacist",
    "country": "TG",
    "status": "active",
    "created_at": "2026-10-01T10:00:00Z"
  }
]
```

### Rôles disponibles

| Rôle | Accès |
|---|---|
| `patient` | Lecture seule sur `public_product_availability`, `duty_pharmacies` |
| `pharmacist` | CRUD sur sa pharmacie, ses produits, ses ventes |
| `super_admin` | Accès complet à toutes les tables |
