---
sidebar_position: 7
title: Pharmacies de garde
---

# API — Pharmacies de garde

---

## Gardes actives aujourd'hui

<span class="api-badge api-badge--get">GET</span> `/rest/v1/duty_pharmacies`

### Paramètres

<table class="param-table">
  <thead>
    <tr><th>Paramètre</th><th>Type</th><th>Description</th></tr>
  </thead>
  <tbody>
    <tr><td><code>starts_on</code></td><td>date</td><td><code>lte.2026-10-08</code> — commence avant ou à aujourd'hui</td></tr>
    <tr><td><code>ends_on</code></td><td>date</td><td><code>gte.2026-10-08</code> — finit après ou à aujourd'hui</td></tr>
    <tr><td><code>select</code></td><td>string</td><td>Inclure la relation : <code>*,pharmacies(name,address,phone,city)</code></td></tr>
  </tbody>
</table>

### Exemple — gardes d'aujourd'hui

```http
GET /rest/v1/duty_pharmacies?starts_on=lte.2026-10-08&ends_on=gte.2026-10-08&select=*,pharmacies(name,address,phone,city,latitude,longitude)
apikey: <anon_key>
```

### Réponse `200`

```json
[
  {
    "id": "uuid",
    "pharmacy_id": "uuid",
    "starts_on": "2026-10-08",
    "ends_on": "2026-10-09",
    "start_time": "08:00",
    "end_time": "22:00",
    "is_24h": false,
    "district": "Lomé Commune",
    "pharmacies": {
      "name": "Pharmacie du Plateau",
      "address": "Rue 10, Plateau",
      "phone": "+228 90 00 00 00",
      "city": "Lomé",
      "latitude": 6.1375,
      "longitude": 1.2123
    }
  }
]
```

---

## Créer une garde

<span class="api-badge api-badge--post">POST</span> `/rest/v1/duty_pharmacies`

Réservé aux `super_admin`.

### Corps

```json
{
  "pharmacy_id": "uuid",
  "starts_on": "2026-10-10",
  "ends_on": "2026-10-11",
  "start_time": "08:00",
  "end_time": "22:00",
  "is_24h": false,
  "district": "Cotonou 1"
}
```

---

## Modifier une garde

<span class="api-badge api-badge--patch">PATCH</span> `/rest/v1/duty_pharmacies?id=eq.{id}`

```json
{
  "is_24h": true
}
```

---

## Supprimer une garde

<span class="api-badge api-badge--delete">DELETE</span> `/rest/v1/duty_pharmacies?id=eq.{id}`

Retourne `204 No Content`.
