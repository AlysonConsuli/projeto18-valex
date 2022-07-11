import { Request, Response } from "express";

import * as purchasesService from "../services/purchasesService.js";

export const makePurchase = async (req: Request, res: Response) => {
  const cardId: number = +req.params.cardId;
  const {
    password,
    businessId,
    amount,
  }: { password: string; businessId: number; amount: number } = req.body;
  await purchasesService.makePurchase(cardId, password, businessId, amount);
  res.sendStatus(201);
};
