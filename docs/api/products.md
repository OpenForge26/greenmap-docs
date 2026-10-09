---
sidebar_position: 4
title: Produits
---

# API — Produits

Catalogue médicaments d'une pharmacie.

---

## Lister les produits

<span class="api-badge api-badge--get">GET</span> `/rest/v1/products`

### Paramètres

<table class="param-table">
  <thead>
    <tr><th>Paramètre</th><th>Type</th><th>Description</th></tr>
  </thead>
  <tbody>
    <tr><td><code>pharmacy_id</code></td><td>uuid</td><td>Filtrer par pharmacie</td></tr>
    <tr><td><code>name</code></td><td>string</td><td>Recherche insensible à la casse : <code>ilike.*para*</code></td></tr>
    <tr><td><code>category</code></td><td>string</td><td>Catégorie thérapeutique</td></tr>
    <tr><td><code>is_available</code></td><td>boolean</td><td>Produits en stock uniquement</td></tr>
  </tbody>
</table>

### Exemple

```http
GET /rest/v1/products?pharmacy_id=eq.uuid&name=ilike.*amox*
Authorization: Bearer <token>
```

### Réponse `200`

```json
[
  {
    "id": "uuid",
    "pharmacy_id": "uuid",
    "name": "Amoxicilline",
    "dosage": "500 mg",
    "form": "gélule",
    "category": "Antibiotique",
    "unit_price": 500,
    "currency": "XOF",
    "barcode": "1234567890",
    "is_available": true,
    "created_at": "2026-10-01T10:00:00Z"
  }
]
```

---

## Disponibilité publique (patients)

<span class="api-badge api-badge--get">GET</span> `/rest/v1/public_product_availability`

Vue publique sans authentification. Accessible aux patients.

### Paramètres

<table class="param-table">
  <thead>
    <tr><th>Paramètre</th><th>Type</th><th>Description</th></tr>
  </thead>
  <tbody>
    <tr><td><code>name</code></td><td>string</td><td><code>ilike.*paracét*</code></td></tr>
    <tr><td><code>in_stock</code></td><td>boolean</td><td>Uniquement disponibles</td></tr>
    <tr><td><code>country</code></td><td>string</td><td><code>TG</code> ou <code>BJ</code></td></tr>
  </tbody>
</table>

### Réponse `200`

```json
[
  {
    "product_id": "uuid",
    "name": "Paracétamol",
    "dosage": "500 mg",
    "form": "comprimé",
    "pharmacy_id": "uuid",
    "pharmacy_name": "Pharmacie du Plateau",
    "city": "Lomé",
    "in_stock": true,
    "unit_price": 200
  }
]
```

---

## Créer un produit

<span class="api-badge api-badge--post">POST</span> `/rest/v1/products`

### Corps

```json
{
  "pharmacy_id": "uuid",
  "name": "Paracétamol",
  "dosage": "1000 mg",
  "form": "comprimé",
  "category": "Analgésique",
  "unit_price": 350,
  "currency": "XOF",
  "requires_prescription": false
}
```

---

## Modifier un produit

<span class="api-badge api-badge--patch">PATCH</span> `/rest/v1/products?id=eq.{id}`

```json
{
  "unit_price": 400,
  "is_available": false
}
```

---

## Supprimer un produit

<span class="api-badge api-badge--delete">DELETE</span> `/rest/v1/products?id=eq.{id}`

Retourne `204 No Content`.
