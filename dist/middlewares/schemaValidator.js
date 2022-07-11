import { unprocessableEntityError } from "./handleErrorsMiddleware.js";
export var validateSchema = function (schema) {
    return function (req, res, next) {
        var error = schema.validate(req.body, { abortEarly: false }).error;
        if (error) {
            throw unprocessableEntityError(error.details.map(function (detail) { return detail.message; }));
        }
        next();
    };
};
