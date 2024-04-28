import { describe, expect, test } from "@jest/globals";
import { calculateAmountOwed, formatAmountOwed } from "./Util";
import { PersonType } from "./Person";

describe("Util", () => {
  test("calculateAmountOwed should return the correct format", () => {
    const persons: PersonType[] = [{ name: "test", items: [{ cost: 5 }] }];

    expect(formatAmountOwed(calculateAmountOwed(persons, 10, 0))).toBe(10);
  });

  test("calculateAmountOwed should return the right values", () => {
    const persons: PersonType[] = [
      { name: "test", items: [{ cost: 2 }] },
      { name: "test", items: [{ cost: 5 }] },
    ];

    expect(formatAmountOwed(calculateAmountOwed(persons, 10, 0))).toBe(2.85);

    expect(formatAmountOwed(calculateAmountOwed(persons, 10, 1))).toBe(7.14);
  });

  test("calculateAmountOwed should return 0 if the user does not exist", () => {
    const persons: PersonType[] = [
      { name: "test", items: [{ cost: 2 }] },
      { name: "test", items: [{ cost: 5 }] },
    ];

    expect(formatAmountOwed(calculateAmountOwed(persons, 10, 3))).toBe(0);
  });

  test("calculateAmountOwed should return 0 if total is the same as the cost of the items", () => {
    const persons: PersonType[] = [
      { name: "test", items: [{ cost: 2 }] },
      { name: "test", items: [{ cost: 5 }] },
      { name: "test", items: [{ cost: 3 }] },
    ];

    expect(formatAmountOwed(calculateAmountOwed(persons, 10, 1))).toBe(0);
  });

  test("calculateAmountOwed should handle NaN as 0", () => {
    const persons: PersonType[] = [
      { name: "test", items: [{ cost: NaN }] },
      { name: "test", items: [{ cost: 5 }] },
      { name: "test", items: [{ cost: 3 }] },
    ];

    expect(formatAmountOwed(calculateAmountOwed(persons, 10, 0))).toBe(0);
  });
});
