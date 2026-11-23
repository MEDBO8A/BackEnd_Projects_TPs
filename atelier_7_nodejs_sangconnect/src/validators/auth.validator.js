import { z } from "zod";

// Mot de passe plus strict demandé dans l'activité 11
const passwordSchema = z.string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[A-Za-z]/, "Le mot de passe doit contenir au moins une lettre")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre");

export const registerSchema = z.object({

    nom: z.string().min(2),

    email: z.string().email(),

    password: passwordSchema,

    role: z.enum([
        "ADMIN",
        "AGENT_CENTRE",
        "RESPONSABLE_STOCK"
    ]).optional()

});

export const loginSchema = z.object({

    email: z.string().email(),

    password: z.string().min(1)

});
