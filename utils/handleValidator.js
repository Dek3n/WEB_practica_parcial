import { validationResult } from "express-validator";

const validateResults = (req, res, next) => {
    try {
        validationResult(req).throw();
        return next();
    } catch (err) {
        res.status(400).json({
            errors: err.array(),
        });
    }
};

export default validateResults;
