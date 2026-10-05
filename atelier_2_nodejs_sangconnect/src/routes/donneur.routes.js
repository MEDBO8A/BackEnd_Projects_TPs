import {
  listDonneurs,
  showDonneur,
  showDonneurVille
} from "../controllers/donneur.controller.js";

export async function handleDonneurRoutes(req, res) {
  if (req.url === "/api/donneurs" && req.method === "GET") {
    await listDonneurs(req, res);
    return true;
  }

  const match = req.url.match(/^\/api\/donneurs\/(\d+)$/);

  if (match && req.method === "GET") {
    const id = Number(match[1]);

    await showDonneur(req, res, id);
    return true;
  }

  if (req.url.startsWith("/api/donneurs") && req.method === "GET"){
    const fullUrl = new URL(req.url, `http://${req.headers.host}`);
    const ville = fullUrl.searchParams.get("ville");
    if (ville){
        await showDonneurVille(req, res, ville);
        return true;
    }
  }

  return false;
}