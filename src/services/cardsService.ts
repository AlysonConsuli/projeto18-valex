import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import Cryptr from "cryptr";
import "../config/setup.js";

import {
  conflictError,
  notFoundError,
  unauthorizedError,
} from "../middlewares/handleErrorsMiddleware.js";
import * as companyRepository from "../repositories/companyRepository.js";
import * as cardRepository from "../repositories/cardRepository.js";
import * as employeeRepository from "../repositories/employeeRepository.js";

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
  console.log(card);
};

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
  const expirationDate = dayjs().add(5, "year").format("MM/YYYY");
  const cvc = faker.random.numeric(3);
  const encryptedCvc = cryptr.encrypt(cvc);
  //const decryptedCvc = cryptr.decrypt(encryptedCvc);
  return { cardNumber, cardName, expirationDate, encryptedCvc };
};
