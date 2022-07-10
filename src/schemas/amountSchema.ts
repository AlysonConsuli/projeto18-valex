import Joi from "joi";

export const amountSchema = Joi.object({
  amount: Joi.number().positive().required(),
});
