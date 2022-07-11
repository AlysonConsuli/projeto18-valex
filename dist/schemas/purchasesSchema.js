import Joi from "joi";
export var purchaseSchema = Joi.object({
    password: Joi.string().required().pattern(new RegExp("^[0-9]{4}$")),
    businessId: Joi.number().integer().positive().required(),
    amount: Joi.number().positive().required()
});
