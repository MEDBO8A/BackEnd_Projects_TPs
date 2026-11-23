import express from "express";
import { validate } from "../middlewares/validate.js";

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

router.get("/", validate(donQuerySchema, "query"), getAll);
router.get("/:id", validate(idSchema, "params"), getById);
router.post("/", validate(donSchema), create);
router.put("/:id", validate(idSchema, "params"), validate(donSchema), update);
router.patch("/:id", validate(idSchema, "params"), validate(updateDonSchema), patch);
router.delete("/:id", validate(idSchema, "params"), remove);

export default router;
