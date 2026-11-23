import swaggerJsdoc from "swagger-jsdoc";

/**
 * Configuration centrale de la documentation OpenAPI de SangConnect.
 *
 * Les schémas décrivent exactement les objets échangés par l'API de l'atelier 7
 * (champs en français : nom, prenom, groupeSanguin, ...).
 * Les annotations des endpoints se trouvent dans les fichiers de routes.
 */
const options = {
    definition: {
        openapi: "3.0.3",

        info: {
            title: "SangConnect API",
            version: "1.0.0",
            description: `
API REST de gestion des dons de sang.

Cette API permet de gérer :

- les **donneurs** (création, consultation, modification, suppression) ;
- les **utilisateurs** et leurs rôles ;
- les **dons de sang** et leur historique ;
- l'**authentification** JWT.

## Authentification

La connexion se fait avec \`POST /api/auth/login\`.
La réponse contient un champ \`token\` : utilisez le bouton **Authorize**
et saisissez ce token (Swagger ajoutera automatiquement
\`Authorization: Bearer <token>\`).

Les routes publiques (\`/\`, \`/api/auth/register\`, \`/api/auth/login\`)
ne nécessitent pas de token.
`,
            contact: {
                name: "SangConnect — Projet fil rouge 4GL"
            },
            license: {
                name: "ISC"
            }
        },

        servers: [
            {
                url: "http://localhost:3000",
                description: "Serveur de développement"
            }
        ],

        tags: [
            {
                name: "Root",
                description: "Endpoint d'accueil de l'API"
            },
            {
                name: "Authentication",
                description: "Inscription, connexion et profil de l'utilisateur connecté"
            },
            {
                name: "Users",
                description: "Gestion des utilisateurs (ADMIN pour les modifications)"
            },
            {
                name: "Donors",
                description: "Gestion des donneurs de sang"
            },
            {
                name: "Donations",
                description: "Gestion des dons de sang"
            }
        ],

        // Pas de sécurité globale : certaines routes sont publiques.
        // La règle bearerAuth est déclarée uniquement sur les routes protégées
        // (voir la question 13 de l'atelier 8).
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description: "Saisir le token JWT obtenu avec POST /api/auth/login."
                }
            },

            schemas: {
                RootResponse: {
                    type: "object",
                    properties: {
                        message: {
                            type: "string",
                            example: "Bienvenue dans l'API SangConnect"
                        }
                    },
                    required: ["message"]
                },

                Role: {
                    type: "string",
                    enum: ["ADMIN", "AGENT_CENTRE", "RESPONSABLE_STOCK"],
                    description: "Rôle d'un utilisateur SangConnect.",
                    example: "AGENT_CENTRE"
                },

                GroupeSanguin: {
                    type: "string",
                    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
                    description: "Groupe sanguin (système ABO + rhésus).",
                    example: "O+"
                },

                Donor: {
                    type: "object",
                    description: "Donneur tel que retourné par l'API.",
                    properties: {
                        id: {
                            type: "integer",
                            example: 1
                        },
                        nom: {
                            type: "string",
                            example: "Ben Ali"
                        },
                        prenom: {
                            type: "string",
                            example: "Ahmed"
                        },
                        groupeSanguin: {
                            $ref: "#/components/schemas/GroupeSanguin"
                        },
                        telephone: {
                            type: "string",
                            nullable: true,
                            example: "+21612345678"
                        }
                    },
                    required: ["id", "nom", "prenom", "groupeSanguin"]
                },

                CreateDonor: {
                    type: "object",
                    description: "Données attendues pour créer un donneur (sans id).",
                    properties: {
                        nom: {
                            type: "string",
                            minLength: 2,
                            example: "Ben Ali"
                        },
                        prenom: {
                            type: "string",
                            minLength: 2,
                            example: "Ahmed"
                        },
                        groupeSanguin: {
                            $ref: "#/components/schemas/GroupeSanguin"
                        },
                        telephone: {
                            type: "string",
                            minLength: 8,
                            example: "+21612345678"
                        }
                    },
                    required: ["nom", "prenom", "groupeSanguin"]
                },

                UpdateDonor: {
                    type: "object",
                    description: "Champs modifiables d'un donneur (tous facultatifs).",
                    properties: {
                        nom: {
                            type: "string",
                            minLength: 2,
                            example: "Ben Ali"
                        },
                        prenom: {
                            type: "string",
                            minLength: 2,
                            example: "Ahmed"
                        },
                        groupeSanguin: {
                            $ref: "#/components/schemas/GroupeSanguin"
                        },
                        telephone: {
                            type: "string",
                            minLength: 8,
                            example: "+21612345678"
                        }
                    }
                },

                User: {
                    type: "object",
                    description: "Utilisateur public : le mot de passe n'est jamais exposé.",
                    properties: {
                        id: {
                            type: "integer",
                            example: 1
                        },
                        nom: {
                            type: "string",
                            example: "Ahmed"
                        },
                        email: {
                            type: "string",
                            format: "email",
                            example: "ahmed@sangconnect.tn"
                        },
                        role: {
                            $ref: "#/components/schemas/Role"
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time",
                            example: "2026-11-23T10:00:00.000Z"
                        },
                        updatedAt: {
                            type: "string",
                            format: "date-time",
                            example: "2026-11-23T10:00:00.000Z"
                        }
                    },
                    required: ["id", "nom", "email", "role", "createdAt", "updatedAt"]
                },

                RegisterRequest: {
                    type: "object",
                    description: "Création d'un compte. Rôle par défaut : AGENT_CENTRE.",
                    properties: {
                        nom: {
                            type: "string",
                            minLength: 2,
                            example: "Ahmed"
                        },
                        email: {
                            type: "string",
                            format: "email",
                            example: "ahmed@sangconnect.tn"
                        },
                        password: {
                            type: "string",
                            format: "password",
                            minLength: 8,
                            description: "Au moins 8 caractères, une lettre et un chiffre.",
                            example: "Password123"
                        },
                        role: {
                            $ref: "#/components/schemas/Role"
                        }
                    },
                    required: ["nom", "email", "password"]
                },

                RegisterResponse: {
                    type: "object",
                    description: "Compte créé (sans mot de passe, même haché).",
                    properties: {
                        id: { type: "integer", example: 1 },
                        nom: { type: "string", example: "Ahmed" },
                        email: { type: "string", format: "email", example: "ahmed@sangconnect.tn" },
                        role: { $ref: "#/components/schemas/Role" }
                    },
                    required: ["id", "nom", "email", "role"]
                },

                UpdateUserRequest: {
                    type: "object",
                    description: "Champs modifiables d'un utilisateur (tous facultatifs).",
                    properties: {
                        nom: { type: "string", minLength: 2, example: "Ahmed" },
                        email: { type: "string", format: "email", example: "ahmed@sangconnect.tn" },
                        role: { $ref: "#/components/schemas/Role" }
                    }
                },

                LoginRequest: {
                    type: "object",
                    properties: {
                        email: {
                            type: "string",
                            format: "email",
                            example: "ahmed@sangconnect.tn"
                        },
                        password: {
                            type: "string",
                            format: "password",
                            example: "Password123"
                        }
                    },
                    required: ["email", "password"]
                },

                LoginUser: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1 },
                        nom: { type: "string", example: "Ahmed" },
                        email: { type: "string", format: "email", example: "ahmed@sangconnect.tn" },
                        role: { $ref: "#/components/schemas/Role" }
                    },
                    required: ["id", "nom", "email", "role"]
                },

                LoginResponse: {
                    type: "object",
                    description: "Réponse réelle de l'atelier 7 : { token, user }.",
                    properties: {
                        token: {
                            type: "string",
                            description: "Token JWT à utiliser avec le mécanisme bearerAuth (expire après 1 h).",
                            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                        },
                        user: {
                            $ref: "#/components/schemas/LoginUser"
                        }
                    },
                    required: ["token", "user"]
                },

                MeResponse: {
                    type: "object",
                    description: "Profil de l'utilisateur authentifié (issu du payload JWT).",
                    properties: {
                        id: { type: "integer", example: 1 },
                        email: { type: "string", format: "email", example: "ahmed@sangconnect.tn" },
                        role: { $ref: "#/components/schemas/Role" }
                    },
                    required: ["id", "email", "role"]
                },

                DonorSummary: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1 },
                        nom: { type: "string", example: "Ben Ali" },
                        prenom: { type: "string", example: "Ahmed" },
                        groupeSanguin: { $ref: "#/components/schemas/GroupeSanguin" }
                    },
                    required: ["id", "nom", "prenom", "groupeSanguin"]
                },

                Centre: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 2 },
                        nom: { type: "string", example: "Centre de collecte Tunis" },
                        ville: { type: "string", example: "Tunis" }
                    },
                    required: ["id", "nom", "ville"]
                },

                Don: {
                    type: "object",
                    description: "Don avec le résumé du donneur et du centre.",
                    properties: {
                        id: { type: "integer", example: 10 },
                        dateDon: { type: "string", format: "date-time", example: "2026-11-23T10:30:00.000Z" },
                        volume: { type: "integer", minimum: 1, example: 450 },
                        donneurId: { type: "integer", example: 1 },
                        centreId: { type: "integer", example: 2 },
                        donneur: { $ref: "#/components/schemas/DonorSummary" },
                        centre: { $ref: "#/components/schemas/Centre" }
                    },
                    required: ["id", "dateDon", "volume", "donneurId", "centreId", "donneur", "centre"]
                },

                DonWithCentre: {
                    type: "object",
                    description: "Don retourné par l'historique d'un donneur (centre complet).",
                    properties: {
                        id: { type: "integer", example: 10 },
                        dateDon: { type: "string", format: "date-time", example: "2026-11-23T10:30:00.000Z" },
                        volume: { type: "integer", minimum: 1, example: 450 },
                        donneurId: { type: "integer", example: 1 },
                        centreId: { type: "integer", example: 2 },
                        centre: { $ref: "#/components/schemas/Centre" }
                    },
                    required: ["id", "dateDon", "volume", "donneurId", "centreId", "centre"]
                },

                CreateDon: {
                    type: "object",
                    properties: {
                        volume: { type: "integer", minimum: 1, example: 450 },
                        dateDon: {
                            type: "string",
                            format: "date-time",
                            description: "Facultatif : par défaut la date courante.",
                            example: "2026-11-23T10:30:00.000Z"
                        },
                        donneurId: { type: "integer", minimum: 1, example: 1 },
                        centreId: { type: "integer", minimum: 1, example: 2 }
                    },
                    required: ["volume", "donneurId", "centreId"]
                },

                UpdateDon: {
                    type: "object",
                    description: "Champs modifiables d'un don (tous facultatifs).",
                    properties: {
                        volume: { type: "integer", minimum: 1, example: 450 },
                        dateDon: { type: "string", format: "date-time", example: "2026-11-23T10:30:00.000Z" },
                        donneurId: { type: "integer", minimum: 1, example: 1 },
                        centreId: { type: "integer", minimum: 1, example: 2 }
                    }
                },

                DonListResponse: {
                    type: "object",
                    description: "Liste paginée des dons retournée par GET /api/dons.",
                    properties: {
                        data: {
                            type: "array",
                            items: { $ref: "#/components/schemas/Don" }
                        },
                        pagination: {
                            type: "object",
                            properties: {
                                page: { type: "integer", example: 1 },
                                limit: { type: "integer", example: 10 },
                                total: { type: "integer", example: 24 }
                            },
                            required: ["page", "limit", "total"]
                        }
                    },
                    required: ["data", "pagination"]
                },

                ValidationIssue: {
                    type: "object",
                    description: "Détail d'une erreur de validation Zod.",
                    properties: {
                        code: { type: "string", example: "too_small" },
                        path: {
                            type: "array",
                            items: {
                                oneOf: [{ type: "string" }, { type: "integer" }]
                            },
                            example: ["password"]
                        },
                        message: { type: "string", example: "Le mot de passe doit contenir au moins 8 caractères" }
                    }
                },

                ErrorResponse: {
                    type: "object",
                    description: "Format commun des erreurs : { message } ou { message, errors } (validation Zod).",
                    properties: {
                        message: {
                            type: "string",
                            example: "Donneur introuvable"
                        },
                        errors: {
                            type: "array",
                            items: { $ref: "#/components/schemas/ValidationIssue" }
                        }
                    },
                    required: ["message"]
                }
            }
        }
    },

    // Fichiers analysés par swagger-jsdoc pour trouver les annotations @openapi
    apis: ["./src/routes/*.js", "./src/server.js"]
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
