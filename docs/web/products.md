---
sidebar_position: 3
title: Gestion des produits
---

# App Pharmacien — Produits

Page `/dashboard/products` — CRUD complet sur le catalogue médicaments de la pharmacie.

## Fonctionnalités

- Lister tous les produits
- Ajouter un médicament (nom, dosage, forme, prix, code-barres)
- Modifier un produit
- Supprimer un produit
- Alertes stock bas et péremption proche

## Table Supabase

`products` + `stock_batches` pour les lots avec dates de péremption.
