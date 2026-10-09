---
sidebar_position: 6
title: Patients
---

# API — Patients

Carnet patients d'une pharmacie.

---

## Lister les patients

<span class="api-badge api-badge--get">GET</span> `/rest/v1/patients?pharmacy_id=eq.{id}`

### Réponse `200`

```json
[
  {
    "id": "uuid",
    "pharmacy_id": "uuid",
    "full_name": "Mme Diallo",
    "phone": "+228 90 00 00 00",
    "date_of_birth": "1980-03-15",
    "notes": "Diabétique",
    "created_at": "2026-10-01T10:00:00Z"
  }
]
```

---

## Créer un patient

<span class="api-badge api-badge--post">POST</span> `/rest/v1/patients`

```json
{
  "pharmacy_id": "uuid",
  "full_name": "M. Koné",
  "phone": "+229 97 00 00 00",
  "date_of_birth": "1972-07-20"
}
```

---

## Modifier un patient

<span class="api-badge api-badge--patch">PATCH</span> `/rest/v1/patients?id=eq.{id}`

```json
{
  "notes": "Hypertendu — éviter ibuprofène"
}
```

---

## Supprimer un patient

<span class="api-badge api-badge--delete">DELETE</span> `/rest/v1/patients?id=eq.{id}`

Retourne `204 No Content`.
