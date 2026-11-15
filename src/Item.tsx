import React from "react";
import "./App.css";
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { Minus } from "react-feather";
import { AppContext } from "./AppContext";

export type ItemType = {
  cost: number;
};

type ItemProps = {
  item: ItemType;
  index: number;
  personIndex: number;
};

const Item = ({ item, index, personIndex }: ItemProps) => {
  const { changePriceItem, removeItem } = React.useContext(AppContext);

  const LABEL = `Item ${index + 1}`;
  const inputId = `item-${personIndex}-${index}`;

  const handleChangeTotalAmount = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ): void => {
    changePriceItem(personIndex, index, parseFloat(e.target.value));
  };

  return (
    <>
      <FormControl fullWidth>
        <InputLabel htmlFor={inputId} size="small">
          {LABEL}
        </InputLabel>

        <OutlinedInput
          id={inputId}
          startAdornment={<InputAdornment position="start">$</InputAdornment>}
          label={LABEL}
          value={item.cost}
          type="number"
          inputProps={{ inputMode: "decimal", min: 0 }}
          onChange={handleChangeTotalAmount}
          size={"small"}
          endAdornment={
            <IconButton
              onClick={() => removeItem(personIndex, index)}
              size="small"
              aria-label="remove item"
            >
              <Minus size={20} />
            </IconButton>
          }
        />
      </FormControl>
    </>
  );
};

export default Item;
