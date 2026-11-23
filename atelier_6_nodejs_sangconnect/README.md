## Med Amine Boughalleb - 4GL

# Atelier 6 — Relations entre données et requêtes avancées avec Prisma

## 1. Lancement du projet

```bash
npm install
npm run dev
```

Le serveur écoute sur `http://localhost:3000`.

## 2. Modèles et migration

Le fichier `prisma/schema.prisma` contient trois modèles :

```text
Donneur 1 ─── N Don ── N 1 Centre
```

- `Don` contient les clés étrangères `donneurId` et `centreId`.
- `Donneur` et `Centre` contiennent chacun un champ `dons Don[]`.

Après modification du schéma :

```bash
npx prisma migrate dev --name add_dons_centres
npx prisma generate
```

Pour insérer des données de test (3 centres + quelques dons) :

```bash
node src/seed.js
```

## 3. Architecture

```text
Client → Route → Validation (Zod) → Controller → Service → Repository → Prisma → MySQL
```

Fichiers ajoutés dans cet atelier :

```text
src/validators/don.validator.js
src/repositories/don.repository.js
src/services/don.service.js
src/controllers/don.controller.js
src/routes/don.routes.js
src/seed.js
src/test-don.js
```

## 4. Routes de l'API

| Route | Méthode | Description |
| :--- | :--- | :--- |
| `/api/dons` | GET | Liste paginée des dons (avec filtres et tri) |
| `/api/dons/:id` | GET | Un don avec son donneur et son centre |
| `/api/donneurs/:id/dons` | GET | Les dons d'un donneur |
| `/api/dons` | POST | Créer un don |
| `/api/dons/:id` | PUT | Remplacer un don |
| `/api/dons/:id` | PATCH | Modifier une partie d'un don |
| `/api/dons/:id` | DELETE | Supprimer un don |

Paramètres de recherche disponibles sur `GET /api/dons` :

```text
centreId, donneurId, ville, groupeSanguin, page, limit, sortBy, order
```

`sortBy` = `dateDon` ou `volume`, `order` = `asc` ou `desc`.

Format de la réponse paginée :

```json
{
    "data": [],
    "pagination": {
        "page": 1,
        "limit": 10,
        "total": 35
    }
}
```

## 5. Exemples de requêtes

```bash
# Tous les dons (page 1, 10 résultats)
curl http://localhost:3000/api/dons

# Un seul don
curl http://localhost:3000/api/dons/1

# Filtres combinés : ville + groupe sanguin + pagination
curl "http://localhost:3000/api/dons?ville=Sousse&groupeSanguin=A%2B&page=1&limit=10"

# Filtrer par centre ou par donneur
curl "http://localhost:3000/api/dons?centreId=1"
curl "http://localhost:3000/api/dons?donneurId=2"

# Trier par volume décroissant
curl "http://localhost:3000/api/dons?sortBy=volume&order=desc"

# Les dons d'un donneur
curl http://localhost:3000/api/donneurs/1/dons

# Créer un don
curl -X POST http://localhost:3000/api/dons \
  -H "Content-Type: application/json" \
  -d '{"volume":450,"donneurId":1,"centreId":1}'

# Modifier un don
curl -X PATCH http://localhost:3000/api/dons/1 \
  -H "Content-Type: application/json" \
  -d '{"volume":500}'

# Supprimer un don
curl -X DELETE http://localhost:3000/api/dons/1
```

---

## 6. Réponses aux questions de l'atelier

### Activité 1 — Préparer les modèles Prisma

1. **`dons Don[]`** : c'est le champ de relation inverse. Il indique qu'un donneur peut avoir plusieurs dons. Prisma s'en sert pour retrouver les dons liés (`include: { dons: true }`).

2. **`donneurId Int`** : c'est la clé étrangère. Elle stocke l'identifiant du donneur auquel appartient le don.

3. **`donneurId`** est un simple nombre (la colonne en base), alors que **`donneur`** est l'objet Donneur complet que Prisma va chercher grâce à cette clé.

4. **`@relation(fields: [donneurId], references: [id])`** signifie : « le champ `donneurId` de `Don` référence le champ `id` de `Donneur` ». C'est ainsi qu'on déclare la clé étrangère à Prisma.

### Activité 3 — Comprendre les clés étrangères

1. `donneurId` est nécessaire pour savoir à quel donneur appartient le don.
2. On ne stocke pas le nom directement pour éviter la duplication : le nom est gardé une seule fois dans `Donneur`. Si le nom change, on ne modifie qu'un seul endroit.
3. Sans la relation, les dons ne seraient plus rattachés à un donneur : on perdrait le lien et la cohérence des données.
4. La clé étrangère garantit qu'on ne peut pas créer un don avec un `donneurId` qui n'existe pas.

### Activité 5 — Créer un don

`donneurId: 1` et `centreId: 1` signifient que le don est fait par le donneur n°1 et dans le centre n°1. Le don n'est pas créé « à part » : il est lié à ces deux enregistrements.

### Question importante — `include`

On utilise `include` quand on a besoin des données liées (le donneur et le centre) en plus du don. Sans `include`, on reçoit seulement les clés `donneurId` et `centreId`.

