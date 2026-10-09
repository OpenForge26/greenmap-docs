---
sidebar_position: 3
title: Pharmacies
---

# API — Pharmacies

Gestion des fiches pharmacies. Chaque pharmacie appartient à un utilisateur `pharmacist`.

---

## Lister les pharmacies

<span class="api-badge api-badge--get">GET</span> `/rest/v1/pharmacies`

Retourne toutes les pharmacies visibles selon le rôle de l'appelant.
- `super_admin` → toutes
- `pharmacist` → uniquement les siennes
- `patient` → uniquement les actives et publiques

### Paramètres de requête

<table class="param-table">
  <thead>
    <tr><th>Paramètre</th><th>Type</th><th>Description</th></tr>
  </thead>
  <tbody>
    <tr><td><code>country</code></td><td>string</td><td><code>TG</code> (Togo) ou <code>BJ</code> (Bénin)</td></tr>
    <tr><td><code>is_active</code></td><td>boolean</td><td>Filtrer les pharmacies actives</td></tr>
    <tr><td><code>select</code></td><td>string</td><td>Colonnes à retourner (ex: <code>id,name,city</code>)</td></tr>
    <tr><td><code>limit</code></td><td>integer</td><td>Nombre de résultats (défaut : 20)</td></tr>
    <tr><td><code>offset</code></td><td>integer</td><td>Décalage pour la pagination</td></tr>
  </tbody>
</table>

### Exemple

```http
GET /rest/v1/pharmacies?country=eq.TG&is_active=eq.true&limit=10
Authorization: Bearer <token>
apikey: <anon_key>
```

### Réponse `200`

```json
[
  {
    "id": "uuid",
    "name": "Pharmacie du Plateau",
    "address": "Rue 10, Plateau",
    "city": "Lomé",
    "country": "TG",
    "phone": "+228 90 00 00 00",
    "latitude": 6.1375,
    "longitude": 1.2123,
    "is_active": true,
    "mobile_money_number": "+228 90 00 00 00",
    "mobile_money_provider": "flooz",
    "created_at": "2026-10-01T10:00:00Z"
  }
]
```

---

## Pharmacies proches (GPS)

<span class="api-badge api-badge--post">RPC</span> `/rest/v1/rpc/nearby_pharmacies`

Retourne les pharmacies dans un rayon donné, triées par distance.

### Corps de la requête

<table class="param-table">
  <thead>
    <tr><th>Paramètre</th><th>Type</th><th>Requis</th><th>Description</th></tr>
  </thead>
  <tbody>
    <tr><td><code>p_lat</code></td><td>float</td><td><span class="required-badge">requis</span></td><td>Latitude du point de référence</td></tr>
    <tr><td><code>p_lng</code></td><td>float</td><td><span class="required-badge">requis</span></td><td>Longitude du point de référence</td></tr>
    <tr><td><code>p_radius_km</code></td><td>float</td><td></td><td>Rayon en km (défaut : 10)</td></tr>
  </tbody>
</table>

### Exemple

```http
POST /rest/v1/rpc/nearby_pharmacies
Authorization: Bearer <token>
Content-Type: application/json

{
  "p_lat": 6.1375,
  "p_lng": 1.2123,
  "p_radius_km": 5
}
```

### Réponse `200`

```json
[
  {
    "id": "uuid",
    "name": "Pharmacie du Plateau",
    "address": "Rue 10, Plateau",
    "city": "Lomé",
    "phone": "+228 90 00 00 00",
    "latitude": 6.1375,
    "longitude": 1.2123,
    "distance_km": 0.3
  }
]
```

---

## Créer une pharmacie

<span class="api-badge api-badge--post">POST</span> `/rest/v1/pharmacies`

Accessible aux `super_admin` uniquement.

### Corps de la requête

<table class="param-table">
  <thead>
    <tr><th>Champ</th><th>Type</th><th>Requis</th><th>Description</th></tr>
  </thead>
  <tbody>
    <tr><td><code>name</code></td><td>string</td><td><span class="required-badge">requis</span></td><td>Nom de la pharmacie</td></tr>
    <tr><td><code>address</code></td><td>string</td><td><span class="required-badge">requis</span></td><td>Adresse complète</td></tr>
    <tr><td><code>city</code></td><td>string</td><td><span class="required-badge">requis</span></td><td>Ville</td></tr>
    <tr><td><code>country</code></td><td>string</td><td><span class="required-badge">requis</span></td><td><code>TG</code> ou <code>BJ</code></td></tr>
    <tr><td><code>owner_id</code></td><td>uuid</td><td><span class="required-badge">requis</span></td><td>UUID du pharmacien (profiles.id)</td></tr>
    <tr><td><code>latitude</code></td><td>float</td><td></td><td>Coordonnée GPS</td></tr>
    <tr><td><code>longitude</code></td><td>float</td><td></td><td>Coordonnée GPS</td></tr>
    <tr><td><code>phone</code></td><td>string</td><td></td><td>Téléphone</td></tr>
    <tr><td><code>mobile_money_number</code></td><td>string</td><td></td><td>Numéro Mobile Money</td></tr>
    <tr><td><code>mobile_money_provider</code></td><td>string</td><td></td><td><code>flooz</code>, <code>mixx</code>, <code>mtn</code>, <code>moov</code></td></tr>
  </tbody>
</table>

### Exemple

```http
POST /rest/v1/pharmacies
Authorization: Bearer <token>
Content-Type: application/json
Prefer: return=representation

{
  "name": "Pharmacie de la Paix",
  "address": "Boulevard de la Paix",
  "city": "Cotonou",
  "country": "BJ",
  "owner_id": "user-uuid",
  "latitude": 6.3654,
  "longitude": 2.4183
}
```

### Réponse `201`

```json
[
  {
    "id": "new-uuid",
    "name": "Pharmacie de la Paix",
    "city": "Cotonou",
    "country": "BJ",
    "is_active": false,
    "created_at": "2026-10-08T12:00:00Z"
  }
]
```

---

## Modifier une pharmacie

<span class="api-badge api-badge--patch">PATCH</span> `/rest/v1/pharmacies?id=eq.{id}`

### Exemple

```http
PATCH /rest/v1/pharmacies?id=eq.uuid
Authorization: Bearer <token>
Content-Type: application/json
Prefer: return=representation

{
  "is_active": true,
  "phone": "+229 97 00 00 00"
}
```

---

## Supprimer une pharmacie

<span class="api-badge api-badge--delete">DELETE</span> `/rest/v1/pharmacies?id=eq.{id}`

Réservé aux `super_admin`. Retourne `204 No Content`.
