## Med Amine Boughalleb - 4GL

# SangConnect API

API Node.js native pour l'application SangConnect.

## 1. Instructions de lancement

Exécutez le serveur avec Node.js :

```bash
node src/server.js 
```

## Liste des routes

| Route | Méthode | Code de statut | Description |
| :--- | :--- | :--- | :--- |
| `/` | `GET` | `200 OK` | Message d'accueil principal |
| `/api/health` | `GET` | `200 OK` | Vérification de l'état de santé du serveur |
| `/api/info` | `GET` | `200 OK` | Informations générales sur l'application et l'environnement |
| `/api/welcome` | `GET` | `200 OK` | Message de bienvenue de l'API |
| `/api/version` | `GET` | `200 OK` | Version de l'application et informations système |
| `/api/diagnostic` | `GET` | `200 OK` | Diagnostic de la requête (en-têtes, méthode, URL, date) |
| `/api/diagnostic` | `Autre` | `405 Method Not Allowed` | Retourné si la méthode HTTP utilisée n'est pas `GET` |
| *Toutes les autres routes* | `Toutes` | `404 Not Found` | Retourné lorsqu'une route demandée n'existe pas |


## Commandes curl pour tester l'API

```bash
# 1. Route racine (/)
curl -i http://localhost:3000/

# 2. État de santé (/api/health)
curl -i http://localhost:3000/api/health

# 3. Informations générales (/api/info)
curl -i http://localhost:3000/api/info

# 4. Message de bienvenue (/api/welcome)
curl -i http://localhost:3000/api/welcome

# 5. Version (/api/version)
curl -i http://localhost:3000/api/version

# 6. Diagnostic - GET 200 (/api/diagnostic)
curl -i http://localhost:3000/api/diagnostic

# 7. Diagnostic - POST 405 (Méthode non autorisée)
curl -i -X POST http://localhost:3000/api/diagnostic

# 8. Route non trouvée - 404
curl -i http://localhost:3000/api/inconnu

```

# 4. Activité 1 — Vérifier l’environnement de travail

### Questions

1. Quelle version de Node.js est installée ?
    - v18.19.1
2. Quelle version de npm est installée ?
    - 9.2.0
3. Quelle commande permet de vérifier le chemin de l’exécutable Node.js ?
    - which node
4. Quelle commande permet de vérifier le chemin de l’exécutable npm ?
    - which npm


# 5. Activité 2 — Créer le projet Node.js

### Questions


1. Quel est le rôle du champ name ?
    - Donner le nom du projet.
2. Quel est le rôle du champ version ?
    - Donner la version du projet.
3. À quoi sert la section scripts ?
    - Permet la definition des commandes executable dans le terminal en utilsant "npm".
4. Pourquoi le fichier package.json est-il important dans un projet backend ?
    - C'est l'identite du projet et ou la gestion des packages necessaires pour le projet.
5. Quelle différence existe-t-il entre le code de l’application et la configuration du projet ?
    - Le code est le logique et le fonctionnement du projet, la configuration est les parametres et les regles lies a l'environnement d'execution.


# 6. Activité 3 — Ouvrir le projet dans VS Code

### Questions


1. Quel est le rôle d’un éditeur de code ?
    - Son role est de rediger et structurer des texte.
2. Quelle différence existe-t-il entre un éditeur et un environnement d’exécution ?
    - L'editeur sert a ecrire le code mais l'environnement d'execution traduit et execute le code ecrit.
3. Pourquoi est-il utile de travailler dans un dossier de projet ouvert dans VS Code ?
    - VS code offre beaucoup de fonctionnalites qu' ils simplifient l'organisation et le recherche dans un projet. 
4. Quel est l’intérêt d’un outil de formatage automatique ?
    - Pour garantir un code lisible, uniforme et propre


# 7. Activité 4 — Écrire un premier programme Node.js

## 7.1. Utiliser une variable

### Questions


1. Quelle différence existe-t-il entre const et let ?
    - Un const est un variable non redeclarable et non reassignable. Un let est un variable reassigniable mais non redeclarable 
2. Que signifie l’utilisation des accents graves dans une chaîne de caractères ?
    - Permet de creer une chaine de modele (Template Literal) facilitant l'interpolation des variable dans le chaine.
