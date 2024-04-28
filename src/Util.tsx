import { PersonType } from "./Person";

export const calculateAmountOwed = (
  persons: PersonType[],
  totalAmount: number,
  personIndex: number
) => {
  const formatSum = (sum: number) => {
    if (isNaN(sum)) {
      return 0;
    }
    return sum;
  };

  const totalItemCost = persons.reduce(
    (sum, current) =>
      sum +
      current.items.reduce(
        (itemSum, item) => itemSum + formatSum(item.cost),
        0
      ),
    0
  );

  const tipAndTax = totalAmount - totalItemCost;

  const personsCost = persons[personIndex]
    ? persons[personIndex].items.reduce(
        (itemSum, item) => itemSum + formatSum(item.cost),
        0
      )
    : 0;

  const percentCut = personsCost / totalItemCost;

  const personsTaxAndTip = tipAndTax * percentCut;

  const paymentCut = personsTaxAndTip + personsCost;

  if (totalItemCost >= totalAmount) {
    return 0;
  }

  return paymentCut;
};

export const formatAmountOwed = (amount: number) => {
  return Math.floor(amount * 100) / 100;
};
