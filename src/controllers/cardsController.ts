import { Request, Response } from "express";

import * as cardsService from "../services/cardsService.js";
import * as cardRepository from "../repositories/cardRepository.js";

export const createCard = async (req: Request, res: Response) => {
  const apiKey = req.header("x-api-key");
  const id: number = +req.params.id;
  const type: cardRepository.TransactionTypes = req.body.type;
  const cvc = await cardsService.createCard(apiKey, id, type);
  res.status(201).send(`cvc: ${cvc}`);
};

export const activateCard = async (req: Request, res: Response) => {
  const id: number = +req.params.id;
  const { cvc, password }: { cvc: number; password: string } = req.body;
  await cardsService.activateCard(id, cvc, password);
  res.sendStatus(200);
};

export const getTransactions = async (req: Request, res: Response) => {
  const id: number = +req.params.id;
  const result = await cardsService.getTransactions(id);
  res.send(result);
};

export const blockCard = async (req: Request, res: Response) => {
  const id: number = +req.params.id;
  const { password }: { password: string } = req.body;
  await cardsService.blockCard(id, password);
  res.sendStatus(200);
};

export const unlockCard = async (req: Request, res: Response) => {
  const id: number = +req.params.id;
  const { password }: { password: string } = req.body;
  await cardsService.unlockCard(id, password);
  res.sendStatus(200);
};
