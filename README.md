##Med Amine Boughalleb - 4GL
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

