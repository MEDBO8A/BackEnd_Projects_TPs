## Med Amine Boughalleb - 4GL

# Atelier 7 — Authentification, JWT et gestion des utilisateurs

## 1. Lancement du projet

```bash
npm install
npm run dev
```

Le serveur écoute sur `http://localhost:3000`.

Le fichier `.env` contient :

```text
DATABASE_URL="..."
JWT_SECRET="une-cle-secrete-longue-et-aleatoire-pour-sangconnect"
```

`JWT_SECRET` sert à signer les tokens. Il est chargé avec `import "dotenv/config";` au début de `server.js`.

## 2. Migration

Le projet reprend la base de l'atelier 6 et ajoute le modèle `User` :

```bash
npx prisma migrate dev --name add_users
npx prisma generate
```

La migration crée la table `User` avec `email` unique et le champ `role` en enum.

## 3. Architecture de sécurité

```text
Client → Route → authenticate → authorize → Controller → Service → Repository → Prisma → MySQL
```

- `authenticate` vérifie le JWT et place l'utilisateur dans `req.user`.
- `authorize("ADMIN", ...)` vérifie le rôle et renvoie 403 si nécessaire.

Fichiers ajoutés :

```text
prisma/schema.prisma                  (enum Role + model User)
src/utils/password.js                 (argon2 hash / verify)
src/utils/jwt.js                      (génération du token)
src/repositories/user.repository.js
src/services/auth.service.js
src/services/user.service.js
src/controllers/auth.controller.js
src/controllers/user.controller.js
src/validators/auth.validator.js
src/validators/user.validator.js
src/routes/auth.routes.js
src/routes/user.routes.js
src/middlewares/auth.js
src/middlewares/authorize.js
```

## 4. Routes

### Authentification

| Route | Méthode | Protection | Description |
| :--- | :--- | :--- | :--- |
| `/api/auth/register` | POST | publique | Créer un compte |
| `/api/auth/login` | POST | publique | Se connecter et obtenir un token |
| `/api/auth/me` | GET | `authenticate` | Utilisateur connecté |

### Utilisateurs et dons

| Route | Protection |
| :--- | :--- |
| `GET /api/users` | `authenticate` |
| `GET /api/users/:id` | `authenticate` |
| `PUT`, `PATCH /api/users/:id` | `authenticate` + `authorize("ADMIN")` |
| `DELETE /api/users/:id` | `authenticate` + `authorize("ADMIN")` |
| `GET /api/dons`, `GET /api/donneurs` | `authenticate` (tous les rôles) |
| `POST /api/dons` | `authenticate` + `authorize("ADMIN", "AGENT_CENTRE")` |
| `PUT`, `PATCH /api/dons/:id` | `authenticate` + `authorize("ADMIN", "AGENT_CENTRE")` |
| `DELETE /api/dons/:id` | `authenticate` + `authorize("ADMIN")` |

Règle du tableau de l'activité 30 : « Modifier le stock » est réservé à `ADMIN` et `RESPONSABLE_STOCK`. Il n'y a pas encore de route « stock » dans l'API, donc cette règle est documentée ici et sera appliquée quand la ressource existera.

## 5. Exemples de requêtes

```bash
# Inscription (rôle par défaut : AGENT_CENTRE)
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nom":"Ahmed","email":"ahmed@sangconnect.tn","password":"Password123"}'

# Connexion
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ahmed@sangconnect.tn","password":"Password123"}'

# Utiliser le token
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer VOTRE_TOKEN"

curl http://localhost:3000/api/dons \
  -H "Authorization: Bearer VOTRE_TOKEN"
```

Réponse du login :

```json
{
    "token": "eyJ...",
    "user": {
        "id": 1,
        "nom": "Ahmed",
        "email": "ahmed@sangconnect.tn",
        "role": "AGENT_CENTRE"
    }
}
```

---

## 6. Réponses aux questions de l'atelier

### Activité 1 — Pourquoi un `role` ?

