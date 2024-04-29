import { IconButton, Stack, TextField, Typography } from "@mui/material";
import React from "react";
import { Minus } from "react-feather";
import "./App.css";
import { AppContext } from "./AppContext";
import { PersonType } from "./Person";

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
