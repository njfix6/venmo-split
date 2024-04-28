import React from "react";
import "./App.css";
import { TextField, Stack, Button, Box, Grid } from "@mui/material";
import Item, { ItemType } from "./Item";
import { Plus } from "react-feather";
import { PersonType } from "./Person";
import { AppContext } from "./AppContext";
import { Fastfood } from "@mui/icons-material";

type PersonItemsProps = {
  person: PersonType;
  personIndex: number;
  name?: React.ReactNode;
};

const PersonItems = ({ person, personIndex, name }: PersonItemsProps) => {
  const { initItem } = React.useContext(AppContext);

  return (
    <>
      <Grid container spacing={2}>
        {name && <Grid item>{name}</Grid>}
        {person.items.map((item: ItemType, index: number) => {
          return (
            <Grid item xs={4} lg={3}>
              <Item item={item} index={index} personIndex={personIndex} />
            </Grid>
          );
        })}
        <Grid item xs={2}>
          <Button onClick={() => initItem(personIndex)} variant="contained">
            <Stack direction={"row"} spacing={3}>
              <Fastfood />
            </Stack>
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default PersonItems;
