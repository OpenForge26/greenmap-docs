# GreenMap : documentation de la base de données

Backend Supabase, phase 1 (MVP). Ce document explique les choix techniques, chaque table et le fonctionnement d'ensemble.

> **Statut :** les 9 migrations sont écrites dans `greenmap-backend/supabase/migrations/`, appliquées au projet Supabase avec `supabase db push`, et vérifiées avec un script de test (inscription, profil automatique, pharmacie, produit, lot, vue publique, pharmacies proches).

## Sommaire

1. [Présentation](#1-présentation)
2. [Les choix techniques](#2-les-choix-techniques-et-leurs-raisons)
3. [La sécurité](#3-la-sécurité)
4. [Vue d'ensemble des tables](#4-vue-densemble-des-tables)
5. [Le détail de chaque table](#5-le-détail-de-chaque-table)
6. [Fonctions, trigger et vue](#6-fonctions-trigger-et-vue)
7. [Comment tout fonctionne ensemble](#7-comment-tout-fonctionne-ensemble)
8. [Ce qui est reporté](#8-ce-qui-est-volontairement-reporté)
9. [Migrations et mise en ligne](#9-ordre-des-migrations-et-mise-en-ligne)

---

## 1. Présentation

**GreenMap** est une application destinée aux pharmacies du Togo et du Bénin :

- une application **pharmacien** : produits, stock, caisse, patients ;
- une application **patient** : recherche de médicaments, pharmacies proches, pharmacies de garde.

### Les projets

| Projet | Rôle |
|---|---|
| `greenmap-backend` | Base Supabase : migrations SQL, règles de sécurité, fonctions |
| `greenmap-web` | Application web, qui parle à Supabase avec la clé publique |
| `greenmap-mobile` | Application mobile, même principe |
| `greenmap-docs` | Documentation du projet |



---

## 2. Les choix techniques et leurs raisons

| Choix | Pourquoi |
|---|---|
| **Supabase (PostgreSQL)** plutôt qu'une base NoSQL | Les données sont fortement reliées : pharmacie, produits, lots, ventes. Une base relationnelle vérifie ces liens et refuse les données incohérentes. |
| **API générée automatiquement** | Chaque table est accessible par l'API. Le web et le mobile n'ont pas besoin d'un serveur intermédiaire pour les opérations courantes. |
| **RLS activée sur toutes les tables** | La sécurité est dans la base. Même avec la clé publique, personne ne lit ni n'écrit hors de ce que les règles autorisent. |
| **Migrations versionnées dans Git** | Chaque changement est un fichier SQL daté. N'importe qui reconstruit la même base. |
| **Montants en entiers (FCFA)** | Pas de centimes en FCFA. Un entier évite les erreurs d'arrondi. |
| **Identifiants UUID** | Générés automatiquement, impossibles à deviner. |
| **Produit séparé de ses lots** | Un médicament peut avoir plusieurs lots avec des dates d'expiration différentes. |
| **Prix copié dans la ligne de vente** | Si le prix d'un produit change, les anciennes ventes gardent le prix payé. |
| **Archiver plutôt que supprimer un produit** | Un produit déjà vendu ne peut pas être supprimé, pour garder l'historique. |
| **Une vente en trois tables** | Une vente a plusieurs produits et plusieurs paiements (cash + Mobile Money). |
| **Secrets hors du code** | La clé publique va dans `.env`. La clé secrète n'est jamais dans un frontend ni sur GitHub. `.env` est ignoré par Git. |
| **Phase 1 seulement** | Fidélité, rappels, WhatsApp, multi-pharmacies viendront dans des migrations ultérieures. |

---

## 3. La sécurité

### 3.1 Les trois types de visiteurs

| Rôle de la base | Qui c'est |
|---|---|
| `anon` | Visiteur non connecté, avec la clé publique |
| `authenticated` | Utilisateur connecté (pharmacien, patient, administrateur) |
| `service_role` | Backend de confiance, avec la clé secrète. Contourne la sécurité : à réserver aux tâches serveur précises. |

### 3.2 Les policies

Quand la RLS est activée, tout est refusé par défaut. Chaque action autorisée a sa règle : `select` (lire), `insert` (ajouter), `update` (modifier), `delete` (supprimer). Une action sans règle reste bloquée.

| Type d'accès | Tables |
|---|---|
| **Lecture publique** | `pharmacies`, `duty_pharmacies` |
| **Réservé au propriétaire de la pharmacie** | `products`, `stock_batches`, `patients`, `sales`, `sale_items`, `sale_payments`, `stock_movements` |
| **Réservé à chaque utilisateur** | `profiles` (chacun son propre profil) |
| **Réservé au super admin** | Gestion des pharmacies de garde, lecture de tous les profils |

### 3.3 Protections supplémentaires

- **Colonnes protégées dans `profiles`** : un utilisateur ne modifie que `full_name`, `phone` et `country`. Il ne peut pas se donner le rôle `super_admin` ni lever sa suspension.
- **Rôle à l'inscription** : seuls `patient` et `pharmacist` sont acceptés. `super_admin` se donne à la main, en SQL.
- **Vue publique** : les patients ne lisent jamais `products` ni `stock_batches`. Ils passent par une vue sans prix d'achat ni quantité exacte.
- **Contraintes** : prix et quantités jamais négatifs, pays limité à `TG` et `BJ`, coordonnées GPS valides, dates de garde cohérentes.

---

## 4. Vue d'ensemble des tables

**10 tables, 1 vue, 3 fonctions et 1 trigger.**

| Table | Contenu | Cahier des charges |
|---|---|---|
| `profiles` | Rôle et infos de chaque compte | 1.1, partie 4 |
| `pharmacies` | Les pharmacies inscrites | 1.1 |
| `products` | Catalogue de chaque pharmacie | 1.2 |
| `stock_batches` | Lots : quantité et expiration | 1.2, 1.3 |
| `stock_movements` | Historique des mouvements de stock | 1.3 |
| `patients` | Fiches clients d'une pharmacie | 1.5 |
| `sales` | Les ventes | 1.4 |
| `sale_items` | Produits de chaque vente | 1.4.1 |
| `sale_payments` | Paiements de chaque vente | 1.4.2 |
| `duty_pharmacies` | Planning des pharmacies de garde | 2.4, 9.6 |

### Les liens entre les tables

Chaque flèche est une clé étrangère : la base vérifie que la ligne pointée existe.

```
auth.users (comptes gérés par Supabase)
   ├── profiles           (1 profil par compte)
   └── pharmacies         (owner_id : le propriétaire)
          ├── products            (pharmacy_id)
          │      └── stock_batches        (product_id)  -> les lots
          ├── patients            (pharmacy_id)
          ├── sales               (pharmacy_id, patient_id)
          │      ├── sale_items           (sale_id, product_id, batch_id)
          │      └── sale_payments        (sale_id)
          ├── stock_movements     (product_id, batch_id, sale_id)
          └── duty_pharmacies     (pharmacy_id)
```

---

## 5. Le détail de chaque table

### 5.1 `profiles`

Supabase garde les comptes dans `auth.users`, qu'on ne modifie pas. `profiles` ajoute le type de compte : une ligne par compte, avec le même identifiant.

| Colonne | À quoi elle sert |
|---|---|
| `id` | Identique à l'identifiant du compte. Supprimé en cascade avec lui. |
| `role` | `patient`, `pharmacist` ou `super_admin`. `patient` par défaut. |
| `full_name`, `phone` | Nom et téléphone. |
| `country` | `TG` ou `BJ`. |
| `status` | `active`, `suspended` ou `banned`. |
| `created_at` | Date de création. |

**À retenir**

- Un **trigger** crée le profil automatiquement à chaque inscription : aucun compte sans profil.
- Les comptes déjà existants reçoivent un profil au moment de la migration.
- Chacun lit son profil, le super admin lit tout, trois colonnes seulement sont modifiables par l'utilisateur.

### 5.2 `pharmacies`

Une ligne par pharmacie, avec les informations d'inscription (1.1.1) et les horaires (1.1.3).

| Colonne | À quoi elle sert |
|---|---|
| `id` | Identifiant unique généré automatiquement. |
| `owner_id` | Le compte propriétaire. |
| `name` | Nom de la pharmacie. Seul champ de texte obligatoire. |
| `email`, `phone`, `address`, `city` | Coordonnées et localisation. |
| `country` | `TG` ou `BJ` uniquement. |
| `latitude`, `longitude` | Position GPS, validée par la base. |
| `mobile_money_providers` | Liste des moyens acceptés (ex. `mixx`, `flooz`), dans une colonne de type liste. |
| `opening_hours` | Horaires au format JSON libre. |
| `created_at` | Date de création. |

**Sécurité**

- Lecture : ouverte à tous (l'app patient affiche les pharmacies).
- Création et modification : seulement par le propriétaire (`owner_id` égal à l'utilisateur connecté).
- Pas de règle de suppression : l'API ne permet pas de supprimer une pharmacie.

> **Point à valider :** la lecture publique expose toutes les colonnes, y compris l'email. Si l'équipe préfère le cacher, on limitera les colonnes lisibles dans une migration ultérieure.

### 5.3 `products`

Le catalogue de chaque pharmacie (1.2). Un produit décrit le médicament, pas la quantité en rayon.

| Colonne | À quoi elle sert |
|---|---|
| `pharmacy_id` | La pharmacie propriétaire. |
| `name`, `dosage`, `form` | Nom (« Paracétamol 500mg »), dosage, forme (comprimé, sirop...). |
| `price` | Prix de vente en FCFA, entier, jamais négatif. Obligatoire. |
| `laboratory`, `active_ingredient`, `barcode` | Laboratoire, molécule active, code-barres (optionnels). |
| `photo_url`, `description` | Lien vers la photo (Supabase Storage) et description. |
| `category` | Catégorie pour les filtres. |
| `purchase_price` | Prix d'achat, pour calculer la marge. |
| `min_stock` | Seuil d'alerte de stock bas (5 par défaut). |
| `is_archived` | Vrai si le produit est archivé. |

La quantité, la date d'expiration et le numéro de lot ne sont **pas** ici : ils sont dans `stock_batches`. Dans l'application, un seul formulaire les saisit ensemble, et le code enregistre le produit puis son premier lot.

### 5.4 `stock_batches`

Les lots de chaque produit. Le stock d'un produit est la somme de ses lots.

| Colonne | À quoi elle sert |
|---|---|
| `pharmacy_id`, `product_id` | La pharmacie et le produit du lot. |
| `lot_number` | Numéro de lot imprimé sur la boîte. |
| `expiry_date` | Date d'expiration. |
| `quantity` | Quantité du lot. Jamais négative. |

Exemple :

| Produit | Lot | Quantité | Expiration |
|---|---|---|---|
| Paracétamol 500mg | A123 | 40 | mars 2027 |
| Paracétamol 500mg | B456 | 60 | novembre 2027 |

Un produit, deux lots, 100 boîtes. Deux index accélèrent les recherches fréquentes : les lots d'un produit, et les lots par date d'expiration (alertes de péremption).

### 5.5 `stock_movements`

Le journal de tout ce qui change dans le stock (1.3.1, 1.3.3, 1.3.4). Les lots disent combien il en reste, cette table dit ce qui s'est passé.

| Colonne | À quoi elle sert |
|---|---|
| `product_id`, `batch_id` | Le produit et, si connu, le lot. |
| `type` | `in`, `out`, `adjustment`, `discard`, `transfer`, `return`. |
| `quantity` | Quantité signée : positive pour une entrée, négative pour une sortie. Jamais zéro. |
| `reason` | Justification (vol, casse, erreur d'inventaire, périmé...). |
| `sale_id` | La vente à l'origine, s'il y en a une. |
| `created_by` | L'utilisateur qui a fait l'opération, rempli automatiquement. |

### 5.6 `patients`

Les fiches clients d'une pharmacie (1.5.1).

| Colonne | À quoi elle sert |
|---|---|
| `pharmacy_id` | La pharmacie qui tient la fiche. |
| `user_id` | Facultatif : le compte du patient s'il utilise l'app. |
| `full_name` | Nom et prénom. Seul champ obligatoire. |
| `phone`, `email`, `birth_date` | Coordonnées et date de naissance, optionnelles. |
| `allergies` | Allergies connues, en texte libre. |

**À retenir**

- Deux fiches d'une même pharmacie ne peuvent pas avoir le même téléphone.
- **L'historique des achats n'est pas une colonne.** C'est l'ensemble des ventes dont `patient_id` est ce patient.
- Les ordonnances (1.5.1) auront leur propre table plus tard.

### 5.7 `sales`

La vente en général (1.4).

| Colonne | À quoi elle sert |
|---|---|
| `pharmacy_id` | La pharmacie qui vend. |
| `patient_id` | Facultatif : le client. Si la fiche est supprimée, la vente reste. |
| `cashier_id` | Le caissier, rempli automatiquement. |
| `subtotal` | Total des produits avant remise. |
| `discount_amount` | Total des remises. |
| `total` | Montant à payer : `subtotal - discount_amount`. |
| `status` | `completed`, `partially_paid`, `partially_refunded`, `refunded`, `cancelled`. |

Exemple de calcul :

| Ligne | Montant |
|---|---|
| 2 boîtes de Paracétamol (2 × 500) | 1 000 FCFA |
| 1 boîte d'Amoxicilline (1 × 2 000) | 2 000 FCFA |
| **`subtotal`** | **3 000 FCFA** |
| `discount_amount` | 300 FCFA |
| **`total`** | **2 700 FCFA** |

> **Convention à partager :** le web et le mobile doivent calculer les montants de la même façon. Une contrainte `check (total = subtotal - discount_amount)` peut être ajoutée pour que la base refuse une vente incohérente.

### 5.8 `sale_items`

Une ligne par produit vendu dans une vente.

| Colonne | À quoi elle sert |
|---|---|
| `sale_id` | La vente. Les lignes sont supprimées avec elle. |
| `product_id` | Le produit. Un produit déjà vendu ne peut pas être supprimé : on l'archive. |
| `batch_id` | Le lot sorti, pour retirer la quantité du bon lot. |
| `quantity` | Nombre de boîtes, au moins 1. |
| `unit_price` | Prix unitaire au moment de la vente. |
| `discount_amount` | Remise sur cette ligne. |
| `pharmacy_id` | Recopié pour écrire la règle de sécurité en une ligne. |

### 5.9 `sale_payments`

Une ligne par paiement (1.4.2). Plusieurs lignes pour une vente permettent le paiement mixte et l'acompte suivi du solde.

| Colonne | À quoi elle sert |
|---|---|
| `sale_id` | La vente payée. |
| `method` | `cash`, `mixx`, `flooz`, `mtn_momo`, `moov_money`, `card`. |
| `amount` | Montant payé, strictement positif. |
| `provider_reference` | Référence de la transaction Mobile Money. |
| `status` | `pending`, `completed`, `failed`, `refunded`. |
| `pharmacy_id` | Recopié pour la règle de sécurité. |

Exemple : 1 000 FCFA en cash et 1 700 FCFA par Mixx donnent une vente et deux paiements, pour un total de 2 700 FCFA.

### 5.10 `duty_pharmacies`

Le planning des pharmacies de garde (2.4, 9.6). Tout le monde le consulte, seul l'administrateur le gère.

| Colonne | À quoi elle sert |
|---|---|
| `pharmacy_id` | La pharmacie de garde. |
| `starts_on`, `ends_on` | La période. La fin ne peut pas précéder le début. |
| `is_24h` | Vrai par défaut. |
| `start_time`, `end_time` | Horaires si ce n'est pas 24h/24. |
| `district` | Le quartier, affiché dans l'app patient. |

---

## 6. Fonctions, trigger et vue

| Élément | À quoi il sert |
|---|---|
| `owns_pharmacy(id)` | « Suis-je le propriétaire de cette pharmacie ? » Remplace un long bloc de règle répété dans chaque table. |
| `is_super_admin()` | « Suis-je administrateur ? » Utilisée pour les gardes et la lecture des profils. |
| `handle_new_user()` (trigger) | À chaque nouveau compte, crée son profil automatiquement. |
| `public_product_availability` (vue) | Pour l'app patient : nom, dosage, forme, molécule, prix et un indicateur « en stock ». Jamais le prix d'achat ni la quantité exacte. Un lot expiré ne compte pas. |
| `nearby_pharmacies(lat, lng, rayon)` | Pharmacies proches d'une position GPS, de la plus proche à la plus éloignée, avec la distance en km. |

Exemple d'appel depuis le code, pour les pharmacies à moins de 5 km :

```js
const { data } = await supabase.rpc("nearby_pharmacies", {
  p_lat: 6.37, p_lng: 2.39, p_radius_km: 5
})
```

> Les fonctions `security definer` s'exécutent avec les droits de leur créateur et utilisent un `search_path` vide, une protection recommandée par Supabase. La vue publique s'exécute volontairement avec les droits du propriétaire pour lire les tables protégées. Le conseiller de sécurité de Supabase peut la signaler (badge « UNRESTRICTED ») : c'est attendu.

---

## 7. Comment tout fonctionne ensemble

### 7.1 Une inscription

1. Le pharmacien crée son compte avec Supabase Auth.
2. Le trigger crée sa ligne dans `profiles` avec le rôle `pharmacist`.
3. Il crée sa pharmacie dans `pharmacies` avec son `owner_id`. La règle d'insertion vérifie que cet identifiant est le sien.

### 7.2 L'ajout d'un médicament

1. Le pharmacien remplit un formulaire unique.
2. Le code crée le produit dans `products`.
3. Il crée le premier lot dans `stock_batches` (quantité, expiration, numéro de lot).
4. Un mouvement `in` peut être ajouté dans `stock_movements`.

### 7.3 Une vente à la caisse

1. Une ligne dans `sales` avec le total et, si connu, le patient.
2. Une ligne dans `sale_items` par produit, avec le prix du moment et le lot.
3. Une ou plusieurs lignes dans `sale_payments`.
4. La quantité des lots diminue et un mouvement `out` est enregistré.

> **À venir :** ces étapes doivent réussir ensemble ou échouer ensemble. Elles seront regroupées dans une fonction de base de données. Pour l'instant, les tables sont prêtes mais ne retirent pas le stock toutes seules.

### 7.4 La recherche d'un médicament par un patient

1. L'app patient interroge `public_product_availability` avec le nom du médicament.
2. Elle affiche les pharmacies qui l'ont en stock, avec le prix, sans les quantités exactes.
3. Elle appelle `nearby_pharmacies` pour trier par distance.

---

## 8. Ce qui est volontairement reporté

| Élément | Remarque |
|---|---|
| Employés d'une pharmacie (1.1.3) | Demande une table de membres et la réécriture des règles de sécurité. |
| Fonction d'enregistrement d'une vente (1.4.3) | Enregistre vente, lignes, paiements et met à jour le stock en une seule opération. |
| Retours et remboursements (1.4.4) | Les statuts existent déjà dans `sales`. |
| Ventes à crédit (1.4.5) | À faire. |
| Ordonnances (1.5.1) | Table séparée, fichiers dans Supabase Storage. |
| Validation d'une pharmacie | Un statut pour que l'administrateur valide une inscription. Pour l'instant, toutes les pharmacies sont visibles. |
| Phases 2 et 3 | Fidélité, rappels, WhatsApp, abonnements, statistiques, multi-pharmacies, interactions médicamenteuses. |

---

## 9. Ordre des migrations et mise en ligne

Les fichiers s'appliquent dans l'ordre de leur date. Cet ordre compte, car certaines tables en référencent d'autres.

| # | Fichier | Dépend de |
|---|---|---|
| 1 | `create_pharmacies` | `auth.users`. Crée aussi `owns_pharmacy()`. |
| 2 | `create_products` | `pharmacies` |
| 3 | `create_stock_batches` | `pharmacies`, `products` |
| 4 | `create_patients` | `pharmacies` |
| 5 | `create_profiles` | `auth.users`. Crée aussi `is_super_admin()`. |
| 6 | `create_sales` | `pharmacies`, `patients`, `products`, `stock_batches` |
| 7 | `create_stock_movements` | `pharmacies`, `products`, `stock_batches`, `sales` |
| 8 | `create_durty_pharmacies` | `pharmacies`, `profiles` |
| 9 | `public_patient_api` | `pharmacies`, `products`, `stock_batches` |

> Le fichier 8 contient une faute de frappe dans son nom (`durty`). Sans effet sur la base. Il ne faut pas le renommer maintenant qu'il est appliqué : Supabase retient les migrations par leur nom.

### Envoyer la base en ligne

Il faut le mot de passe de la base (Project Settings, Database) et un compte membre de l'organisation du projet. Dans `greenmap-backend` :

```bash
npx supabase login
npx supabase link --project-ref <ref-du-projet>
npx supabase db push --dry-run   # liste ce qui serait appliqué
npx supabase db push
```

### Règles de travail

- Un changement de la base = une **nouvelle migration**. On ne modifie plus la base à la main dans l'interface.
- Un fichier de migration déjà appliqué en ligne ne se modifie plus : on en crée un nouveau.
- Le fichier `.env` et la clé secrète ne vont **jamais** sur GitHub.