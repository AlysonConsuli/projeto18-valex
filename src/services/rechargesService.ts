import dayjs from "dayjs";

import {
  notFoundError,
  unauthorizedError,
} from "../middlewares/handleErrorsMiddleware.js";
import * as companyRepository from "../repositories/companyRepository.js";
import * as cardRepository from "../repositories/cardRepository.js";
import * as employeeRepository from "../repositories/employeeRepository.js";
import * as rechargeRepository from "../repositories/rechargeRepository.js";
import { formatDate } from "../utils/cardUtils.js";

export const rechargeCard = async (
  apiKey: string,
  id: number,
  amount: number
) => {
  const card = await cardRepository.findById(id);
  if (!card) {
    throw notFoundError("Card not registered");
  }
  const company = await companyRepository.findByApiKey(apiKey);
  if (!company) {
    throw notFoundError("Company not found");
  }
  const employee = await employeeRepository.findById(card.employeeId);
  if (!employee) {
    throw notFoundError("Employee not found");
  }
  if (employee.companyId !== company.id) {
    throw unauthorizedError("Employee not belongs to this company");
  }
  const expirationDate = formatDate(card.expirationDate);
  if (dayjs().isAfter(expirationDate)) {
    throw unauthorizedError("Expired card");
  }
  if (!card.password) {
    throw unauthorizedError("The card is inactive");
  }
  await rechargeRepository.insert({ cardId: id, amount });
};
