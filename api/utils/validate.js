import { z, ZodError } from 'zod';

export const validate = (schema, source = 'body') => (req, res, next) => {
    try {
        const data = source === 'body' ? req.body :
            source === 'query' ? req.query :
                req.params;

        const validated = schema.parse(data);

        if (source === 'body') req.body = validated;
        else if (source === 'query') req.query = validated;
        else req.params = validated;

        next();
    } catch (error) {
        if (error instanceof ZodError) {
            // Safe handling of Zod errors
            const issues = error.issues || error.errors || [];
            const message = issues.map(err => {
                const path = err.path && err.path.length > 0 ? err.path.join('.') : 'field';
                return `${path}: ${err.message || 'Invalid value'}`;
            }).join(', ');

            return res.status(400).json({
                error: message || 'Validation failed'
            });
        }
        next(error);
    }
};