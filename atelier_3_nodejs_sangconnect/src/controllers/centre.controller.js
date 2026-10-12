import * as centreService from "../services/centre.service.js";

export function getAll(req, res) {
    let centres = centreService.getAll();
    res.json(centres);
}

export function getById(req, res) {
    const id = Number(req.params.id);
    const centre = centreService.getById(id);

    if (!centre) {
        return res.status(404).json({ message: "centre introuvable" });
    }

    res.json(centre);
}

export function create(req, res) {
    const newcentre = centreService.create(req.body);
    res.status(201).json(newcentre);
}

export function update(req, res) {
    const id = Number(req.params.id);
    const updatedcentre = centreService.update(id, req.body);

    if (!updatedcentre) {
        return res.status(404).json({ message: "centre introuvable" });
    }

    res.json(updatedcentre);
}

export function patch(req, res) {
    const id = Number(req.params.id);
    const patchedcentre = centreService.patch(id, req.body);

    if (!patchedcentre) {
        return res.status(404).json({ message: "centre introuvable" });
    }

    res.json(patchedcentre);
}

export function remove(req, res) {
    const id = Number(req.params.id);
    const success = centreService.remove(id);

    if (!success) {
        return res.status(404).json({ message: "centre introuvable" });
    }

    res.status(204).send();
}