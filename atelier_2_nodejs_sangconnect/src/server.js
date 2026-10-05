import http from "node:http";
import { handleCentreRoutes } from "./routes/centre.routes.js";
import { sendJson } from "./utils/http.js";

const port = 3000;

const server = http.createServer(async (req, res) => {
  const handled = await handleCentreRoutes(req, res);

  if (handled) {
    return;
  }

  if (req.url === "/" && req.method === "GET") {
    sendJson(res, 200, {
      message: "Bienvenue dans SangConnect"
    });

    return;
  }

  sendJson(res, 404, {
    error: "Route non trouvée",
    path: req.url,
    method: req.method
  });
});

server.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});