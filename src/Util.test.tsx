import { describe, expect, test } from "@jest/globals";
import { PersonType } from "./Person";
import {
  Rounding,
  calculateAmountOwed,
  formatAmountOwed,
  formatLongValue,
} from "./Util";

describe("Util", () => {
  test("calculateAmountOwed should return the correct format", () => {
    const persons: PersonType[] = [{ name: "test", items: [{ cost: 5 }] }];

    expect(
      formatAmountOwed(calculateAmountOwed(persons, 10, 0), Rounding.Down)
    ).toBe(10);
  });

  test("calculateAmountOwed should return the right values", () => {
    const persons: PersonType[] = [
      { name: "test", items: [{ cost: 2 }] },
      { name: "test", items: [{ cost: 5 }] },
    ];

    expect(
      formatAmountOwed(calculateAmountOwed(persons, 10, 0), Rounding.Down)
    ).toBe(2.85);

    expect(
      formatAmountOwed(calculateAmountOwed(persons, 10, 1), Rounding.Down)
    ).toBe(7.14);
  });

  test("formatAmountOwed NaN should be 0", () => {
    expect(formatAmountOwed(NaN, Rounding.Down)).toBe(0);
  });

  test("calculateAmountOwed should return the right values for multiple people", () => {
    const persons: PersonType[] = [
      { name: "test", items: [{ cost: 2 }] },
      { name: "test", items: [{ cost: 2 }] },
      { name: "test", items: [{ cost: 5 }] },
    ];

    // 2.22 + 2.22 + 5.55 = 10

    expect(
      formatAmountOwed(calculateAmountOwed(persons, 10, 0), Rounding.Down)
    ).toBe(2.22);

    expect(
      formatAmountOwed(calculateAmountOwed(persons, 10, 1), Rounding.Down)
    ).toBe(2.22);

    expect(
      formatAmountOwed(calculateAmountOwed(persons, 10, 2), Rounding.Down)
    ).toBe(5.55);
  });

  test("calculateAmountOwed with Roundinging up should work right", () => {
    const persons: PersonType[] = [
      { name: "test", items: [{ cost: 2 }] },
      { name: "test", items: [{ cost: 2 }] },
      { name: "test", items: [{ cost: 5 }] },
    ];

    // 2.22 + 2.22 + 5.55 = 10

    expect(
      formatAmountOwed(calculateAmountOwed(persons, 10, 0), Rounding.Up)
    ).toBe(2.23);

    expect(
      formatAmountOwed(calculateAmountOwed(persons, 10, 1), Rounding.Up)
    ).toBe(2.23);

    expect(
      formatAmountOwed(calculateAmountOwed(persons, 10, 2), Rounding.Up)
    ).toBe(5.56);
  });

  test("calculateAmountOwed with Roundinging to nearest", () => {
    const persons: PersonType[] = [
      { name: "test", items: [{ cost: 2 }] },
      { name: "test", items: [{ cost: 2 }] },
      { name: "test", items: [{ cost: 5 }] },
    ];

    // 2.22 + 2.22 + 5.55 = 10

    expect(
      formatAmountOwed(calculateAmountOwed(persons, 10, 0), Rounding.Nearest)
    ).toBe(2.22);

    expect(
      formatAmountOwed(calculateAmountOwed(persons, 10, 1), Rounding.Nearest)
    ).toBe(2.22);

    expect(
      formatAmountOwed(calculateAmountOwed(persons, 10, 2), Rounding.Nearest)
    ).toBe(5.56);
  });

  test("calculateAmountOwed should return 0 if the user does not exist", () => {
    const persons: PersonType[] = [
      { name: "test", items: [{ cost: 2 }] },
      { name: "test", items: [{ cost: 5 }] },
    ];

    expect(
      formatAmountOwed(calculateAmountOwed(persons, 10, 3), Rounding.Down)
    ).toBe(0);
  });

  test("calculateAmountOwed should return 0 if total is the same as the cost of the items", () => {
    const persons: PersonType[] = [
      { name: "test", items: [{ cost: 2 }] },
      { name: "test", items: [{ cost: 5 }] },
      { name: "test", items: [{ cost: 3 }] },
    ];

    expect(
      formatAmountOwed(calculateAmountOwed(persons, 10, 1), Rounding.Down)
    ).toBe(0);
  });

  test("calculateAmountOwed should handle NaN as 0", () => {
    const persons: PersonType[] = [
      { name: "test", items: [{ cost: NaN }] },
      { name: "test", items: [{ cost: 5 }] },
      { name: "test", items: [{ cost: 3 }] },
    ];

    expect(
      formatAmountOwed(calculateAmountOwed(persons, 10, 0), Rounding.Down)
    ).toBe(0);
  });

  test("formatLongString should show 3 decimals", () => {
    expect(formatLongValue(123.25)).toBe("123.25");
    expect(formatLongValue(123.2523)).toBe("123.2523");
    expect(formatLongValue(123.25234)).toBe("123.2523...");
    expect(formatLongValue(123.25236)).toBe("123.2524...");
  });
});
