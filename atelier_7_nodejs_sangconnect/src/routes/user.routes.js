import express from "express";

import { authenticate } from "../middlewares/auth.js";
import { authorize } from "../middlewares/authorize.js";
import { validate } from "../middlewares/validate.js";

import {
    idSchema,
    updateUserSchema
} from "../validators/user.validator.js";

import {
    getAll,
    getById,
    update,
    patch,
    remove
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", authenticate, getAll);

router.get(
    "/:id",
    authenticate,
    validate(idSchema, "params"),
    getById
);

router.put(
    "/:id",
    authenticate,
    authorize("ADMIN"),
    validate(idSchema, "params"),
    validate(updateUserSchema),
    update
);

router.patch(
    "/:id",
    authenticate,
    authorize("ADMIN"),
    validate(idSchema, "params"),
    validate(updateUserSchema),
    patch
);

router.delete(
    "/:id",
    authenticate,
    authorize("ADMIN"),
    validate(idSchema, "params"),
    remove
);

export default router;
