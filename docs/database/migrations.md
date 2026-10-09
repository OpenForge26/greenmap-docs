---
sidebar_position: 3
title: Migrations
---

# Base de données — Migrations

Les migrations sont dans `greenmap-backend/supabase/migrations/`.

## Liste des migrations

| Fichier | Description |
|---|---|
| `20261003132429_create_pharmacies.sql` | Table pharmacies + GPS |
| `20261005101610_create_products.sql` | Catalogue médicaments |
| `20261005113953_create_stock_batches.sql` | Lots + péremption |
| `20261005140030_create_patients.sql` | Carnet patients |
| `20261005142658_create_profiles.sql` | Profils utilisateurs + rôles |
| `20261005143924_create_sales.sql` | Ventes + lignes + paiements |
| `20261005144502_create_stock_movements.sql` | Mouvements de stock |
| `20261005144714_create_durty_pharmacies.sql` | Pharmacies de garde |
| `20261005145013_public_patient_api.sql` | Vue publique + RLS patient |

## Appliquer les migrations

```bash
supabase db push
```
