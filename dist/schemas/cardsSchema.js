import Joi from "joi";
export var cardsSchema = Joi.object({
    type: Joi.string()
        .required()
        .valid("groceries", "restaurants", "transport", "education", "health")
});
export var activateCardsSchema = Joi.object({
    cvc: Joi.number().required(),
    password: Joi.string().required().pattern(new RegExp("^[0-9]{4}$"))
});
export var cardPasswordSchema = Joi.object({
    password: Joi.string().required().pattern(new RegExp("^[0-9]{4}$"))
});
