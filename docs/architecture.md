---
sidebar_position: 2
title: Architecture
---

# Architecture GreenMap

## Vue d'ensemble

```
┌────────────────────┐      ┌────────────────────┐
│  App Patient       │      │  App Pharmacien    │
│  (React Native)    │      │  (Next.js)         │
│  • Recherche médi. │      │  • CRUD produits   │
│  • Carte GPS       │      │  • Caisse          │
│  • Pharmacies garde│      │  • Stats           │
└──────────┬─────────┘      └──────────┬─────────┘
           │                           │
           └───────────┬───────────────┘
                       │
            ┌──────────▼──────────┐
            │  Supabase Backend   │
            │  • PostgreSQL       │
            │  • Auth (JWT)       │
            │  • RLS policies     │
            │  • Edge Functions   │
            └──────────┬──────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
┌───────▼──────┐ ┌────▼─────┐ ┌─────▼──────┐
│ CinetPay/    │ │ Firebase │ │ WhatsApp   │
│ Klasha       │ │ FCM      │ │ Business   │
│ (Paiements)  │ │ (Notifs) │ │ (Notifs)   │
└──────────────┘ └──────────┘ └────────────┘
```

## Base de données (Supabase PostgreSQL)

### Tables principales

| Table | Description |
|---|---|
| `profiles` | Utilisateurs (patient, pharmacist, super_admin) |
| `pharmacies` | Fiches pharmacies (GPS, pays, Mobile Money) |
| `products` | Catalogue médicaments (nom, dosage, forme, prix) |
| `stock_batches` | Lots avec dates de péremption |
| `patients` | Carnet patients d'une pharmacie |
| `sales` + `sale_items` + `sale_payments` | Caisse complète |
| `stock_movements` | Historique mouvements stock |
| `duty_pharmacies` | Pharmacies de garde par période |

### RLS (Row Level Security)

Toutes les tables ont des politiques RLS :
- Les pharmaciens ne voient que **leurs** données
- Les patients accèdent en **lecture seule** via la vue `public_product_availability`
- Les super admins voient **tout**

### Fonctions PostgreSQL

| Fonction | Usage |
|---|---|
| `nearby_pharmacies(lat, lng, radius_km)` | Retourne les pharmacies dans un rayon donné (Haversine) |
| `owns_pharmacy(user_id, pharmacy_id)` | Vérifie l'ownership d'une pharmacie |
| `is_super_admin(user_id)` | Vérifie le rôle super_admin |

## Authentification

**Supabase Auth** avec JWT.

Rôles dans `profiles.role` :
- `patient` — app mobile, lecture seule
- `pharmacist` — web pharmacien, CRUD sur sa pharmacie
- `super_admin` — admin dashboard, accès complet

## Paiements Mobile Money

**Via CinetPay ou Klasha**

| Pays | Providers |
|---|---|
| **Togo** | Flooz (Moov), Mixx (Togocel) |
| **Bénin** | MTN Mobile Money, Moov Money |

Prix abonnement pharmacien : **12 500 FCFA/mois**

## Notifications

1. **Firebase FCM** (push mobile)
2. **WhatsApp Business API** (confirmations commandes, alertes stock)
