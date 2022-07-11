var serviceErrorToStatusCode = {
    unauthorized: 401,
    notFound: 404,
    conflict: 409,
    unprocessableEntity: 422
};
export var unauthorizedError = function (message) {
    return { type: "unauthorized", message: message };
};
export var conflictError = function (message) {
    return { type: "conflict", message: message };
};
export var unprocessableEntityError = function (message) {
    return { type: "unprocessableEntity", message: message };
};
export var notFoundError = function (message) {
    return { type: "notFound", message: message };
};
export var handleErrorsMiddleware = function (err, req, res, next) {
    if (err.type) {
        return res.status(serviceErrorToStatusCode[err.type]).send(err.message);
    }
    if (err.file === "enum.c") {
        return res.status(422).send("Send one of the following types: \n        groceries, restaurants, transport, education, health");
    }
    console.log(err);
    res.sendStatus(500);
};
