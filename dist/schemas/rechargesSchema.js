import Joi from "joi";
export var rechargeSchema = Joi.object({
    amount: Joi.number().positive().required()
});
