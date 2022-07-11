import { Router } from "express";

import { makePurchase } from "../controllers/purchasesController.js";
import { validateSchema } from "../middlewares/schemaValidator.js";
import { purchaseSchema } from "../schemas/purchasesSchema.js";

const purchasesRouter = Router();
purchasesRouter.post(
  "/purchase/:cardId",
  validateSchema(purchaseSchema),
  makePurchase
);
export default purchasesRouter;
