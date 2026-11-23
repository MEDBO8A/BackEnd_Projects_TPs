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

/**
 * @openapi
 * /api/donneurs:
 *   get:
 *     summary: Lister et filtrer les donneurs
 *     description: Retourne tous les donneurs, éventuellement filtrés par groupe sanguin.
 *     tags:
 *       - Donors
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: groupeSanguin
 *         in: query
 *         required: false
 *         description: Filtrer par groupe sanguin.
 *         schema:
 *           $ref: '#/components/schemas/GroupeSanguin'
 *         example: O+
 *     responses:
 *       200:
 *         description: Liste des donneurs.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Donor'
 *       400:
 *         description: Paramètre de recherche invalide.
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
 */
router.get("/", authenticate, validate(donneurQuerySchema, "query"), getAll);

/**
 * @openapi
 * /api/donneurs/{id}:
 *   get:
 *     summary: Consulter un donneur
 *     description: Retourne un donneur par son identifiant.
 *     tags:
 *       - Donors
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Identifiant du donneur.
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 12
 *     responses:
 *       200:
 *         description: Donneur trouvé.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Donor'
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
 *         description: Donneur introuvable.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:id", authenticate, validate(idSchema, "params"), getById);

/**
 * @openapi
 * /api/donneurs/{id}/dons:
 *   get:
 *     summary: Historique des dons d'un donneur
 *     description: Retourne tous les dons effectués par un donneur, avec le centre de collecte.
 *     tags:
 *       - Donors
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Identifiant du donneur.
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 12
 *     responses:
 *       200:
 *         description: Liste des dons du donneur.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DonWithCentre'
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
 */
router.get("/:id/dons", authenticate, validate(idSchema, "params"), getDonsByDonneur);

/**
 * @openapi
 * /api/donneurs:
 *   post:
 *     summary: Créer un donneur
 *     description: Enregistre un nouveau donneur. Réservé aux rôles ADMIN et AGENT_CENTRE.
 *     tags:
 *       - Donors
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateDonor'
 *     responses:
 *       201:
 *         description: Donneur créé avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Donor'
 *       400:
 *         description: Données invalides (validation Zod).
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
 *         description: Accès refusé, rôle ADMIN ou AGENT_CENTRE requis.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/", authenticate, authorize("ADMIN", "AGENT_CENTRE"), validate(donneurSchema), create);

/**
 * @openapi
 * /api/donneurs/{id}:
 *   put:
 *     summary: Remplacer un donneur
 *     description: Met à jour un donneur existant. Réservé aux rôles ADMIN et AGENT_CENTRE.
 *     tags:
 *       - Donors
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Identifiant du donneur.
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 12
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateDonor'
 *     responses:
 *       200:
 *         description: Donneur mis à jour.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Donor'
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
 *         description: Accès refusé, rôle ADMIN ou AGENT_CENTRE requis.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Donneur introuvable.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put("/:id", authenticate, authorize("ADMIN", "AGENT_CENTRE"), validate(idSchema, "params"), validate(donneurSchema), update);

/**
 * @openapi
 * /api/donneurs/{id}:
 *   patch:
 *     summary: Modifier partiellement un donneur
 *     description: Met à jour un ou plusieurs champs d'un donneur. Réservé aux rôles ADMIN et AGENT_CENTRE.
 *     tags:
 *       - Donors
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Identifiant du donneur.
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 12
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateDonor'
 *     responses:
 *       200:
 *         description: Donneur mis à jour.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Donor'
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
 *         description: Accès refusé, rôle ADMIN ou AGENT_CENTRE requis.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Donneur introuvable.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch("/:id", authenticate, authorize("ADMIN", "AGENT_CENTRE"), validate(idSchema, "params"), validate(updateDonneurSchema), patch);

/**
 * @openapi
 * /api/donneurs/{id}:
 *   delete:
 *     summary: Supprimer un donneur
 *     description: Supprime un donneur. Réservé au rôle ADMIN.
 *     tags:
 *       - Donors
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Identifiant du donneur.
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 12
 *     responses:
 *       204:
 *         description: Donneur supprimé, aucune donnée retournée.
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
 *         description: Donneur introuvable.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete("/:id", authenticate, authorize("ADMIN"), validate(idSchema, "params"), remove);

export default router;
