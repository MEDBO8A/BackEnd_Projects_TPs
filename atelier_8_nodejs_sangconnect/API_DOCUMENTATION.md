# API_DOCUMENTATION — SangConnect

Documentation interactive de l'API REST SangConnect, générée avec Swagger / OpenAPI (atelier 8).

## 1. Adresse de Swagger UI

```text
http://localhost:3000/api-docs
```

La spécification OpenAPI brute est disponible séparément :

```text
http://localhost:3000/api-docs.json
```

## 2. Principales catégories

| Catégorie | Description | Endpoints |
| :--- | :--- | :--- |
| `Root` | Endpoint d'accueil | `GET /` |
| `Authentication` | Inscription, connexion, profil | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` |
| `Users` | Gestion des utilisateurs | `GET`, `GET /{id}`, `PUT /{id}`, `PATCH /{id}`, `DELETE /{id}` sur `/api/users` |
| `Donors` | Gestion des donneurs et historique | `/api/donneurs`, `/api/donneurs/{id}`, `/api/donneurs/{id}/dons` |
| `Donations` | Gestion des dons avec filtres et pagination | `/api/dons`, `/api/dons/{id}` |

**22 opérations** sont documentées sur **11 chemins**. Les schémas réutilisables se trouvent dans `components.schemas` de `src/config/swagger.js`.

## 3. Méthode d'authentification

L'API utilise un **token JWT Bearer** :

1. appeler `POST /api/auth/login` avec `{"email":"...","password":"..."}` ;
2. récupérer le champ `token` de la réponse `{"token":"...","user":{...}}` ;
3. cliquer sur **Authorize** dans Swagger UI et coller le token ;
4. Swagger ajoute automatiquement l'en-tête `Authorization: Bearer <token>`.

Durée de validité : **1 heure**. Le token contient `sub`, `email` et `role`.

Rôles : `ADMIN`, `AGENT_CENTRE`, `RESPONSABLE_STOCK`.

- Routes publiques : `/`, `/api/auth/register`, `/api/auth/login`.
- Routes protégées : toutes les autres (déclaration `security: [{ bearerAuth: [] }]`).
- Modifications : `ADMIN` ou `AGENT_CENTRE` selon la ressource ; suppressions : `ADMIN` uniquement.

> La déclaration Swagger décrit la sécurité attendue ; la vérification effective est faite par les middlewares `authenticate` et `authorize` de l'application Express.

## 4. Conventions de réponse

### Succès

| Code | Signification | Corps |
| :--- | :--- | :--- |
| `200` | Lecture ou mise à jour réussie | Objet JSON (ou tableau) |
| `201` | Ressource créée | Objet JSON de la ressource créée |
| `204` | Suppression réussie | Aucun corps |

### Erreurs

Toutes les erreurs utilisent le schéma `ErrorResponse` :

```json
{
  "message": "Donneur introuvable",
  "errors": [
    { "code": "too_small", "path": ["password"], "message": "..." }
  ]
}
```

`message` est toujours présent ; `errors` apparaît uniquement pour les erreurs de validation Zod.

| Code | Signification |
| :--- | :--- |
| `400` | Données invalides (validation Zod) |
| `401` | Token manquant, invalide ou expiré / identifiants incorrects |
| `403` | Rôle insuffisant |
| `404` | Ressource introuvable |
| `409` | Email déjà utilisé (inscription) |
| `500` | Erreur interne du serveur |

Les champs des objets suivent le modèle réel de l'API : `nom`, `prenom`, `groupeSanguin`, `telephone`, `volume`, `dateDon`, `donneurId`, `centreId`. Le mot de passe n'est jamais retourné, même haché.

## 5. Lancer la documentation en local

```bash
cd atelier_8_nodejs_sangconnect
npm install
npm run dev
```

Ouvrir ensuite `http://localhost:3000/api-docs`.

Pour les endpoints qui interrogent la base de données, démarrer MySQL et appliquer les migrations :

```bash
npx prisma migrate dev
npx prisma generate
```

La configuration de la documentation se trouve dans :

- `src/config/swagger.js` : métadonnées, schémas, sécurité ;
- `src/routes/*.js` : annotations `@openapi` au-dessus de chaque route ;
- `src/server.js` : montage de Swagger UI et de la spec JSON.

Pour modifier la documentation, éditer l'annotation correspondante **en même temps** que la route Express : Swagger doit toujours refléter le comportement réel de l'API.
