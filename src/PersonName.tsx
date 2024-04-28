import React from "react";
import "./App.css";
import {
  TextField,
  Stack,
  Button,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import Item, { ItemType } from "./Item";
import { Plus } from "react-feather";
import { PersonType } from "./Person";
import { Minus } from "react-feather";
import { AppContext } from "./AppContext";

type PersonNameProps = {
  person: PersonType;
  index: number;
};

const PersonName = ({ person, index }: PersonNameProps) => {
  const { removePerson, changeName } = React.useContext(AppContext);

  return (
    <>
      <TextField
        id="outlined-basic"
        label={`Friend ${index + 1} Name`}
        variant="outlined"
        value={person.name}
        onChange={({ target }) => changeName(index, target.value)}
      />
      <IconButton
        onClick={() => removePerson(index)}
        size="small"
        aria-label="delete"
      >
        <Minus />
      </IconButton>
      <Typography fontSize={16}>had</Typography>
    </>
  );
};

export default PersonName;
