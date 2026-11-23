import express from "express";
import { validate } from "../middlewares/validate.js";
import { authenticate } from "../middlewares/auth.js";
import { authorize } from "../middlewares/authorize.js";

import {
    donQuerySchema,
    donSchema,
    idSchema,
    updateDonSchema
} from "../validators/don.validator.js";

import {
    getAll,
    getById,
    create,
    update,
    patch,
    remove
} from "../controllers/don.controller.js";

const router = express.Router();

// Consulter les dons : tous les rôles
router.get("/", authenticate, validate(donQuerySchema, "query"), getAll);
router.get("/:id", authenticate, validate(idSchema, "params"), getById);

// Créer / modifier un don : ADMIN et AGENT_CENTRE
router.post("/", authenticate, authorize("ADMIN", "AGENT_CENTRE"), validate(donSchema), create);
router.put("/:id", authenticate, authorize("ADMIN", "AGENT_CENTRE"), validate(idSchema, "params"), validate(donSchema), update);
router.patch("/:id", authenticate, authorize("ADMIN", "AGENT_CENTRE"), validate(idSchema, "params"), validate(updateDonSchema), patch);

// Supprimer : ADMIN uniquement
router.delete("/:id", authenticate, authorize("ADMIN"), validate(idSchema, "params"), remove);

export default router;
