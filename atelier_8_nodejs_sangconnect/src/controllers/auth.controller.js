import * as authService
    from "../services/auth.service.js";

export async function register(req, res, next) {

    try {

        const user =
            await authService.register(req.body);

        // On ne retourne jamais le mot de passe, même haché
        res.status(201).json({
            id: user.id,
            nom: user.nom,
            email: user.email,
            role: user.role
        });

    } catch (error) {

        next(error);
    }
}

export async function login(req, res, next) {

    try {

        const result =
            await authService.login(
                req.body.email,
                req.body.password
            );

        res.json(result);

    } catch (error) {

        next(error);
    }
}

export function me(req, res) {

    res.json({
        id: req.user.sub,
        email: req.user.email,
        role: req.user.role
    });
}
