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

  console.log(company, employee);
};
