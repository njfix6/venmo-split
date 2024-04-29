import React from "react";
import { Rounding } from "./Util";

type AppContextContextProps = {
  removeItem: (personIndex: number, itemIndex: number) => void;
  initItem: (personIndex: number) => void;
  changePriceItem: (
    personIndex: number,
    itemIndex: number,
    cost: number
  ) => void;
  removePerson: (personIndex: number) => void;
  changeName: (personIndex: number, name: string) => void;
  rounding: Rounding;
};

export const AppContext = React.createContext<AppContextContextProps>({
  removeItem: () => null,
  initItem: () => null,
  changePriceItem: () => null,
  removePerson: () => null,
  changeName: () => null,
  rounding: Rounding.Nearest,
});