3. Quel est le rôle de l’interpolation ${...} ?
    - Permet d'inserer directement des variable dans une chaine.
4. Pourquoi est-il préférable de déclarer une constante pour une valeur qui ne change pas ?
    - Pour eviter les modification accidentelles du code.


# 8. Activité 5 — Créer un serveur HTTP avec node:http 

### Questions

1. Quel est le rôle de http.createServer() ?
    - Permet la creation du serveur http.
2. À quel moment la fonction (req, res) => { ... } est-elle exécutée ?
    - Achaque fois le serveur recue une requette.
3. Quelle est la différence entre req et res ?
    - req est l'information recue par le serveur, res est l'information envoyee par le serveur.
4. Quel est le rôle de res.writeHead() ?
    - Envoie le code de statut et les en-têtes http.
5. Quel est le rôle de res.end() ?
    - Finalise l'envoi de la réponse http au client.
6. Que se passe-t-il si le port 3000 est déjà utilisé ?
    - Un erreur de port 
7. Comment arrêter le serveur depuis le terminal ?
    - CTRL + C


# 9. Activité 6 — Créer des routes HTTP simples

### Questions

1. Quelle propriété permet de connaître la méthode HTTP ?
    - req.method
2. Quelle propriété permet de connaître l’URL demandée ?
    - req.url
3. Que renvoie req.method lorsque vous ouvrez une page dans un navigateur ?
    - GET
4. Que renvoie req.url lorsque vous consultez /api/health ?
    - "/api/health"

##9.1 Creation des routes

### Questions

1. Pourquoi utilise-t-on return après chaque réponse ?
    - Pour stopper l'execution du code suivant et ne pas envoyer le status 404 avec le status 200.
2. Pourquoi la réponse 404 doit-elle être placée après les routes connues ?
    - Parce que la vérification du code se fait de manière séquentielle.
3. Que se passe-t-il lorsqu’une URL n’est pas définie ?
    - La requête traverse tous les blocs if sans entrer dans aucun d'eux, puis retombe sur le code final qui renvoie le statut HTTP 404 avec le message "Route non trouvée".
4. Une URL identique peut-elle être utilisée avec plusieurs méthodes HTTP ?
    - Oui.

# 10. Activité 6.1 — Créer une fonction utilitaire JSON

### Questions

1. Quelle instruction transforme un objet JavaScript en chaîne JSON ?
    - JSON.stringify()
2. Quel est le rôle de Content-Type ?
    - C'est un en-tete http qui indique au client le format de la donnée renvoyée dans le corps de la réponse.
3. Pourquoi est-il intéressant de regrouper ces instructions dans une fonction ?
    - Pour éviter la répétition de code.
4. Quels paramètres la fonction devrait-elle recevoir ?
    - l’objet ServerResponse, le code de statut http et les données à convertir en JSON.

### Questions

1. Pourquoi faut-il utiliser return après l’appel à sendJson() ?
    - our stopper l'exécution de la fonction qui traite la requête.
2. Que se passe-t-il si plusieurs réponses sont envoyées pour une même requête ?
    - Un erreur "ERR_HTTP_HEADERS_SENT" sera afficher.
3. Quel code de statut est utilisé pour une réponse réussie ?
    - 200
4. Comment retourner une réponse avec le code 404 ?
    - sendJson(res, { error: "Ressource non trouvée" }, 404);


# 11. Activité 6.2 — Utiliser différents codes de statut HTTP

### Questions 

1. Quel code est renvoyé par /api/health ?
    - {"status":"ok","service":"SangConnect"}
2. Quel code est renvoyé par une route inexistante ?
    - {"error":"Route non trouvée","path":"/api/inconnue","method":"GET","timestamp":"2026-09-28T15:28:23.649Z"}
3. Pourquoi ne faut-il pas retourner 200 lorsqu’une route n’existe pas ?
    - Parce qu'on a un code de verification, si la route n'existe pas, on retourne 404.
4. Quelle différence existe-t-il entre le code HTTP et le contenu JSON ?
    - Le code HTTP indique le statut de la requête au niveau réseau, tandis que le contenu JSON transporte les données applicatives dans le corps de la réponse.


# 12. Activité 6.3 — Ajouter une route /api/info

### Questions

1. Quel objet Node.js permet d’accéder aux informations du processus ?
     - process
2. Quelle propriété permet d’obtenir la version de Node.js ?
    - process.version
