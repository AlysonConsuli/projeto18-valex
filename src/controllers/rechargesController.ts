import { Request, Response } from "express";

import * as rechargesService from "../services/rechargesService.js";

export const rechargeCard = async (req: Request, res: Response) => {
  const apiKey = req.header("x-api-key");
  const id: number = +req.params.id;
  const amount: number = +req.body.amount;
  await rechargesService.rechargeCard(apiKey, id, amount);
  res.sendStatus(201);
};
