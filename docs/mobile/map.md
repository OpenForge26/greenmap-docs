---
sidebar_position: 4
title: Carte des pharmacies
---

# App Patient — Carte des pharmacies

## Écran `MapScreen`

Affiche les pharmacies dans un rayon de 10 km autour d'une position GPS.

## Service

```js
import { getNearbyPharmacies } from '../../services/pharmacies';

const pharmacies = await getNearbyPharmacies(lat, lng, 10);
```

Utilise la fonction RPC Supabase `nearby_pharmacies` basée sur la formule Haversine.
