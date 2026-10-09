---
sidebar_position: 5
title: Pharmacies de garde
---

# App Patient — Pharmacies de garde

## Écran `DutyScreen`

Affiche les pharmacies de garde actives aujourd'hui.

## Service

```js
import { getDutyPharmacies } from '../../services/pharmacies';

const gardes = await getDutyPharmacies();
```

Requête sur la table `duty_pharmacies` filtrée sur la date du jour avec jointure sur `pharmacies`.
