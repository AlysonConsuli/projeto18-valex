import { Router } from "express";

import { createCard } from "../controllers/cardsController.js";
import { validateSchema } from "../middlewares/schemaValidator.js";

const cardsRouter = Router();
cardsRouter.post("/cards/create", createCard);

export default cardsRouter;
