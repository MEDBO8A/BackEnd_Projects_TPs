import * as donneurService from "../services/donneur.service.js";

export function getAll(req, res) {
    let donneurs = donneurService.getAll();
    const groupeSanguin = req.query.groupeSanguin;
    if (groupeSanguin) {
        donneurs = donneurs.filter(
            donneur => donneur.groupeSanguin?.toLowerCase() === groupeSanguin.toLowerCase()
        );
    }
    res.json(donneurs);
}

export function getById(req, res, next) {

    try {

        const id = Number(req.params.id);

        const donneur = donneurService.getById(id);

        if (!donneur) {

            const error = new Error(
                "Donneur introuvable"
            );

            error.statusCode = 404;

            throw error;
        }

        res.json(donneur);

    } catch (error) {

        next(error);
    }
}

export function create(req, res) {
    const newDonneur = donneurService.create(req.body);
    res.status(201).json(newDonneur);
}

export function update(req, res) {
    const id = Number(req.params.id);
    const updatedDonneur = donneurService.update(id, req.body);

    if (!updatedDonneur) {
        return res.status(404).json({ message: "Donneur introuvable" });
    }

    res.json(updatedDonneur);
}

export function patch(req, res) {
    const id = Number(req.params.id);
    const patchedDonneur = donneurService.patch(id, req.body);

    if (!patchedDonneur) {
        return res.status(404).json({ message: "Donneur introuvable" });
    }

    res.json(patchedDonneur);
}

export function remove(req, res) {
    const id = Number(req.params.id);
    const success = donneurService.remove(id);

    if (!success) {
        return res.status(404).json({ message: "Donneur introuvable" });
    }

    res.status(204).send();
}