## Med Amine Boughalleb - 4GL

# Atelier 4 — Validation des données et gestion des erreurs avec Node.js, Express.js et Zod

### 34. Exercice 1 — Tester toutes les validations

#### Cas 1 — Donneur valide

La requête : POST /api/donneurs avec {"nom": "Khelifi", "prenom": "Yassine", "groupeSanguin": "A+"}

Le code HTTP : 201 Created

Le résultat obtenu : {"id": 1, "nom": "Khelifi", "prenom": "Yassine", "groupeSanguin": "A+"}

La raison du rejet éventuel : Aucun rejet (données valides)

#### Cas 2 — Nom trop court

La requête : POST /api/donneurs avec {"nom": "A", "prenom": "Yassine", "groupeSanguin": "A+"}

Le code HTTP : 400 Bad Request

Le résultat obtenu : {"message": "Données invalides", "errors": ["nom trop court"]}

La raison du rejet éventuel : Le nom doit contenir au moins 2 caractères

#### Cas 3 — Groupe sanguin invalide

La requête : POST /api/donneurs avec {"nom": "Khelifi", "prenom": "Yassine", "groupeSanguin": "XYZ"}

Le code HTTP : 400 Bad Request

Le résultat obtenu : {"message": "Données invalides", "errors": ["groupe sanguin invalide"]}

La raison du rejet éventuel : XYZ n'est pas un groupe sanguin valide (A+, A-, B+, B-, AB+, AB-, O+, O-)

#### Cas 4 — Donneur sans prénom

La requête : POST /api/donneurs avec {"nom": "Khelifi", "groupeSanguin": "A+"}

Le code HTTP : 400 Bad Request

Le résultat obtenu : {"message": "Données invalides", "errors": ["prenom requis"]}

La raison du rejet éventuel : Le champ prenom est obligatoire

#### Cas 5 — Identifiant invalide

La requête : GET /api/donneurs/abc

Le code HTTP : 400 Bad Request

Le résultat obtenu : {"message": "Données invalides", "errors": ["id invalide"]}

La raison du rejet éventuel : L'identifiant dans l'URL doit être un nombre

#### Cas 6 — Groupe sanguin invalide dans la requête

La requête : GET /api/donneurs?groupeSanguin=XYZ

Le code HTTP : 400 Bad Request

Le résultat obtenu : {"message": "Données invalides", "errors": ["groupe sanguin invalide"]}

La raison du rejet éventuel : Le paramètre de recherche groupeSanguin=XYZ est invalide