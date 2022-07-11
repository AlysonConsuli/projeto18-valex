import { Router } from "express";

import cardsRouter from "./cardsRouter.js";
import purchasesRouter from "./purchasesRouter.js";
import rechargesRouter from "./rechargesRouter.js";

const router = Router();
router.use(cardsRouter);
router.use(rechargesRouter);
router.use(purchasesRouter);

export default router;
