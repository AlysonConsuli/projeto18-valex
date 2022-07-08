import Joi from "joi";

export const cardsSchema = Joi.object({
  type: Joi.string()
    .required()
    .valid("groceries", "restaurants", "transport", "education", "health"),
});
