---
sidebar_position: 4
title: Planning de garde
---

# Admin — Planning de garde

Page `/admin/duty` — gestion des pharmacies de garde au Togo et au Bénin.

## Fonctionnalités

- Ajouter une période de garde pour une pharmacie
- Définir les horaires (`start_time`, `end_time`) ou 24h/24
- Filtrer par district / ville / pays
- Supprimer une garde

## Table Supabase

`duty_pharmacies` — accessible en écriture au rôle `super_admin` uniquement.

## Champs importants

| Champ | Description |
|---|---|
| `pharmacy_id` | Pharmacie concernée |
| `starts_on` | Date de début |
| `ends_on` | Date de fin |
| `is_24h` | Garde 24h/24 |
| `district` | District / quartier |
