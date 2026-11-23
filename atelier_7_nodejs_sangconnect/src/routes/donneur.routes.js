import express from "express";
import { validate } from "../middlewares/validate.js";
import { authenticate } from "../middlewares/auth.js";
import { authorize } from "../middlewares/authorize.js";

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

router.get("/", authenticate, validate(donneurQuerySchema, "query"), getAll);
router.get("/:id", authenticate, validate(idSchema, "params"), getById);
router.get("/:id/dons", authenticate, validate(idSchema, "params"), getDonsByDonneur);

router.post("/", authenticate, authorize("ADMIN", "AGENT_CENTRE"), validate(donneurSchema), create);
router.put("/:id", authenticate, authorize("ADMIN", "AGENT_CENTRE"), validate(idSchema, "params"), validate(donneurSchema), update);
router.patch("/:id", authenticate, authorize("ADMIN", "AGENT_CENTRE"), validate(idSchema, "params"), validate(updateDonneurSchema), patch);
router.delete("/:id", authenticate, authorize("ADMIN"), validate(idSchema, "params"), remove);

export default router;
