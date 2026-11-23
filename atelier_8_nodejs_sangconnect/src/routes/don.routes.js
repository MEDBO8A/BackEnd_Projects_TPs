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

/**
 * @openapi
 * /api/dons:
 *   get:
 *     summary: Lister les dons avec filtres et pagination
 *     description: Retourne une liste paginée de dons, filtrable par centre, donneur, ville et groupe sanguin. Tous les rôles authentifiés peuvent consulter.
 *     tags:
 *       - Donations
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: centreId
 *         in: query
 *         required: false
 *         description: Filtrer par identifiant du centre de collecte.
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 2
 *       - name: donneurId
 *         in: query
 *         required: false
 *         description: Filtrer par identifiant du donneur.
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 12
 *       - name: ville
 *         in: query
 *         required: false
 *         description: Filtrer par ville du centre.
 *         schema:
 *           type: string
 *         example: Tunis
 *       - name: groupeSanguin
 *         in: query
 *         required: false
 *         description: Filtrer par groupe sanguin du donneur.
 *         schema:
 *           $ref: '#/components/schemas/GroupeSanguin'
 *         example: O+
 *       - name: page
 *         in: query
 *         required: false
 *         description: Numéro de la page (défaut 1).
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - name: limit
 *         in: query
 *         required: false
 *         description: Nombre de résultats par page (défaut 10).
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *       - name: sortBy
 *         in: query
 *         required: false
 *         description: Champ de tri (défaut dateDon).
 *         schema:
 *           type: string
 *           enum: [dateDon, volume]
 *           default: dateDon
 *       - name: order
 *         in: query
 *         required: false
 *         description: Ordre de tri (défaut desc).
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *     responses:
 *       200:
 *         description: Liste paginée des dons.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DonListResponse'
 *       400:
 *         description: Paramètres de recherche invalides.
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
router.get("/", authenticate, validate(donQuerySchema, "query"), getAll);

/**
 * @openapi
 * /api/dons/{id}:
 *   get:
 *     summary: Consulter un don
 *     description: Retourne un don par son identifiant avec le résumé du donneur et du centre.
 *     tags:
 *       - Donations
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Identifiant du don.
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 10
 *     responses:
 *       200:
 *         description: Don trouvé.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Don'
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
 *         description: Don introuvable.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:id", authenticate, validate(idSchema, "params"), getById);

/**
 * @openapi
 * /api/dons:
 *   post:
 *     summary: Créer un don
 *     description: Enregistre un nouveau don. Réservé aux rôles ADMIN et AGENT_CENTRE.
 *     tags:
 *       - Donations
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateDon'
 *     responses:
 *       201:
 *         description: Don créé avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Don'
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
router.post("/", authenticate, authorize("ADMIN", "AGENT_CENTRE"), validate(donSchema), create);

/**
 * @openapi
 * /api/dons/{id}:
 *   put:
 *     summary: Remplacer un don
 *     description: Met à jour un don existant. Réservé aux rôles ADMIN et AGENT_CENTRE.
 *     tags:
 *       - Donations
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Identifiant du don.
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 10
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateDon'
 *     responses:
 *       200:
 *         description: Don mis à jour.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Don'
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
 *         description: Don introuvable.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put("/:id", authenticate, authorize("ADMIN", "AGENT_CENTRE"), validate(idSchema, "params"), validate(donSchema), update);

/**
 * @openapi
 * /api/dons/{id}:
 *   patch:
 *     summary: Modifier partiellement un don
 *     description: Met à jour un ou plusieurs champs d'un don. Réservé aux rôles ADMIN et AGENT_CENTRE.
 *     tags:
 *       - Donations
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Identifiant du don.
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 10
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateDon'
 *     responses:
 *       200:
 *         description: Don mis à jour.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Don'
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
 *         description: Don introuvable.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch("/:id", authenticate, authorize("ADMIN", "AGENT_CENTRE"), validate(idSchema, "params"), validate(updateDonSchema), patch);

/**
 * @openapi
 * /api/dons/{id}:
 *   delete:
 *     summary: Supprimer un don
 *     description: Supprime un don. Réservé au rôle ADMIN.
 *     tags:
 *       - Donations
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Identifiant du don.
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 10
 *     responses:
 *       204:
 *         description: Don supprimé, aucune donnée retournée.
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
 *         description: Don introuvable.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete("/:id", authenticate, authorize("ADMIN"), validate(idSchema, "params"), remove);

export default router;
