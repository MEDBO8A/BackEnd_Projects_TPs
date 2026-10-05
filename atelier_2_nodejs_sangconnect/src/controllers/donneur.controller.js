import {
  getAllDonneurs,
  getDonneurById,
  searchDonneurByVille
} from "../services/donneur.service.js";

import { sendJson } from "../utils/http.js";

export async function listDonneurs(req, res) {
  try {
    const donneurs = await getAllDonneurs();

    sendJson(res, 200, {
      data: donneurs
    });
  } catch (error) {
    sendJson(res, 500, {
      error: "Erreur interne du serveur"
    });
  }
}

export async function showDonneur(req, res, id) {
  try {
    const donneur = await getDonneurById(id);

    sendJson(res, 200, {
      data: donneur
    });
  } catch (error) {
    sendJson(res, 404, {
      error: error.message
    });
  }
}

export async function showDonneurVille(req, res, ville) {
  try {
    const donneur = await searchDonneurByVille(ville);

    sendJson(res, 200, {
      data: donneur
    });
  } catch (error) {
    sendJson(res, 404, {
      error: error.message
    });
  }
}