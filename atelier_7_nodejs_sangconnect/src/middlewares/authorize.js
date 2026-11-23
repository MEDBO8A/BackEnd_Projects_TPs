export function authorize(...allowedRoles) {

    return (req, res, next) => {

        if (!req.user) {

            const error = new Error(
                "Authentification requise"
            );

            error.statusCode = 401;

            return next(error);
        }

        if (!allowedRoles.includes(req.user.role)) {

            const error = new Error(
                "Accès refusé"
            );

            error.statusCode = 403;

            return next(error);
        }

        next();
    };
}
