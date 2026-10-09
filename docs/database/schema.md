---
sidebar_position: 1
title: Schéma
---

# Base de données — Schéma

## Tables

| Table | Description |
|---|---|
| `profiles` | Utilisateurs (patient, pharmacist, super_admin) |
| `pharmacies` | Fiches pharmacies avec GPS |
| `products` | Catalogue médicaments |
| `stock_batches` | Lots avec dates de péremption |
| `patients` | Carnet patients |
| `sales` | Entêtes de vente |
| `sale_items` | Lignes de vente |
| `sale_payments` | Paiements |
| `stock_movements` | Historique mouvements stock |
| `duty_pharmacies` | Planning de garde |

## Vue publique

`public_product_availability` — accessible sans auth, utilisée par l'app patient pour la recherche.
