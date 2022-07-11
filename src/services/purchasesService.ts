import dayjs from "dayjs";
import bcrypt from "bcrypt";

import {
  notFoundError,
  unauthorizedError,
} from "../middlewares/handleErrorsMiddleware.js";
import * as cardRepository from "../repositories/cardRepository.js";
import * as employeeRepository from "../repositories/employeeRepository.js";
import * as paymentRepository from "../repositories/paymentRepository.js";
import * as rechargeRepository from "../repositories/rechargeRepository.js";
import * as businessRepository from "../repositories/businessRepository.js";
import { calculateAmount, formatDate } from "../utils/cardUtils.js";

export const makePurchase = async (
  cardId: number,
  password: string,
  businessId: number,
  amount: number
) => {
  const card = await cardRepository.findById(cardId);
  if (!card) {
    throw notFoundError("Card not registered");
  }
  const employee = await employeeRepository.findById(card.employeeId);
  if (!employee) {
    throw notFoundError("Employee not found");
  }
  const expirationDate = formatDate(card.expirationDate);
  if (dayjs().isAfter(expirationDate)) {
    throw unauthorizedError("Expired card");
  }
  if (card.isBlocked) {
    throw unauthorizedError("The card is blocked");
  }
  if (!card.password) {
    throw unauthorizedError("The card is inactive");
  }
  if (!bcrypt.compareSync(password, card.password)) {
    throw unauthorizedError("Incorrect password");
  }
  const business = await businessRepository.findById(businessId);
  if (!business) {
    throw notFoundError("Business not registered");
  }
  if (card.type !== business.type) {
    throw unauthorizedError("Card type is different of the business type");
  }
  const transactions = await paymentRepository.findByCardId(cardId);
  const recharges = await rechargeRepository.findByCardId(cardId);
  const balance = calculateAmount(recharges) - calculateAmount(transactions);
  if (amount > balance) {
    throw unauthorizedError("Insufficient balance");
  }
  await paymentRepository.insert({ cardId, businessId, amount });
};
