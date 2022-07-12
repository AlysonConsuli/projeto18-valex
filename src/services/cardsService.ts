import dayjs from "dayjs";
import Cryptr from "cryptr";
import bcrypt from "bcrypt";
import "../config/setup.js";

import {
  conflictError,
  notFoundError,
  unauthorizedError,
} from "../middlewares/handleErrorsMiddleware.js";
import * as companyRepository from "../repositories/companyRepository.js";
import * as cardRepository from "../repositories/cardRepository.js";
import * as employeeRepository from "../repositories/employeeRepository.js";
import * as paymentRepository from "../repositories/paymentRepository.js";
import * as rechargeRepository from "../repositories/rechargeRepository.js";
import {
  calculateAmount,
  createCardInfos,
  formatDate,
  formatTimestamp,
} from "../utils/cardUtils.js";

export const createCard = async (
  apiKey: string,
  id: number,
  type: cardRepository.TransactionTypes
) => {
  const company = await companyRepository.findByApiKey(apiKey);
  if (!company) {
    throw notFoundError("Company not found");
  }
  const employee = await employeeRepository.findById(id);
  if (!employee) {
    throw notFoundError("Employee not found");
  }
  if (employee.companyId !== company.id) {
    throw unauthorizedError("Employee not belongs to this company");
  }
  const existCard = await cardRepository.findByTypeAndEmployeeId(type, id);
  if (existCard) {
    throw conflictError("The employee already has this type of card");
  }
  const fullname = employee.fullName;
  const cardInfos = createCardInfos(fullname);
  const card = {
    employeeId: employee.id,
    number: cardInfos.cardNumber,
    cardholderName: cardInfos.cardName,
    securityCode: cardInfos.encryptedCvc,
    expirationDate: cardInfos.expirationDate,
    isVirtual: false,
    isBlocked: false,
    type: type,
  };
  await cardRepository.insert(card);
  return cardInfos.cvc;
};

export const activateCard = async (
  id: number,
  cvc: number,
  password: string
) => {
  const cryptr = new Cryptr(process.env.CRYPTR_SECRET_KEY);
  const card = await cardRepository.findById(id);
  if (!card) {
    throw notFoundError("Card not registered");
  }
  const expirationDate = formatDate(card.expirationDate);
  if (dayjs().isAfter(expirationDate)) {
    throw unauthorizedError("Expired card");
  }
  if (card.password) {
    throw conflictError("The card is already registered");
  }
  const decryptedCvc: number = +cryptr.decrypt(card.securityCode);
  if (cvc !== decryptedCvc) {
    throw unauthorizedError("Incorrect cvc");
  }
  const hashedPassword = bcrypt.hashSync(password, 10);
  await cardRepository.update(id, { password: hashedPassword });
};

export const getTransactions = async (id: number) => {
  const card = await cardRepository.findById(id);
  if (!card) {
    throw notFoundError("Card not registered");
  }
  const transactions = await paymentRepository.findByCardId(id);
  const recharges = await rechargeRepository.findByCardId(id);
  const balance = calculateAmount(recharges) - calculateAmount(transactions);
  const transactionsFormated = formatTimestamp(transactions);
  const rechargesFormated = formatTimestamp(recharges);

  return { balance, transactionsFormated, rechargesFormated };
};

export const blockCard = async (id: number, password: string) => {
  const card = await cardRepository.findById(id);
  if (!card) {
    throw notFoundError("Card not registered");
  }
  if (!bcrypt.compareSync(password, card.password)) {
    throw unauthorizedError("Incorrect password");
  }
  const expirationDate = formatDate(card.expirationDate);
  if (dayjs().isAfter(expirationDate)) {
    throw unauthorizedError("Expired card");
  }
  if (card.isBlocked) {
    throw conflictError("The card is already blocked");
  }
  await cardRepository.update(id, { isBlocked: true });
};

export const unlockCard = async (id: number, password: string) => {
  const card = await cardRepository.findById(id);
  if (!card) {
    throw notFoundError("Card not registered");
  }
  if (!bcrypt.compareSync(password, card.password)) {
    throw unauthorizedError("Incorrect password");
  }
  const expirationDate = formatDate(card.expirationDate);
  if (dayjs().isAfter(expirationDate)) {
    throw unauthorizedError("Expired card");
  }
  if (!card.isBlocked) {
    throw conflictError("The card is already unlocked");
  }
  await cardRepository.update(id, { isBlocked: false });
};
