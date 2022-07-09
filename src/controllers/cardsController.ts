import { Request, Response } from "express";

import * as cardsService from "../services/cardsService.js";
import * as cardRepository from "../repositories/cardRepository.js";

export const createCard = async (req: Request, res: Response) => {
  const apiKey = req.header("x-api-key");
  const id: number = +req.params.id;
  const type: cardRepository.TransactionTypes = req.body.type;
  await cardsService.createCard(apiKey, id, type);
  res.sendStatus(201);
};

export const activateCard = async (req: Request, res: Response) => {
  const id: number = +req.params.id;
  const { cvc, password }: { cvc: number; password: string } = req.body;
  await cardsService.activateCard(id, cvc, password);
  res.sendStatus(201);
};
