var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import dayjs from "dayjs";
import Cryptr from "cryptr";
import bcrypt from "bcrypt";
import "../config/setup.js";
import { conflictError, notFoundError, unauthorizedError, } from "../middlewares/handleErrorsMiddleware.js";
import * as companyRepository from "../repositories/companyRepository.js";
import * as cardRepository from "../repositories/cardRepository.js";
import * as employeeRepository from "../repositories/employeeRepository.js";
import * as paymentRepository from "../repositories/paymentRepository.js";
import * as rechargeRepository from "../repositories/rechargeRepository.js";
import { calculateAmount, createCardInfos, formatDate, formatTimestamp, } from "../utils/cardUtils.js";
export var createCard = function (apiKey, id, type) { return __awaiter(void 0, void 0, void 0, function () {
    var company, employee, existCard, fullname, cardInfos, card;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, companyRepository.findByApiKey(apiKey)];
            case 1:
                company = _a.sent();
                if (!company) {
                    throw notFoundError("Company not found");
                }
                return [4 /*yield*/, employeeRepository.findById(id)];
            case 2:
                employee = _a.sent();
                if (!employee) {
                    throw notFoundError("Employee not found");
                }
                if (employee.companyId !== company.id) {
                    throw unauthorizedError("Employee not belongs to this company");
                }
                return [4 /*yield*/, cardRepository.findByTypeAndEmployeeId(type, id)];
            case 3:
                existCard = _a.sent();
                if (existCard) {
                    throw conflictError("The employee already has this type of card");
                }
                fullname = employee.fullName;
                cardInfos = createCardInfos(fullname);
                card = {
                    employeeId: employee.id,
                    number: cardInfos.cardNumber,
                    cardholderName: cardInfos.cardName,
                    securityCode: cardInfos.encryptedCvc,
                    expirationDate: cardInfos.expirationDate,
                    isVirtual: false,
                    isBlocked: false,
                    type: type
                };
                return [4 /*yield*/, cardRepository.insert(card)];
            case 4:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
export var activateCard = function (id, cvc, password) { return __awaiter(void 0, void 0, void 0, function () {
    var cryptr, card, expirationDate, decryptedCvc, hashedPassword;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                cryptr = new Cryptr(process.env.CRYPTR_SECRET_KEY);
                return [4 /*yield*/, cardRepository.findById(id)];
            case 1:
                card = _a.sent();
                if (!card) {
                    throw notFoundError("Card not registered");
                }
                expirationDate = formatDate(card.expirationDate);
                if (dayjs().isAfter(expirationDate)) {
                    throw unauthorizedError("Expired card");
                }
                if (card.password) {
                    throw conflictError("The card is already registered");
                }
                decryptedCvc = +cryptr.decrypt(card.securityCode);
                if (cvc !== decryptedCvc) {
                    throw unauthorizedError("Incorrect cvc");
                }
                hashedPassword = bcrypt.hashSync(password, 10);
                return [4 /*yield*/, cardRepository.update(id, { password: hashedPassword })];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
export var getTransactions = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var card, transactions, recharges, balance, transactionsFormated, rechargesFormated;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, cardRepository.findById(id)];
            case 1:
                card = _a.sent();
                if (!card) {
                    throw notFoundError("Card not registered");
                }
                return [4 /*yield*/, paymentRepository.findByCardId(id)];
            case 2:
                transactions = _a.sent();
                return [4 /*yield*/, rechargeRepository.findByCardId(id)];
            case 3:
                recharges = _a.sent();
                balance = calculateAmount(recharges) - calculateAmount(transactions);
                transactionsFormated = formatTimestamp(transactions);
                rechargesFormated = formatTimestamp(recharges);
                return [2 /*return*/, { balance: balance, transactionsFormated: transactionsFormated, rechargesFormated: rechargesFormated }];
        }
    });
}); };
export var blockCard = function (id, password) { return __awaiter(void 0, void 0, void 0, function () {
    var card, expirationDate;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, cardRepository.findById(id)];
            case 1:
                card = _a.sent();
                if (!card) {
                    throw notFoundError("Card not registered");
                }
                if (!bcrypt.compareSync(password, card.password)) {
                    throw unauthorizedError("Incorrect password");
                }
                expirationDate = formatDate(card.expirationDate);
                if (dayjs().isAfter(expirationDate)) {
                    throw unauthorizedError("Expired card");
                }
                if (card.isBlocked) {
                    throw conflictError("The card is already blocked");
                }
                return [4 /*yield*/, cardRepository.update(id, { isBlocked: true })];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
export var unlockCard = function (id, password) { return __awaiter(void 0, void 0, void 0, function () {
    var card, expirationDate;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, cardRepository.findById(id)];
            case 1:
                card = _a.sent();
                if (!card) {
                    throw notFoundError("Card not registered");
                }
                if (!bcrypt.compareSync(password, card.password)) {
                    throw unauthorizedError("Incorrect password");
                }
                expirationDate = formatDate(card.expirationDate);
                if (dayjs().isAfter(expirationDate)) {
                    throw unauthorizedError("Expired card");
                }
                if (!card.isBlocked) {
                    throw conflictError("The card is already unlocked");
                }
                return [4 /*yield*/, cardRepository.update(id, { isBlocked: false })];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