### Activité 7 — `select`

Il ne faut pas toujours retourner toutes les colonnes car :

- **performances** : moins de données à lire en base ;
- **quantité transférée** : réponse plus petite, donc plus rapide sur le réseau ;
- **sécurité** : on évite d'exposer des champs sensibles (comme le téléphone) ;
- **conception REST** : l'API renvoie exactement ce dont le client a besoin.

### Activité 8 — Deux approches pour les dons d'un donneur

- `Don → findMany({ where: { donneurId: 1 } })` : on part du don, utile quand on veut une liste de dons avec filtres/tri/pagination.
- `Donneur → findUnique({ include: { dons: true } })` : on part du donneur, utile quand on affiche une fiche donneur et ses dons.

Les deux donnent les dons, mais le point de départ et le format de réponse sont différents.

### Activité 9 — Filtrage sur la relation

`where: { donneur: { groupeSanguin: "A+" } }` demande à Prisma de suivre la relation `don` → `donneur`, puis de garder seulement les dons dont le donneur a le groupe `A+`. On filtre donc sur une valeur qui n'est pas dans la table `Don`.

### Activité 10 — `centreId` ou `centre.ville`

- `centreId: 1` : filtre sur la clé étrangère, quand on connaît l'identifiant.
- `centre: { ville: "Sousse" }` : filtre sur une donnée de la table liée, quand on connaît la ville.

### Activité 11 — Tri

`asc` = ordre croissant (du plus ancien au plus récent, ou du plus petit volume au plus grand).
`desc` = ordre décroissant (du plus récent au plus ancien, ou du plus grand volume au plus petit).

### Activité 12 — Requête combinée

```javascript
const dons = await prisma.don.findMany({
    where: {
        donneur: {
            groupeSanguin: "A+"
        },
        centre: {
            ville: "Sousse"
        }
    },
    orderBy: {
        dateDon: "desc"
    }
});
```

### Activité 13 — Pagination

Pour `page = 3` et `limit = 10` : `skip = (3 - 1) * 10 = 20`.

### Activité 15 — `total`

`total` indique combien de résultats existent au total. Le client peut ainsi calculer le nombre de pages et afficher « page 2 sur 4 » par exemple.

### Activité 17 — Le Repository

Le Repository est le bon endroit car c'est la couche prévue pour l'accès aux données. La requête Prisma est écrite une seule fois et peut être réutilisée par le Service. Le Controller reste simple et ne contient pas de code SQL/Prisma.

### Activité 22 — N+1

L'approche B (`findMany` avec `include`) est préférable car elle fait **une seule requête** avec jointure, contre **1 + N requêtes** dans la boucle de l'approche A. Moins il y a d'allers-retours avec la base, plus c'est rapide.

### Activité 23 — `include` ou `select`

Pour une API publique, je choisis **`select`** : on retourne seulement les champs utiles (`nom`, `prenom`, `groupeSanguin`, `ville`...). C'est plus sûr (pas de téléphone exposé) et plus léger. `include` reste pratique pendant le développement ou quand tous les champs sont nécessaires.

### Activité 24 — Combiner plusieurs paramètres

Le Service construit un objet `where` en ajoutant chaque filtre seulement si le paramètre est présent dans l'URL. Ensuite il ajoute `orderBy`, `skip` et `take`, et compte le total avec le même `where`. C'est exactement ce que fait `buildWhere()` dans `don.repository.js` et `getAll()` dans `don.service.js`.

---

## 7. Compte rendu (Partie 7 du travail à la maison)

1. **Rôle d'une clé étrangère** : c'est une colonne (ici `donneurId`, `centreId`) qui référence la clé primaire d'une autre table. Elle permet de lier les données et évite les dons orphelins.

2. **Rôle de `@relation`** : il déclare à Prisma quelle clé étrangère pointe vers quel modèle. Par exemple `@relation(fields: [donneurId], references: [id])` relie `Don.donneurId` à `Donneur.id`.

3. **`include` vs `select`** : `include` charge les relations **en plus de tous les champs** ; `select` choisit **précisément les champs** retournés (et permet aussi de choisir les champs des relations). `select` est plus adapté à une API publique.

4. **Intérêt de `where`** : il filtre les résultats directement dans la base de données, au lieu de tout récupérer puis de filtrer en JavaScript. C'est plus rapide.

5. **`skip` et `take`** : `take` = nombre de résultats à retourner (la taille de la page), `skip` = nombre de résultats à ignorer avant de commencer. Pour la page `p` avec `limit` `l` : `skip = (p - 1) * l`.

6. **Problème N+1** : c'est quand on fait 1 requête pour récupérer une liste, puis 1 requête supplémentaire pour chaque élément de la liste (donc 101 requêtes pour 100 donneurs). On l'évite avec `include`, qui charge tout en une seule requête.

7. **Pourquoi les requêtes vont dans le Repository** : parce que la responsabilité du Repository est l'accès aux données. Le Service contient la logique métier (vérifier que le don existe, etc.) et le Controller gère uniquement HTTP. Si la requête change, on ne modifie qu'un seul fichier.
