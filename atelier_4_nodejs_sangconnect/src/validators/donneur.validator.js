import { z } from "zod";

export const donneurSchema = z.object({

    nom: z.string().min(2),

    prenom: z.string().min(2),

    groupeSanguin: z.enum([
        "A+",
        "A-",
        "B+",
        "B-",
        "AB+",
        "AB-",
        "O+",
        "O-"
    ])

});

export const idSchema = z.object({
    id: z.coerce.number().int().positive()
});

export const donneurQuerySchema = z.object({
    groupeSanguin: z.enum([
        "A+",
        "A-",
        "B+",
        "B-",
        "AB+",
        "AB-",
        "O+",
        "O-"
    ]).optional()
});

export const updateDonneurSchema = donneurSchema.partial();

/* TEST */
const donneur = {
    nom: "",
    prenom: "Ahmed",
    groupeSanguin: "XYZ"
};

const resultat = donneurSchema.safeParse(donneur);

console.log(resultat.success);
if (!resultat.success) {
    console.log(resultat.error);
}