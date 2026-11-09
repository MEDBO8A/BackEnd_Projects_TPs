export function validate(schema, source) {

    return (req, res, next) => {

        const result = schema.safeParse(req[source]);

        if (!result.success) {

            return res.status(400).json({
                message: "Données invalides",
                errors: result.error.issues
            });
        }

        if (source === 'query') {
            for (const key in req.query) {
                delete req.query[key];
            }
            Object.assign(req.query, result.data);
        } else {
            req[source] = result.data;
        }

        next();
    };
}