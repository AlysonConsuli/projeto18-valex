import { faker } from "@faker-js/faker";
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

///// utils ////

const formatName = (name: string) => {
  const fullname = name.toUpperCase().trim();
  const arr = fullname.split(" ").filter((str) => str.length >= 3);
  const cardNameArr = arr.map((str, i) => {
    if (i !== 0 && i !== arr.length - 1) {
      return str.substring(0, 1);
    }
    return str;
  });
  return cardNameArr.join(" ");
};

const createCardInfos = (name: string) => {
  const cryptr = new Cryptr(process.env.CRYPTR_SECRET_KEY);
  const cardNumber = faker.random.numeric(20);
  const cardName = formatName(name);
  const expirationDate = dayjs().add(5, "year").format("MM/YY");
  const cvc = faker.random.numeric(3);
  const encryptedCvc: string = cryptr.encrypt(cvc);
  console.log(`cvc: ${cvc}`);
  //const decryptedCvc = cryptr.decrypt(encryptedCvc);
  return { cardNumber, cardName, expirationDate, encryptedCvc };
};

function formatDate(date: string) {
  const arr = date.split("/").reverse();
  arr[0] = `20${arr[0]}`;
  return arr.join("/");
}

function calculateAmount(arr: any) {
  const totalAmount = arr.reduce((total: number, obj: any) => {
    const { amount } = obj;
    return total + amount;
  }, 0);
  return totalAmount;
}

function formatTimestamp(arr: any) {
  const arrFormated = arr.map((transaction: any) => {
    const date = dayjs(transaction.timestamp).format("DD/MM/YYYY");
    return { ...transaction, timestamp: date };
  });
  return arrFormated;
}
