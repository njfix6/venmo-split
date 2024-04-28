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
    <Stack alignItems={"center"} spacing={2} direction={"row"}>
      <TextField
        id="outlined-basic"
        label={`Friend's Name`}
        variant="outlined"
        value={person.name}
        onChange={({ target }) => changeName(index, target.value)}
        size="small"
        InputProps={{
          endAdornment: (
            <IconButton
              onClick={() => removePerson(index)}
              size="small"
              aria-label="delete"
            >
              <Minus size={20} />
            </IconButton>
          ),
        }}
      />

      <Typography>had</Typography>
    </Stack>
  );
};

export default PersonName;
