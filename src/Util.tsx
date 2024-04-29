import { PersonType } from "./Person";

const formatSum = (sum: number) => {
  if (isNaN(sum)) {
    return 0;
  }
  return sum;
};

export const getTotalCostofItems = (
  persons: PersonType[],
  totalAmount: number,
  personIndex: number
) => {
  const totalItemCost = persons.reduce(
    (sum, current) =>
      sum +
      current.items.reduce(
        (itemSum, item) => itemSum + formatSum(item.cost),
        0
      ),
    0
  );

  return totalItemCost;
};

export const calculateAmountOwed = (
  persons: PersonType[],
  totalAmount: number,
  personIndex: number
) => {
  const totalItemCost = getTotalCostofItems(persons, totalAmount, personIndex);

  const tipAndTax = getTotalTaxAndTip(persons, totalAmount, personIndex);

  const personsCost = getTotalItemCostForPerson(persons, personIndex);

  const percentCut = getPersonsPercentOfTotal(
    persons,
    totalItemCost,
    personIndex
  );

  const personsTaxAndTip = tipAndTax * percentCut;

  const paymentCut = personsTaxAndTip + personsCost;

  if (totalItemCost >= totalAmount) {
    return 0;
  }

  return paymentCut;
};

export const getPersonsTaxAmount = (
  persons: PersonType[],
  totalAmount: number,
  personIndex: number
) => {
  const totalItemCost = getTotalCostofItems(persons, totalAmount, personIndex);

  const tipAndTax = getTotalTaxAndTip(persons, totalAmount, personIndex);
  const percentCut = getPersonsPercentOfTotal(
    persons,
    totalItemCost,
    personIndex
  );

  const personsTaxAndTip = tipAndTax * percentCut;

  return personsTaxAndTip;
};

export const getTotalTaxAndTip = (
  persons: PersonType[],
  totalAmount: number,
  personIndex: number
) => {
  const totalItemCost = getTotalCostofItems(persons, totalAmount, personIndex);

  const tipAndTax = totalAmount - totalItemCost;
  return tipAndTax;
};

export const getTotalItemCostForPerson = (
  persons: PersonType[],
  personIndex: number
) => {
  const personsCost = persons[personIndex]
    ? persons[personIndex].items.reduce(
        (itemSum, item) => itemSum + formatSum(item.cost),
        0
      )
    : 0;

  return personsCost;
};

export const getPersonsPercentOfTotal = (
  persons: PersonType[],
  totalItemCost: number,
  personIndex: number
) => {
  const personsCost = getTotalItemCostForPerson(persons, personIndex);

  const percentCut = personsCost / totalItemCost;
  return percentCut;
};

export enum Rounding {
  Up = "up",
  Nearest = "nearest",
  Down = "down",
}

export const formatAmountOwed = (amount: number, round: Rounding) => {
  if (isNaN(amount)) {
    return 0;
  }

  if (round === Rounding.Up) {
    return Math.ceil(amount * 100) / 100;
  }

  if (round === Rounding.Nearest) {
    return Math.round(amount * 100) / 100;
  }

  return Math.floor(amount * 100) / 100;
};

export const formatLongValue = (amount: number): string => {
  if (isNaN(amount)) {
    return "0";
  }

  const countDecimals = (value: number): number => {
    if (value % 1 !== 0) return value.toString().split(".")[1].length;
    return 0;
  };

  if (countDecimals(amount) > 4) {
    return `${Math.round(amount * 10000) / 10000}...`;
  }

  return `${amount}`;
};

export const stringToRounding = (rounding: string): Rounding => {
  switch (rounding) {
    case Rounding.Up:
      return Rounding.Up;
    case Rounding.Nearest:
      return Rounding.Nearest;
    case Rounding.Down:
      return Rounding.Down;
  }
  return Rounding.Nearest;
};
