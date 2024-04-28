import React from "react";
import "./App.css";
import {
  InputLabel,
  InputAdornment,
  OutlinedInput,
  FormControl,
  Chip,
  TextField,
  Box,
  IconButton,
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

  const handleChangeTotalAmount = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void => {
    changePriceItem(personIndex, index, parseFloat(e.target.value));
  };

  return (
    <>
      <FormControl>
        <InputLabel htmlFor="outlined-adornment-amount">{LABEL}</InputLabel>

        <OutlinedInput
          id="outlined-adornment-amount"
          startAdornment={<InputAdornment position="start">$</InputAdornment>}
          label={LABEL}
          value={item.cost}
          type="number"
          onChange={handleChangeTotalAmount}
          size={"small"}
          endAdornment={
            <IconButton
              onClick={() => removeItem(personIndex, index)}
              size="small"
              aria-label="delete"
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
