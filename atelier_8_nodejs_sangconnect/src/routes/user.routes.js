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

/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: Lister les utilisateurs
 *     description: Retourne tous les utilisateurs sans leur mot de passe.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Token manquant, invalide ou expiré.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/", authenticate, getAll);

/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     summary: Consulter un utilisateur
 *     description: Retourne un utilisateur par son identifiant.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Identifiant de l'utilisateur.
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 1
 *     responses:
 *       200:
 *         description: Utilisateur trouvé.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Identifiant invalide.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Token manquant, invalide ou expiré.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Utilisateur introuvable.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
    "/:id",
    authenticate,
    validate(idSchema, "params"),
    getById
);

/**
 * @openapi
 * /api/users/{id}:
 *   put:
 *     summary: Remplacer un utilisateur
 *     description: Met à jour les champs fournis d'un utilisateur. Réservé au rôle ADMIN.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Identifiant de l'utilisateur.
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRequest'
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Données ou identifiant invalides.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Token manquant, invalide ou expiré.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Accès refusé, rôle ADMIN requis.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Utilisateur introuvable.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put(
    "/:id",
    authenticate,
    authorize("ADMIN"),
    validate(idSchema, "params"),
    validate(updateUserSchema),
    update
);

/**
 * @openapi
 * /api/users/{id}:
 *   patch:
 *     summary: Modifier partiellement un utilisateur
 *     description: Met à jour un ou plusieurs champs d'un utilisateur. Réservé au rôle ADMIN.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Identifiant de l'utilisateur.
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRequest'
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Données ou identifiant invalides.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Token manquant, invalide ou expiré.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Accès refusé, rôle ADMIN requis.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Utilisateur introuvable.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch(
    "/:id",
    authenticate,
    authorize("ADMIN"),
    validate(idSchema, "params"),
    validate(updateUserSchema),
    patch
);

/**
 * @openapi
 * /api/users/{id}:
 *   delete:
 *     summary: Supprimer un utilisateur
 *     description: Supprime un utilisateur. Réservé au rôle ADMIN.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Identifiant de l'utilisateur.
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 1
 *     responses:
 *       204:
 *         description: Utilisateur supprimé, aucune donnée retournée.
 *       400:
 *         description: Identifiant invalide.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Token manquant, invalide ou expiré.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Accès refusé, rôle ADMIN requis.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Utilisateur introuvable.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete(
    "/:id",
    authenticate,
    authorize("ADMIN"),
    validate(idSchema, "params"),
    remove
);

export default router;
