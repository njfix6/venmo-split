import React from "react";
import "./App.css";
import { TextField, Stack, Button, Box, Typography } from "@mui/material";
import Item, { ItemType } from "./Item";
import { Plus } from "react-feather";
import { PersonType } from "./Person";
import { formatAmountOwed, calculateAmountOwed } from "./Util";
import { AttachMoney, ExitToApp } from "@mui/icons-material";

type PersonOwesProps = {
  totalAmount: number;
  personIndex: number;
  persons: PersonType[];
};
// https://account.venmo.com/pay?amount=10

const PersonOwes = ({ persons, totalAmount, personIndex }: PersonOwesProps) => {
  const amountOwed = formatAmountOwed(
    calculateAmountOwed(persons, totalAmount, personIndex)
  );

  const openVenmoURL = () => {
    window.open(
      `https://account.venmo.com/pay?amount=${amountOwed ?? 0}`,
      "_blank"
    );
  };

  return (
    <Typography variant="body2" color="text.secondary">
      {persons[personIndex].name} owes you: ${amountOwed}{" "}
      <Button onClick={openVenmoURL} size={"small"} variant="outlined">
        <Typography variant="body2" marginRight={2}>
          Create Venmo
        </Typography>
        <ExitToApp />
      </Button>
    </Typography>
  );
};

export default PersonOwes;
