---
sidebar_position: 5
title: Ventes
---

# API — Ventes

---

## Créer une vente

<span class="api-badge api-badge--post">POST</span> `/rest/v1/sales`

### Corps

```json
{
  "pharmacy_id": "uuid",
  "patient_id": "uuid",
  "total_amount": 2500,
  "currency": "XOF",
  "payment_method": "mobile_money",
  "status": "completed"
}
```

---

## Ajouter des lignes de vente

<span class="api-badge api-badge--post">POST</span> `/rest/v1/sale_items`

```json
{
  "sale_id": "uuid",
  "product_id": "uuid",
  "quantity": 2,
  "unit_price": 500,
  "total_price": 1000
}
```

---

## Lister les ventes

<span class="api-badge api-badge--get">GET</span> `/rest/v1/sales?pharmacy_id=eq.{id}&order=created_at.desc`

### Réponse `200`

```json
[
  {
    "id": "uuid",
    "pharmacy_id": "uuid",
    "total_amount": 2500,
    "currency": "XOF",
    "payment_method": "mobile_money",
    "status": "completed",
    "created_at": "2026-10-08T09:00:00Z"
  }
]
```
