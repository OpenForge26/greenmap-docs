---
sidebar_position: 2
title: Gestion des pharmacies
---

# Admin — Gestion des pharmacies

Page `/admin/pharmacies` — liste complète de toutes les pharmacies inscrites sur la plateforme.

## Actions disponibles

- Valider une nouvelle pharmacie (`is_active = true`)
- Suspendre une pharmacie (`is_active = false`)
- Voir les détails (propriétaire, abonnement, localisation)
- Exporter la liste

## Table Supabase

`pharmacies` — accessible en lecture/écriture complète pour le rôle `super_admin`.
