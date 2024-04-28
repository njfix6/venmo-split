import React from "react";

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
};

export const AppContext = React.createContext<AppContextContextProps>({
  removeItem: () => null,
  initItem: () => null,
  changePriceItem: () => null,
  removePerson: () => null,
  changeName: () => null,
});