Parce que tous les utilisateurs n'ont pas les mêmes droits. Un administrateur peut gérer les utilisateurs et supprimer des données, alors qu'un agent de centre peut seulement consulter et créer des dons. Le rôle permet de distinguer ces droits.

### Activité 2 — Le modèle User

1. **`email` est `@unique`** : deux comptes ne peuvent pas avoir la même adresse, sinon on ne sait pas qui se connecte.
2. **`password` est un `String`** : on y stocke le hash Argon2, qui est une chaîne de caractères.
3. **Le rôle est un `enum`** : les valeurs sont limitées à `ADMIN`, `AGENT_CENTRE`, `RESPONSABLE_STOCK`, ce qui évite les fautes de frappe et les rôles inventés.
4. **Valeur par défaut** : `AGENT_CENTRE` (déclaré avec `@default(AGENT_CENTRE)`).

### Activité 6 — Le hash

On ne peut pas retrouver le mot de passe original parce que le hachage est une fonction à sens unique : elle transforme le mot de passe en une chaîne fixe, mais on ne peut pas faire l'inverse. Argon2 ajoute aussi un sel aléatoire, donc deux mots de passe identiques donnent deux hash différents. La seule vérification possible est de re-hacher la saisie et de comparer.

### Activité 10 — Ne pas exposer le hash

Même haché, le mot de passe est une donnée secrète. Si on l'expose, un attaquant peut tenter de le casser hors ligne (avec des dictionnaires), et il récupère aussi des informations sur le système de hachage. L'API ne doit renvoyer que `id`, `nom`, `email` et `role`.

### Activité 14 — Contenu de la colonne `password`

On trouve un hash Argon2 qui commence par `$argon2id$v=19$m=65536,t=3,p=4...`, et **pas** `Password123` en clair.

### Activité 16 — La clé secrète

Si la clé est dans le code source, toute personne qui lit le dépôt peut signer ses propres tokens et devenir administrateur. Elle doit rester dans `.env` (qui n'est pas versionné) et être différente en production.

### Activité 26 — `req.user`

Placer l'utilisateur dans `req.user` permet à tous les middleware et controllers situés après `authenticate` de savoir qui est connecté, sans refaire la vérification du token. Par exemple `/me` peut retourner directement `req.user.sub` et `req.user.role`.

### Activité 29 — 401 ou 403 ?

- **401 Unauthorized** : l'authentification a échoué — token absent, invalide ou expiré. On ne sait pas qui vous êtes.
- **403 Forbidden** : on sait qui vous êtes, mais votre rôle n'a pas le droit de faire cette opération.

### Activité 30 — Règles de rôles

```javascript
// Consulter : tous les rôles
router.get("/", authenticate, getAll);

// Créer : ADMIN + AGENT_CENTRE
router.post("/", authenticate, authorize("ADMIN", "AGENT_CENTRE"), create);

// Gérer les utilisateurs : ADMIN seulement
router.delete("/:id", authenticate, authorize("ADMIN"), deleteUser);
```

---

## 7. Compte rendu — Partie 6 (tests)

| Scénario | Résultat obtenu |
| :--- | :--- |
| Inscription réussie | `201 Created`, hash Argon2 en base |
| Email déjà utilisé | `409 Conflict`, « Cette adresse email est déjà utilisée » |
| Mot de passe sans chiffre | `400 Bad Request`, message Zod |
| Mot de passe incorrect | `401 Unauthorized` |
| Utilisateur inexistant | `401 Unauthorized` |
| Login réussi | `200 OK` avec `{ token, user }` |
| Token absent | `401 Unauthorized`, « Token manquant » |
| Token invalide | `401 Unauthorized`, « jwt malformed » |
| Token expiré | `401 Unauthorized`, « jwt expired » |
| Rôle insuffisant (AGENT sur DELETE) | `403 Forbidden`, « Accès refusé » |
| Accès autorisé (ADMIN sur DELETE) | `204 No Content` |
| `/api/auth/me` avec token | `200 OK` avec `id`, `email`, `role` |

Le JWT contient bien `sub`, `email` et `role`, avec une expiration de `1h`.
