## Med Amine Boughalleb - 4GL


# 4. Activité 1 — Comprendre les modules Node.js

### Questions

1. Est-il facile de retrouver la fonction responsable de la recherche d’un centre ?
    - Non, si tout est dans un seul gros fichier.
2. Que se passe-t-il si plusieurs fichiers ont besoin de getCentreById() ?
    - Il faudrait copier-coller le code, ce qui crée de la duplication.
3. Pourquoi serait-il intéressant de placer cette fonction dans un fichier séparé ?
    - Pour la réutiliser facilement et rendre le code plus propre.
4. Quel pourrait être le rôle d’un module ?
    - Structurer et découper le code en sous-ensembles indépendants.


# 6. Activité 3 — export et import

### Questions


1. Pourquoi les accolades sont-elles utilisées lors de l’import ?
    - Pour importer des éléments nommés spécifiques d'un module.
2. Peut-on exporter plusieurs fonctions depuis un même fichier ?
    - Oui, en utilisant plusieurs export.
3. Quel est l’intérêt de regrouper plusieurs fonctions liées dans un module ?
    - Faciliter la réutilisation et l'organisation du code.


# 7. Activité 4 — Comprendre les fonctions asynchrones

### Questions

1. Pourquoi "Fin" apparaît-il avant "Opération terminée" ?
    - Car setTimeout est exécuté en arrière-plan sans bloquer la suite.
2. Le programme est-il bloqué pendant les deux secondes ?
    - Non, il continue d'exécuter le reste du code.
3. Que représente l’opération programmée avec setTimeout() ?
    - Une tâche différée exécutée après un délai.
4. Pourquoi ce comportement est-il intéressant pour un serveur ?
    - Pour traiter d'autres requêtes en même temps sans figer l'application.


# 8. Activité 5 — Comprendre les Promises

### Questions

1. Que contient la Promise au début ?
    - L'état pending (en attente de résolution).
2. Que fait resolve() ?
    - Elle valide la Promise avec un succès.
3. Que fait reject() ?
    - Elle échoue la Promise avec une erreur.
4. Que se passe-t-il après une seconde ?
    - La Promise bascule en état résolu ou rejeté.
5. Pourquoi utilise-t-on .then() ?
    - Pour récupérer le résultat d'une Promise réussie.


# 9. Activité 6 — Promise réussie et Promise rejetée

### Questions

1. Pourquoi utilise-t-on reject() ?
    - Pour signaler qu'une opération asynchrone a échoué.
2. Quel est le rôle de .catch() ?
    - Attraper et gérer les erreurs d'une Promise.
3. Quelle différence existe-t-il entre une valeur retournée et une erreur ?
    - Une valeur est un succès, une erreur est un échec.
4. Pourquoi la gestion des erreurs est-elle importante dans une API backend ?
    - Pour éviter le plantage du serveur et informer le client.


# 10. Activité 7 — Utiliser async/await

### Questions

1. Que signifie le mot-clé async ?
    - Indique qu'une fonction retourne automatiquement une Promise.
2. Que signifie await ?
    - Met en pause l'exécution de la fonction jusqu'à la résolution de la Promise.
3. Pourquoi await ne bloque-t-il pas tout le serveur pendant l’attente ?
    - Seule la fonction courante attend, le serveur reste disponible.
4. Que se passe-t-il si la Promise est rejetée ?
    - Une erreur est levée et peut être attrapée.

# 11. Activité 8 — Gérer les erreurs avec try/catch

### Questions

1. Quel est le rôle de try ?
    - Encadrer le code susceptible de lever une erreur.
2. Quel est le rôle de catch ?
    - Intercepter et traiter l'erreur si elle survient.
3. Quelle variable contient l’erreur ?
    - La variable passée en paramètre dans catch(error).
4. Pourquoi ne doit-on pas laisser les erreurs asynchrones sans traitement ?
    - Cela risque de faire planter l'application brutalement.


# 12. Activité 9 — Créer un repository de centres

### Questions

1. Où sont maintenant stockées les données ?
    - Dans le fichier du dossier "repository".
2. Pourquoi ce fichier est-il appelé repository ?
    - Car il gère l'accès et le stockage des données.
3. Le repository connaît-il HTTP ?
    - Non, il ne gère pas le réseau.
4. Le repository connaît-il req et res ?
    - Non, il ignore tout du protocole Web.
