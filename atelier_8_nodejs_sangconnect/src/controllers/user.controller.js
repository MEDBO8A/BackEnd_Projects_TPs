import * as userService
    from "../services/user.service.js";

export async function getAll(req, res, next) {

    try {

        const users = await userService.getAll();

        res.json(users);

    } catch (error) {

        next(error);
    }
}

export async function getById(req, res, next) {

    try {

        const id = Number(req.params.id);

        const user = await userService.getById(id);

        res.json(user);

    } catch (error) {

        next(error);
    }
}

export async function update(req, res, next) {

    try {

        const id = Number(req.params.id);

        const user = await userService.update(
            id,
            req.body
        );

        res.json(user);

    } catch (error) {

        next(error);
    }
}

export async function patch(req, res, next) {

    try {

        const id = Number(req.params.id);

        const user = await userService.patch(
            id,
            req.body
        );

        res.json(user);

    } catch (error) {

        next(error);
    }
}

export async function remove(req, res, next) {

    try {

        const id = Number(req.params.id);

        await userService.remove(id);

        res.status(204).send();

    } catch (error) {

        next(error);
    }
}
