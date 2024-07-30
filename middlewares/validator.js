
const validate = (schema) => async(req, res, next) => {
    try {
        const body = await schema.parseAsync(req.body);
        req.body = body;
        next();
    } catch (error) {
        const msg = error.errors[0].message;
        res.status(400).json({message:msg});
    }
};

export default validate;