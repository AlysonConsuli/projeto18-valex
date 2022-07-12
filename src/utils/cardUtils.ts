import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import Cryptr from "cryptr";

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

export const createCardInfos = (name: string) => {
  const cryptr = new Cryptr(process.env.CRYPTR_SECRET_KEY);
  const cardNumber = faker.finance.creditCardNumber(`#### #### #### ####`);
  const cardName = formatName(name);
  const expirationDate = dayjs().add(5, "year").format("MM/YY");
  const cvc = faker.random.numeric(3);
  const encryptedCvc: string = cryptr.encrypt(cvc);
  return { cardNumber, cardName, expirationDate, encryptedCvc, cvc };
};

export function formatDate(date: string) {
  const arr = date.split("/").reverse();
  arr[0] = `20${arr[0]}`;
  return arr.join("/");
}

export function calculateAmount(arr: any) {
  const totalAmount = arr.reduce((total: number, obj: any) => {
    const { amount } = obj;
    return total + amount;
  }, 0);
  return totalAmount;
}

export function formatTimestamp(arr: any) {
  const arrFormated = arr.map((transaction: any) => {
    const date = dayjs(transaction.timestamp).format("DD/MM/YYYY");
    return { ...transaction, timestamp: date };
  });
  return arrFormated;
}
