var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import Cryptr from "cryptr";
var formatName = function (name) {
    var fullname = name.toUpperCase().trim();
    var arr = fullname.split(" ").filter(function (str) { return str.length >= 3; });
    var cardNameArr = arr.map(function (str, i) {
        if (i !== 0 && i !== arr.length - 1) {
            return str.substring(0, 1);
        }
        return str;
    });
    return cardNameArr.join(" ");
};
export var createCardInfos = function (name) {
    var cryptr = new Cryptr(process.env.CRYPTR_SECRET_KEY);
    var cardNumber = faker.finance.creditCardNumber("#### #### #### ####");
    var cardName = formatName(name);
    var expirationDate = dayjs().add(5, "year").format("MM/YY");
    var cvc = faker.random.numeric(3);
    var encryptedCvc = cryptr.encrypt(cvc);
    console.log("cvc: ".concat(cvc));
    return { cardNumber: cardNumber, cardName: cardName, expirationDate: expirationDate, encryptedCvc: encryptedCvc };
};
export function formatDate(date) {
    var arr = date.split("/").reverse();
    arr[0] = "20".concat(arr[0]);
    return arr.join("/");
}
export function calculateAmount(arr) {
    var totalAmount = arr.reduce(function (total, obj) {
        var amount = obj.amount;
        return total + amount;
    }, 0);
    return totalAmount;
}
export function formatTimestamp(arr) {
    var arrFormated = arr.map(function (transaction) {
        var date = dayjs(transaction.timestamp).format("DD/MM/YYYY");
        return __assign(__assign({}, transaction), { timestamp: date });
    });
    return arrFormated;
}
