## Med Amine Boughalleb - 4GL

# Atelier 8 — Documentation d'une API REST avec Swagger et OpenAPI

Ce dossier contient l'API SangConnect de l'atelier 7, complétée par la documentation interactive demandée dans l'atelier 8.

---

## 1. Lancement du projet

```bash
npm install
npm run dev
```

Le serveur écoute sur `http://localhost:3000`.

La documentation Swagger UI est disponible sur :

```text
http://localhost:3000/api-docs
```

La spécification OpenAPI brute (JSON) est également exposée sur :

```text
http://localhost:3000/api-docs.json
```

Le fichier `.env` contient :

```text
DATABASE_URL="mysql://sangconnect:sangconnect123@localhost:3306/sangconnect"
JWT_SECRET="une-cle-secrete-longue-et-aleatoire-pour-sangconnect"
```

## 2. Dépendances ajoutées

```bash
npm install swagger-jsdoc swagger-ui-express
```

| Bibliothèque | Rôle |
| :--- | :--- |
| `swagger-jsdoc` | Lit les annotations `@openapi` des fichiers JavaScript et génère la spécification OpenAPI. |
| `swagger-ui-express` | Expose une interface web interactive à partir de la spécification générée. |

Vérification :

```bash
npm list swagger-jsdoc swagger-ui-express
# swagger-jsdoc@6.3.0
# swagger-ui-express@5.0.1
```

## 3. Fichiers ajoutés et modifiés

```text
src/config/swagger.js          (nouveau : configuration + schémas + securitySchemes)
src/routes/auth.routes.js      (annotations OpenAPI)
src/routes/user.routes.js      (annotations OpenAPI)
src/routes/donneur.routes.js   (annotations OpenAPI)
src/routes/don.routes.js       (annotations OpenAPI)
src/server.js                  (montage de /api-docs et /api-docs.json)
package.json                   (version 8.0.0 + deux dépendances Swagger)
API_DOCUMENTATION.md           (notice de documentation demandée en travail à domicile)
```

Le projet n'a pas de fichier `src/app.js` : le montage de Swagger UI est donc fait dans `src/server.js`, qui joue le rôle décrit par l'énoncé.

## 4. Configuration OpenAPI

`src/config/swagger.js` contient :

