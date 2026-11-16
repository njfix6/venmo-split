import { Fastfood } from "@mui/icons-material";
import { Button, Grid } from "@mui/material";
import React from "react";
import "./App.css";
import { AppContext } from "./AppContext";
import Item, { ItemType } from "./Item";
import { PersonType } from "./Person";

type PersonItemsProps = {
  person: PersonType;
  personIndex: number;
  name?: React.ReactNode;
};

const PersonItems = ({ person, personIndex, name }: PersonItemsProps) => {
  const { initItem } = React.useContext(AppContext);

  return (
    <>
      <Grid container spacing={2} alignItems="center">
        {name && (
          <Grid item xs={12}>
            {name}
          </Grid>
        )}
        {person.items.map((item: ItemType, index: number) => {
          return (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Item item={item} index={index} personIndex={personIndex} />
            </Grid>
          );
        })}
        <Grid item xs="auto">
          <Button
            onClick={() => initItem(personIndex)}
            variant="contained"
            aria-label="add item"
          >
            <Fastfood />
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default PersonItems;
