# Application Express.js pour Mocking d'API

Cette application Express.js permet de mocker des API en utilisant des collections et des endpoints. Les utilisateurs peuvent créer, modifier ou supprimer des collections ainsi que des endpoints. L'application offre la possibilité de créer des API à partir des endpoints créés par l'utilisateur et de les lancer. Les endpoints seront ensuite disponibles en fonction du chemin spécifié dans les endpoints.

## Exemple de structure de données

Voici un exemple de structure de données utilisée par l'application :

```typescript
export type Endpoint = {
  _id?: string;
  status: number;
  name: string;
  method:
    | "get"
    | "post"
    | "delete"
    | "put"
    | "head"
    | "options"
    | "trace"
    | "connect";
  path: string;
  comment?: string;
  response: {} | [] | string;
};

export type Collection = {
  _id?: string;
  name: string;
  comment?: string;
  prefix?: string | undefined;
  endpoints: Endpoint[];
};

export type DatabaseStructure = {
  collections: Collection[];
};
```

## Fonctionnalités

- **Gestion des Collections :** Permet de créer, modifier ou supprimer des collections d'endpoints.
- **Gestion des Endpoints :** Ajoutez, éditez ou supprimez des endpoints dans une collection.
- **Création d'API :** Créez des API à partir des endpoints définis par l'utilisateur.
- **Lancement des API :** Lancez les API, rendant les endpoints disponibles selon leur chemin spécifié.
- **Stopper des API :** Stopper les API, rendant les endpoints indisponibles.

## Dépendances

Voici les dépendances utilisées dans ce projet :

- **express:** Framework web pour Node.js.
- **@types/express:** Fichiers de types pour Express.js.
- **lowdb:** Base de données JSON simple pour Node.js.
- **@types/lowdb:** Fichiers de types pour LowDB.
- **nedb:** Base de données NoSQL intégrée pour Node.js.
- **@types/nedb:** Fichiers de types pour NeDB.
- **cookie-parser:** Middleware de parsing des cookies pour Express.js.
- **debug:** Module pour faciliter le débogage des applications Node.js.
- **http-errors:** Création d'objets d'erreur HTTP pour Express.js.
- **jade:** Moteur de template pour Express.js (facultatif, utilisé pour les vues).
- **method-override:** Middleware pour Express.js permettant de simuler d'autres méthodes HTTP.
- **morgan:** Middleware de logging HTTP pour Express.js.
- **uuid:** Génération d'UUID (identifiants uniques) pour Node.js.

Ces dépendances sont installées automatiquement lorsque vous exécutez la commande `npm install`.

