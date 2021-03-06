import Joi from "joi";

export const cardsSchema = Joi.object({
  type: Joi.string()
    .required()
    .valid("groceries", "restaurant", "transport", "education", "health"),
});

export const activateCardsSchema = Joi.object({
  cvc: Joi.number().required(),
  password: Joi.string().required().pattern(new RegExp("^[0-9]{4}$")),
});

export const cardPasswordSchema = Joi.object({
  password: Joi.string().required().pattern(new RegExp("^[0-9]{4}$")),
});