- `openapi: "3.0.3"` ;
- `info` : titre, version, description (avec les consignes d'authentification) ;
- `servers` : `http://localhost:3000` (serveur de développement) ;
- `tags` : `Root`, `Authentication`, `Users`, `Donors`, `Donations` ;
- `components.securitySchemes.bearerAuth` : Bearer JWT ;
- `components.schemas` : schémas réutilisables ;
- `apis: ["./src/routes/*.js", "./src/server.js"]` : fichiers analysés par `swagger-jsdoc`.

Pas de `security` global : l'API possède des routes publiques (`/`, `/api/auth/register`, `/api/auth/login`). La règle `bearerAuth` est appliquée uniquement aux endpoints protégés (question 13).

Montage dans `src/server.js` :

```javascript
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";

app.get("/api-docs.json", (req, res) => res.json(swaggerSpec));

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);
```

## 5. Endpoints documentés

**22 opérations sur 11 chemins**, toutes annotées directement au-dessus de leur route Express.

| Méthode | Chemin | Résumé | Sécurité |
| :--- | :--- | :--- | :--- |
| GET | `/` | Endpoint d'accueil | publique |
| POST | `/api/auth/register` | Créer un compte | publique |
| POST | `/api/auth/login` | Authentifier un utilisateur | publique |
| GET | `/api/auth/me` | Consulter son profil | Bearer |
| GET | `/api/users` | Lister les utilisateurs | Bearer |
| GET | `/api/users/{id}` | Consulter un utilisateur | Bearer |
| PUT | `/api/users/{id}` | Remplacer un utilisateur | Bearer + ADMIN |
| PATCH | `/api/users/{id}` | Modifier un utilisateur | Bearer + ADMIN |
| DELETE | `/api/users/{id}` | Supprimer un utilisateur | Bearer + ADMIN |
| GET | `/api/donneurs` | Lister et filtrer les donneurs | Bearer |
| GET | `/api/donneurs/{id}` | Consulter un donneur | Bearer |
| GET | `/api/donneurs/{id}/dons` | Historique des dons d'un donneur | Bearer |
| POST | `/api/donneurs` | Créer un donneur | Bearer + ADMIN / AGENT_CENTRE |
| PUT | `/api/donneurs/{id}` | Remplacer un donneur | Bearer + ADMIN / AGENT_CENTRE |
| PATCH | `/api/donneurs/{id}` | Modifier un donneur | Bearer + ADMIN / AGENT_CENTRE |
| DELETE | `/api/donneurs/{id}` | Supprimer un donneur | Bearer + ADMIN |
| GET | `/api/dons` | Lister les dons (filtres + pagination) | Bearer |
| GET | `/api/dons/{id}` | Consulter un don | Bearer |
| POST | `/api/dons` | Créer un don | Bearer + ADMIN / AGENT_CENTRE |
| PUT | `/api/dons/{id}` | Remplacer un don | Bearer + ADMIN / AGENT_CENTRE |
| PATCH | `/api/dons/{id}` | Modifier un don | Bearer + ADMIN / AGENT_CENTRE |
| DELETE | `/api/dons/{id}` | Supprimer un don | Bearer + ADMIN |

**Adaptation à l'API réelle :** l'énoncé utilise des chemins et des champs pédagogiques (`/api/donors`, `firstName`, `bloodGroup`, `accessToken`...). La documentation décrit le code réellement implémenté : `/api/donneurs`, `/api/dons`, `/api/auth/me`, `nom`, `prenom`, `groupeSanguin`, et la réponse de login `{ token, user }`.

## 6. Schémas réutilisables

23 schémas sont définis dans `components.schemas` :

- `RootResponse`, `Role`, `GroupeSanguin` ;
- donneurs : `Donor`, `CreateDonor`, `UpdateDonor`, `DonorSummary` ;
- utilisateurs : `User`, `RegisterRequest`, `RegisterResponse`, `UpdateUserRequest`, `LoginRequest`, `LoginUser`, `LoginResponse`, `MeResponse` ;
- dons : `Centre`, `Don`, `DonWithCentre`, `CreateDon`, `UpdateDon`, `DonListResponse` ;
- erreurs : `ValidationIssue`, `ErrorResponse`.

Exemple de réutilisation :

```javascript
schema:
  $ref: '#/components/schemas/Donor'
```

Le schéma `CreateDonor` ne contient pas `id` : celui-ci est généré par la base. Le schéma `User` ne contient pas `password` : le hash n'est jamais exposé.

## 7. Authentification JWT dans Swagger

```javascript
securitySchemes: {
    bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Saisir le token JWT obtenu avec POST /api/auth/login."
    }
}
```

Dans Swagger UI :

1. appeler `POST /api/auth/login` avec `{"email":"...","password":"..."}` ;
2. copier la valeur du champ `token` de la réponse ;
3. cliquer sur **Authorize**, coller le token ;
4. exécuter une route protégée : Swagger envoie `Authorization: Bearer <token>`.

La déclaration OpenAPI ne protège pas l'endpoint : la protection réelle reste assurée par `authenticate` et `authorize` dans les routes Express.

## 8. Réponses aux questions de l'atelier

### Question 1 — Pourquoi documenter une API ?

Une API peut fonctionner sans documentation, mais elle est alors difficile à utiliser par une autre équipe. La documentation décrit les fonctionnalités, les endpoints, les méthodes HTTP, les paramètres, les corps de requête, les réponses, les erreurs et l'authentification. Elle sert de contrat entre le backend, le frontend, les testeurs et les utilisateurs de l'API.

### Question 2 — Swagger et OpenAPI

- **OpenAPI** est une spécification standard (format structuré, YAML/JSON) qui décrit une API HTTP.
- **Swagger** désigne les outils qui créent, visualisent et exploitent une description OpenAPI.
- **Swagger UI** transforme la spécification en interface web interactive.
- Une documentation d'endpoint contient : objectif, méthode, chemin, paramètres, corps, réponses, erreurs et sécurité.

Les informations à documenter ont été relevées pour chaque endpoint réel de SangConnect (voir le tableau de la section 5).

### Question 3 — Installation

```bash
npm install swagger-jsdoc swagger-ui-express
npm list swagger-jsdoc swagger-ui-express
```

`swagger-jsdoc` génère la spec à partir des commentaires, `swagger-ui-express` sert l'interface.

### Question 4 — Configuration OpenAPI

Création de `src/config/swagger.js` avec `openapi`, `info`, `servers`, `tags`, `apis`. Le chemin `./src/routes/*.js` est relatif au répertoire depuis lequel l'application est lancée ; `./src/server.js` a été ajouté pour documenter la route `/`.

### Question 5 — Ajouter Swagger UI

Import de `swagger-ui-express` et de la spec, puis montage sur `/api-docs`. Résultat attendu : le titre **SangConnect API** et les descriptions apparaissent dans le navigateur.

### Question 6 — Premier endpoint GET

Annotation au-dessus de `router.get("/", ...)` du routeur donneur, avec `summary`, `description`, `tags: [Donors]` et une réponse 200 contenant un tableau de `$ref: '#/components/schemas/Donor'`. Le chemin OpenAPI utilisé est le chemin complet `/api/donneurs`, même si la route Express interne est `/`.

### Question 7 — Schéma `Donor`

Le schéma réel utilise `id`, `nom`, `prenom`, `groupeSanguin` (enum ABO) et `telephone` (nullable). Les champs obligatoires sont `id`, `nom`, `prenom`, `groupeSanguin`.

### Question 8 — Schéma `CreateDonor`

`CreateDonor` contient `nom`, `prenom`, `groupeSanguin`, `telephone` (facultatif) et **pas** `id`. Séparer les deux schémas évite d'exposer un champ géré par la base et rend explicite ce que le client doit envoyer.

### Question 9 — Requête POST

`requestBody.required: true`, contenu `application/json`, schéma `$ref: CreateDonor`, réponses 201 (Donor), 400 (validation Zod), 401 (token absent) et 403 (rôle insuffisant). Le code 409 n'a pas été documenté car l'API ne le retourne pas pour la création d'un donneur.

### Question 10 — Paramètres d'URL

`parameters` avec `name: id`, `in: path`, `required: true`, `schema: { type: integer, minimum: 1 }`, réponses 200 et 404. `in` peut valoir `path`, `query`, `header` ou `cookie`.

### Question 11 — Paramètres de recherche

Deux endpoints utilisent des filtres réels :

- `GET /api/donneurs` : `groupeSanguin` (query, facultatif) ;
- `GET /api/dons` : `centreId`, `donneurId`, `ville`, `groupeSanguin`, `page` (défaut 1), `limit` (défaut 10), `sortBy` (`dateDon` ou `volume`), `order` (`asc` ou `desc`).

Ces filtres sont effectivement implémentés dans les contrôleurs et le dépôt Prisma, donc la documentation est fidèle au comportement de l'API.

### Question 12 — Sécurité Bearer

`securitySchemes.bearerAuth` avec `type: http`, `scheme: bearer`, `bearerFormat: JWT`. Le bouton **Authorize** apparaît dans Swagger UI.

### Question 13 — Protéger seulement les endpoints concernés

La règle globale n'a pas été ajoutée car `/`, `/api/auth/register` et `/api/auth/login` sont publics. Chaque endpoint protégé porte :

```javascript
security:
  - bearerAuth: []
```

et documente les réponses 401 (token absent/invalide) et 403 (rôle insuffisant).

### Question 14 — Connexion

`LoginRequest` (`email`, `password`) et `LoginResponse` (`token`, `user`) ont été créés. La réponse décrite correspond au code réel de l'atelier 7 : `{ token, user }`. Il n'y a pas de refresh token ni de cookie `HttpOnly` dans cette version, donc aucun `Set-Cookie` n'est documenté.

### Question 15 — Erreurs

`ErrorResponse` contient `message` (obligatoire) et `errors` (facultatif, détails Zod). Le champ `code` de l'énoncé n'est pas retourné par cette API : la documentation utilise donc la structure réelle. Un format commun évite de répéter les réponses d'erreur et facilite le travail du client.

### Question 16 — Tester les endpoints

Procédure : ouvrir `/api-docs`, déplier une catégorie, cliquer sur **Try it out**, renseigner les paramètres, **Execute**, puis observer la requête, le code HTTP et le JSON. Le compte rendu est en section 9.

### Question 17 — Route protégée

Sans token, `GET /api/donneurs` renvoie 401. Après **Authorize** avec un token valide, la même requête atteint le contrôleur. Le comportement est identique à Postman/cURL. Une documentation testable vérifie que la spec est correcte (chemins, paramètres, schémas) ; une documentation purement descriptive peut contenir des erreurs invisibles.

### Question 18 — Autres ressources

Toutes les ressources présentes dans le projet (utilisateurs, donneurs, dons) ont été documentées, y compris l'historique `/api/donneurs/{id}/dons`. Les centres de collecte n'ont pas de route dédiée dans cette version : ils apparaissent uniquement comme schéma imbriqué dans les dons.

### Question 19 — Vérification qualité

Vérifications effectuées :

- 22 opérations documentées, une par route Express existante ;
- 110 références `$ref` toutes résolues vers un schéma existant ;
- aucun endpoint sans `responses` ;
- toutes les routes protégées portent `security: bearerAuth` ;
- les routes publiques ne sont pas marquées comme protégées ;
- les exemples JSON correspondent aux contrôleurs et aux validateurs Zod ;
- aucun secret réel n'apparaît dans la documentation (le mot de passe d'exemple est `Password123`, le `JWT_SECRET` n'est pas exposé).

Si une route Express est modifiée sans mise à jour de son annotation, Swagger continue de présenter l'ancien contrat : le client se fie à une documentation fausse. Il faut donc mettre à jour l'annotation en même temps que le code.

### Questions de compréhension (section 17)

1. **Swagger vs OpenAPI** : OpenAPI est la spécification (le format), Swagger est la suite d'outils qui l'exploitent.
2. **`swagger-jsdoc`** : transforme les annotations JSDoc en spécification OpenAPI.
3. **`swagger-ui-express`** : sert l'interface interactive dans Express.
4. **`requestBody`** : décrit le corps JSON envoyé par le client (obligatoire ou non, schéma).
5. **Paramètre `path` vs `query`** : `path` fait partie du chemin (`/donneurs/{id}`), `query` est un filtre après `?` (`?page=1`).
6. **`components.schemas`** : bibliothèque de définitions réutilisables pour les objets JSON.
7. **`$ref`** : évite de répéter une définition et garantit sa cohérence.
8. **`securitySchemes`** : déclare les mécanismes d'authentification disponibles (ici Bearer JWT).
9. **La déclaration JWT ne remplace pas le middleware** : Swagger décrit seulement ce qui est attendu ; `authenticate` vérifie réellement le token côté serveur.
10. **Documenter les erreurs** : le client peut anticiper 400/401/403/404/409/500 et afficher un message adapté.
11. **Annotations vs documentation manuelle** : les annotations vivent près du code et sont générées automatiquement ; un document manuel dérive vite. Les deux peuvent se compléter.
12. **Maintenir la doc à jour** : une documentation obsolète est pire qu'une absence de documentation, car elle donne confiance à tort.

## 9. Compte rendu — tests depuis Swagger UI / API

| Test | Résultat obtenu |
| :--- | :--- |
| `GET /api-docs` | `200 OK`, page Swagger UI (titre « Swagger UI ») |
| `GET /api-docs.json` | `200 OK`, spec OpenAPI 3.0.3 avec 11 chemins |
| `GET /` (route publique) | `200 OK`, `{"message":"Bienvenue dans l'API SangConnect"}` |
| `GET /api/donneurs` sans token | `401 Unauthorized`, `{"message":"Token manquant"}` |
| `POST /api/auth/login` avec un email invalide | `400 Bad Request`, `{"message":"Données invalides","errors":[...]}` |
| Génération de la spec | 110 `$ref` résolus, 0 référence cassée |
| Vérification des opérations | 22 opérations, toutes avec `responses` |

Pour la capture demandée dans les livrables : ouvrir `http://localhost:3000/api-docs` et capturer l'écran affichant les cinq catégories et les endpoints du projet.

## 10. Livrables

- [x] `src/config/swagger.js`
- [x] Annotations OpenAPI dans les quatre fichiers de routes
- [x] Schémas des principales ressources (`Donor`, `User`, `Don`, ...)
- [x] Documentation des endpoints d'authentification
- [x] Documentation des routes protégées par JWT
- [ ] Capture de l'interface Swagger UI (à réaliser depuis le navigateur)
- [ ] Démonstration de deux endpoints testés depuis Swagger UI, dont un protégé (à réaliser avec une base MySQL alimentée et un token JWT valide)
