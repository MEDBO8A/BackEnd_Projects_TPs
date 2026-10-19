## Med Amine Boughalleb - 4GL

# TP 3 — Concevoir et implémenter une API REST avec Node.js et Express.js

## 3. Préparation de l'environnement

### Questions

1. Quelle est la différence entre Node.js et npm ?
    - Node.js est un environnement d'exécution JavaScript, tandis que npm est son gestionnaire de paquets.


## 5. Installation d'Express.js

### Questions

1. Quelle nouvelle section apparaît ?
    - dependencies
2. Quelle dépendance contient Express ?
    - "express"
3. Pourquoi Express est-il enregistré dans dependencies ?
    - Car c'est une bibliothèque indispensable au fonctionnement de l'application en production.

## 9. Première modification : route /api/health

### Questions

1. Quelle différence observez-vous entre : res.send(...) et : res.json(...)
    - res.send() envoie une réponse brute, tandis que res.json() convertit les données en JSON et définit automatiquement l'en-tête Content-Type.


## 13. Les paramètres d'URL

### Questions

1. Que contient : req.params.id dans chacun des deux cas ?
    - Cas /api/donneurs/1 : "1" (chaîne de caractères)

    - Cas /api/donneurs/25 : "25" (chaîne de caractères)


## 14. Transformer l'identifiant en nombre

### Questions

1. Quel est maintenant le type de : id ?
    - number


## 19. Les paramètres de requête — req.query

### Questions

1. Quelle est la différence entre : req.params et : req.query
    - req.params récupère les paramètres dynamiques de l'URL (/route/:id), et req.query récupère les paramètres optionnels de la chaîne de requête (/route?cle=valeur).


## 22. Tester POST avec curl

### Questions

1. À quoi sert req.body ?
    - Il contient les données transmises par le client dans le corps de la requête HTTP.
2. Pourquoi avons-nous ajouté express.json() ?
    - Pour permettre à Express de lire et d'analyser les données au format JSON reçues dans les requêtes.
3. Pourquoi retournons-nous le code 201 plutôt que 200 ?
    - Le code 201 Created indique explicitement qu'une ressource a été créée avec succès.


## 35. Exercice 1 — Ajouter la ressource Centre

### Questions

1. Comment organiseriez-vous les fichiers ?
    - Dans des dossiers séparés : src/routes/centre.routes.js, src/controllers/centre.controller.js et src/services/centre.service.js.
2. Quelle fonction doit se trouver dans le service ?
    - Les fonctions gérant la manipulation et la recherche des données des centres.
3. Quelle fonction doit se trouver dans le contrôleur ?
    - Les fonctions gérant la logique HTTP (req, res), faisant le lien entre les routes et le service.
4. Où doit être définie la route ?
    - Dans le fichier centre.routes.js rattaché au serveur principal via app.use("/api/centres", centreRoutes).