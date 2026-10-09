---
sidebar_position: 1
title: Vue d'ensemble
---

# API GreenMap

GreenMap utilise **Supabase** comme backend. L'API est constituée de :

1. **REST auto-générée** par PostgREST sur chaque table
2. **Fonctions RPC** (Remote Procedure Calls) pour la logique métier
3. **Edge Functions** pour les webhooks paiements et notifications

## Base URL

```
https://jlafkmfjknjvnjokctwe.supabase.co
```

## Authentification

Toutes les requêtes nécessitent un header `Authorization` avec un JWT Supabase.

```http
Authorization: Bearer <supabase_jwt_token>
apikey: <supabase_anon_key>
Content-Type: application/json
```

### Obtenir un token

```js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password',
});

// data.session.access_token → JWT à utiliser dans Authorization
```

## Codes de réponse

| Code | Signification |
|---|---|
| `200` | Succès |
| `201` | Créé |
| `204` | Succès sans contenu |
| `400` | Requête invalide |
| `401` | Non authentifié |
| `403` | Accès refusé (RLS) |
| `404` | Ressource introuvable |
| `409` | Conflit (doublon) |
| `500` | Erreur serveur |

## Pagination

```http
GET /rest/v1/products?limit=20&offset=0
Range: 0-19
```

## Filtres

Supabase PostgREST supporte des filtres riches :

```http
# Égalité
?name=eq.Paracétamol

# Contient (insensible à la casse)
?name=ilike.*para*

# Supérieur à
?quantity=gt.0

# Plusieurs conditions
?country=eq.TG&is_active=eq.true
```
