import * as donService from "../services/don.service.js";

export async function getAll(req, res, next) {

    try {

        const result = await donService.getAll(req.query);

        res.json(result);

    } catch (error) {

        next(error);
    }
}

export async function getById(req, res, next) {

    try {

        const id = Number(req.params.id);

        const don = await donService.getById(id);

        res.json(don);

    } catch (error) {

        next(error);
    }
}

export async function getByDonneur(req, res, next) {

    try {

        const donneurId = Number(req.params.donneurId || req.params.id);

        const dons = await donService.getByDonneur(donneurId);

        res.json(dons);

    } catch (error) {

        next(error);
    }
}

export async function create(req, res, next) {

    try {

        const don = await donService.create(req.body);

        res.status(201).json(don);

    } catch (error) {

        next(error);
    }
}

export async function update(req, res, next) {

    try {

        const id = Number(req.params.id);

        const don = await donService.update(id, req.body);

        res.json(don);

    } catch (error) {

        next(error);
    }
}

export async function patch(req, res, next) {

    try {

        const id = Number(req.params.id);

        const don = await donService.patch(id, req.body);

        res.json(don);

    } catch (error) {

        next(error);
    }
}

export async function remove(req, res, next) {

    try {

        const id = Number(req.params.id);

        await donService.remove(id);

        res.status(204).send();

    } catch (error) {

        next(error);
    }
}
