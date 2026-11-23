import express from "express";

import {
    register,
    login,
    me
} from "../controllers/auth.controller.js";

import { validate } from "../middlewares/validate.js";
import { authenticate } from "../middlewares/auth.js";

import {
    registerSchema,
    loginSchema
} from "../validators/auth.validator.js";

const router = express.Router();

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Créer un compte utilisateur
 *     description: Inscrit un nouvel utilisateur. Le mot de passe est haché avec Argon2 et n'est jamais retourné. Route publique.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Compte créé avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegisterResponse'
 *       400:
 *         description: Données invalides (validation Zod).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Cette adresse email est déjà utilisée.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
    "/register",
    validate(registerSchema, "body"),
    register
);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Authentifier un utilisateur
 *     description: Vérifie les identifiants et retourne un token JWT valable une heure. Route publique.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Authentification réussie, token JWT retourné.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Données de connexion invalides.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Email ou mot de passe incorrect.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
    "/login",
    validate(loginSchema, "body"),
    login
);

/**
 * @openapi
 * /api/auth/me:
 *   get:
 *     summary: Consulter son profil
 *     description: Retourne l'utilisateur authentifié à partir du payload du token JWT.
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil de l'utilisateur connecté.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MeResponse'
 *       401:
 *         description: Token manquant, invalide ou expiré.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
    "/me",
    authenticate,
    me
);

export default router;
