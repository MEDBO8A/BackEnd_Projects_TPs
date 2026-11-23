import { z } from "zod";

const groupeSanguinSchema = z.enum([
    "A+",
    "A-",
    "B+",
    "B-",
    "AB+",
    "AB-",
    "O+",
    "O-"
]);

export const donSchema = z.object({

    volume: z.number().int().positive(),

    dateDon: z.coerce.date().optional(),

    donneurId: z.number().int().positive(),

    centreId: z.number().int().positive()

});

export const updateDonSchema = donSchema.partial();

export const idSchema = z.object({
    id: z.coerce.number().int().positive()
});

export const donQuerySchema = z.object({

    centreId: z.coerce.number().int().positive().optional(),

    donneurId: z.coerce.number().int().positive().optional(),

    ville: z.string().min(1).optional(),

    groupeSanguin: groupeSanguinSchema.optional(),

    page: z.coerce.number().int().positive().optional(),

    limit: z.coerce.number().int().positive().optional(),

    sortBy: z.enum(["dateDon", "volume"]).optional(),

    order: z.enum(["asc", "desc"]).optional()

});