3. Pourquoi la version de l’application est-elle distincte de celle de Node.js ?
    - La version de Node.js correspond à l'environnement d'execution, tandis que la version de l'application correspond au projet.
4. Quelles autres informations pourraient être retournées ?
    - Le temps de fonctionnement du serveur (process.uptime()), l'utilisation de la mémoire (process.memoryUsage()), l'identifiant du processus (process.pid).


# 13. Activité 6.4 — Examiner la méthode HTTP

### Questions

1. Quelle propriété permet de connaître la méthode HTTP ?
    - req.method
2. Quelle propriété permet de connaître l’URL ?
    - req.url
3. Quelle différence existe-t-il entre GET et POST ?
    - GET sert à lire des données sans les modifier, tandis que POST sert à envoyer des données au serveur pour les créer ou les modifier.
4. Pourquoi une route doit-elle tenir compte de la méthode ?
    - Pour assurer la gestion de la route et leur fonctionalites.
5. Une même URL peut-elle être associée à plusieurs méthodes ?
    - Oui 


# 14. Activité 7 — Tester l’API avec CURL

### Tableau de validation

| URL | Méthode | Code attendu | Code observé | Résultat |
| :--- | :--- | :--- | :--- | :--- |
| `/` | `GET` | 200 | 200 | Conforme |
| `/api/health` | `GET` | 200 | 200 | Conforme |
| `/api/info` | `GET` | 200 | 200 | Conforme |
| `/api/diagnostic` | `GET` | 200 | 200 | Conforme |
| `/api/inconnue` | `GET` | 404 | 404 | Conforme |
| `/api/diagnostic` | `POST` | 405 | 405 | Conforme |

### Questions 

1. Toutes les réponses possèdent-elles un Content-Type ?  
   - Oui, toutes les réponses retournent Content-Type: application/json grâce à la fonction sendJson.
2. Les codes HTTP sont-ils cohérents ?  
   - Oui, ils respectent les normes REST : 200 pour un succès, 404 pour une route introuvable et 405 pour une méthode non autorisée.
3. Que se passe-t-il si le serveur est arrêté ?  
   - curl affiche une erreur de connexion réseau (Connection refused) car aucun processus ne réponds sur le port 3000.
4. Pourquoi tester une route existante et une route inexistante ?  
   - Pour valider à la fois le bon fonctionnement du code nominal et la gestion correcte des erreurs par l'API.
5. Quel est l’intérêt de l’option -i ?  
   - L'option -i permet d'afficher les en-têtes HTTP de la réponse (incluant le code de statut et le Content-Type) en plus du corps JSON.


# 15. Activité 8 — Créer un mini health check

### Questions 

1. Pourquoi utilise-t-on une route de santé ?
    - Pour permettre aux outils de supervision de savoir instantanément si le serveur fonctionne.
2. Pourquoi cette route doit-elle rester rapide ?
    - Pour ne pas surcharger le serveur et éviter de bloquer le processeur avec des tests fréquents.
3.Quelle différence existe-t-il entre une vérification de disponibilité et une vérification complète ?
    - La disponibilité indique si le serveur répond, tandis qu'une vérification complète s'assure que toutes ses dépendances fonctionnent.
4. Quelles vérifications supplémentaires seraient possibles dans une application réelle ?
    - Vérifier la base de données, l'espace disque, la mémoire, les API externes et les variables d'environnement.


# 16. Activité 9 — Vérifier l’organisation du code

### Questions 

1. Quel est le rôle de server.js ?
    - Recevoir les requêtes HTTP et démarrer l'écoute du serveur web.
2. Que se passe-t-il si l’application possède 30 routes ?
    - Le fichier devient illisible, extrêmement long et très difficile à maintenir.
3. Pourquoi de nombreuses conditions if compliquent-elles la maintenance ?
    - Elles rendent le code rigide, propice aux bugs et complexe à tester ou faire évoluer.
4. Comment pourrait-on séparer les routes dans plusieurs fichiers ?
    - En créant un système de routage modulaire qui associe chaque URL à un fichier spécifique.
5. Quelles responsabilités pourraient être confiées à des fichiers distincts ?
    - Le routage, la logique métier, l'accès aux données et les fonctions utilitaires.


# 17. Travail pratique à faire à la maison

