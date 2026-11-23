import { z } from "zod";

export const idSchema = z.object({
    id: z.coerce.number().int().positive()
});

export const updateUserSchema = z.object({

    nom: z.string().min(2).optional(),

    email: z.string().email().optional(),

    role: z.enum([
        "ADMIN",
        "AGENT_CENTRE",
        "RESPONSABLE_STOCK"
    ]).optional()

});
