import { Router } from "express";
import { rechargeCard } from "../controllers/rechargesController.js";
import { validateSchema } from "../middlewares/schemaValidator.js";
import { rechargeSchema } from "../schemas/rechargesSchema.js";
var rechargesRouter = Router();
rechargesRouter.post("/recharge/:id", validateSchema(rechargeSchema), rechargeCard);
export default rechargesRouter;