5. Pourquoi cette séparation est-elle intéressante ?
    - Séparer l'accès aux données du reste de l'application.


# 13. Activité 10 — Créer le service métier

### Questions

1. Quel est le rôle du service ?
    - Contenir la logique métier de l'application.
2. Pourquoi le service utilise-t-il le repository ?
    - Pour aller chercher ou modifier les données nécessaires.
3. Pourquoi le service ne manipule-t-il pas directement res ?
    - Il ne s'occupe pas de la réponse HTTP.
4. Où doit être placée une règle métier ?
    - Dans la couche service.
5. Pourquoi séparer le service du repository ?
    - Isoler les règles métier du stockage des données.


# 14. Activité 11 — Créer le contrôleur

### Questions

1. Quel est le rôle du contrôleur ?
    - Recevoir la requête HTTP et renvoyer la réponse.
2. Pourquoi le contrôleur connaît-il HTTP ?
    - Car il interagit avec la couche HTTP.
3. Pourquoi appelle-t-il le service ?
    - Pour lui déléguer le traitement métier.
4. Pourquoi le service ne doit-il pas appeler sendJson() ?
    - Seul le contrôleur doit former la réponse HTTP.
5. Où est gérée l’erreur « Centre introuvable » ?
    - Dans le contrôleur après l'appel au service.


# 15. Activité 12 — Créer les routes des centres

### Questions

1. Quel est le rôle de handleCentreRoutes() ?
    - Associer l'URL demandée au bon contrôleur.
2. Pourquoi cette fonction retourne-t-elle true ou false ?
    - Pour indiquer au serveur si la route a été traitée.
3. Que représente match[1] ?
    - Le premier paramètre extrait depuis l'url.
4. Pourquoi utilise-t-on Number() ?
    - Pour convertir l'ID texte extrait de l'URL en nombre.
5. Pourquoi la route /api/centres/1 doit-elle être distinguée de /api/centres ?
    - Car l'une traite la liste et l'autre une ressource précise.


# 17. Activité 14 — Tester l’architecture

### Questions

1. Quelle couche reçoit la requête HTTP en premier ?
    - La route.
2. Quelle couche contient les données ?
    - Le repository.
3. Quelle couche contient la logique métier ?
    - Le service.
4. Quelle couche produit la réponse HTTP ?
    - Le contrôleur.
5. Peut-on remplacer les données fictives par une base de données sans modifier les routes ?
    - Oui, sans toucher aux autres couches.


# 18. Activité 15 — Ajouter une recherche de centres

### Questions

1. Pourquoi la vérification : if (!city || city.trim() === "")
2. doit-elle se trouver dans le service plutôt que dans le repository ?


# 19. Activité 16 — Simuler une erreur asynchrone

### Questions

1. Quelle couche génère l’erreur ?
    - La couche service ou repository.
2. Quelle couche la récupère ?
    - Le contrôleur.
3. Quel code HTTP doit être retourné ?
    - Le code 500.
4. Pourquoi ne faut-il pas retourner le message technique complet d’une erreur interne au client dans une véritable application ?
    - Pour éviter de révéler des failles de sécurité.


# 21. Activité 18 — Questions de synthèse

### Questions 

1. Quelle différence existe entre : function getCentre() {} et : async function getCentre() {}
    - La première est synchrone, la seconde est asynchrone et retourne une Promise.
2. Quelle différence existe entre : const result = await operation(); et : operation().then(result => {});
    - await lit le code de manière séquentielle, .then() utilise un callback.
3. Quels sont les trois états principaux d’une Promise ?
    - pending (en attente), fulfilled (résolue), rejected (rejetée).
4. Quel est le rôle de try/catch avec async/await ?
    - Intercepter les erreurs levées par await.
5. Pourquoi faut-il éviter de mettre toute la logique dans server.js ?
    - Pour éviter un fichier illisible et ingérable.
6. Quelle est la responsabilité du repository ?
    - Gérer l'accès aux données.
7. Quelle est la responsabilité du service ?
    - Appliquer la logique métier.
8. Quelle est la responsabilité du controller ?
    - Gérer les requêtes et réponses HTTP.
9. Pourquoi cette architecture facilite-t-elle les tests ?
    - Chaque couche peut être testée indépendamment.
10. Quelle partie de l’architecture pourrait être remplacée lorsqu’une vraie base PostgreSQL sera introduite ?
    - La couche Repository.