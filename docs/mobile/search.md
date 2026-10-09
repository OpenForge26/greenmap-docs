---
sidebar_position: 3
title: Recherche médicaments
---

# App Patient — Recherche de médicaments

## Écran `HomeScreen`

Permet de chercher un médicament par nom. Utilise la vue publique Supabase `public_product_availability`.

## Service

```js
import { searchProducts } from '../../services/products';

const results = await searchProducts('Paracétamol');
```

## React Query

```js
const { data, isLoading } = useQuery({
  queryKey: ['products', search],
  queryFn: () => searchProducts(search),
  enabled: search.length >= 2,
});
```
