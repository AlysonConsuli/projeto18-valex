import { Router } from "express";

import { createCard } from "../controllers/cardsController.js";
import { validateSchema } from "../middlewares/schemaValidator.js";
import { cardsSchema } from "../schemas/cardsSchema.js";

const cardsRouter = Router();
cardsRouter.post("/cards/:id", validateSchema(cardsSchema), createCard);

export default cardsRouter;
