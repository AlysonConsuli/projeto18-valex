import { Router } from "express";

import {
  activateCard,
  blockCard,
  createCard,
  getTransactions,
  unlockCard,
} from "../controllers/cardsController.js";
import { validateSchema } from "../middlewares/schemaValidator.js";
import {
  activateCardsSchema,
  cardPasswordSchema,
  cardsSchema,
} from "../schemas/cardsSchema.js";

const cardsRouter = Router();
cardsRouter.post("/cards/create/:id", validateSchema(cardsSchema), createCard);
cardsRouter.post(
  "/cards/activate/:id",
  validateSchema(activateCardsSchema),
  activateCard
);
cardsRouter.get("/cards/transactions/:id", getTransactions);
cardsRouter.post(
  "/cards/block/:id",
  validateSchema(cardPasswordSchema),
  blockCard
);
cardsRouter.post(
  "/cards/unlock/:id",
  validateSchema(cardPasswordSchema),
  unlockCard
);
export default cardsRouter;
