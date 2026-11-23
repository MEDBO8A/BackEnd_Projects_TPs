import express from "express";
import { validate } from "../middlewares/validate.js";

import { donneurQuerySchema, donneurSchema, idSchema, updateDonneurSchema } from "../validators/donneur.validator.js";
import {
    getAll,
    getById,
    create,
    update,
    patch,
    remove
} from "../controllers/donneur.controller.js";

import { getByDonneur as getDonsByDonneur }
    from "../controllers/don.controller.js";

const router = express.Router();

router.get("/", validate(donneurQuerySchema, "query"), getAll);
router.get("/:id", validate(idSchema, "params"), getById);
router.post("/", validate(donneurSchema), create);
router.put("/:id", validate(idSchema, "params"), validate(donneurSchema, "body"), update);
router.patch("/:id", validate(idSchema, "params"), validate(updateDonneurSchema), patch);
router.delete("/:id", validate(idSchema, "params"), remove);

// GET /api/donneurs/:id/dons
router.get("/:id/dons", validate(idSchema, "params"), getDonsByDonneur);

export default router;