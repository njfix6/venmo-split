import React from "react";
import "./App.css";
import { TextField, Stack, Button, Box, Typography } from "@mui/material";
import Item, { ItemType } from "./Item";
import { Plus } from "react-feather";
import { PersonType } from "./Person";

type PersonOwesProps = {
  amountOwed: number;
};

const PersonOwes = ({ amountOwed }: PersonOwesProps) => {
  return <Typography fontSize={24}>Owes you: ${amountOwed}</Typography>;
};

export default PersonOwes;
