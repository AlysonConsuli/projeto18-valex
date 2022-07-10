import { Router } from "express";

import { rechargeCard } from "../controllers/rechargesController.js";
import { validateSchema } from "../middlewares/schemaValidator.js";
import { amountSchema } from "../schemas/amountSchema.js";

const rechargesRouter = Router();
rechargesRouter.post(
  "/recharge/:id",
  validateSchema(amountSchema),
  rechargeCard
);
export default rechargesRouter;
