import "dotenv/config";
import express from "express";
import swaggerUi from "swagger-ui-express";

import swaggerSpec from "./config/swagger.js";

import donneurRoutes from "./routes/donneur.routes.js";
import donRoutes from "./routes/don.routes.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";

import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

const PORT = 3000;

app.use(express.json());

/**
 * @openapi
 * /:
 *   get:
 *     summary: Endpoint d'accueil
 *     description: Retourne un message de bienvenue. Route publique.
 *     tags:
 *       - Root
 *     responses:
 *       200:
 *         description: Message de bienvenue.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RootResponse'
 */
app.get("/", (req, res) => {
    res.json({
        message: "Bienvenue dans l'API SangConnect"
    });
});

app.use("/api/donneurs", donneurRoutes);
app.use("/api/dons", donRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Spécification OpenAPI brute, utile pour les outils tiers
app.get("/api-docs.json", (req, res) => {
    res.json(swaggerSpec);
});

// Interface interactive Swagger UI
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
    console.log(`Documentation Swagger UI : http://localhost:${PORT}/api-docs`);
});
