---
sidebar_position: 2
title: Row Level Security
---

# Base de données — RLS

Toutes les tables ont des politiques RLS activées sur Supabase.

## Règles par rôle

| Rôle | Accès |
|---|---|
| `patient` | Lecture seule sur `public_product_availability` et `duty_pharmacies` |
| `pharmacist` | CRUD complet sur ses propres données uniquement |
| `super_admin` | Accès complet à toutes les tables |

## Exemple de politique

```sql
-- Un pharmacien ne voit que sa propre pharmacie
CREATE POLICY "pharmacist_own_pharmacy" ON pharmacies
  FOR ALL USING (owner_id = auth.uid());
```
