import React from "react";
import "./App.css";
import { TextField, Stack, Button, Box, Typography } from "@mui/material";
import Item, { ItemType } from "./Item";
import { Plus } from "react-feather";
import { PersonType } from "./Person";
import { AppContext } from "./AppContext";

type PersonItemsProps = {
  person: PersonType;
  personIndex: number;
};

const PersonItems = ({ person, personIndex }: PersonItemsProps) => {
  const { initItem } = React.useContext(AppContext);

  return (
    <>
      {person.items.map((item: ItemType, index: number) => {
        return (
          <>
            <Item item={item} index={index} personIndex={personIndex} />
          </>
        );
      })}
      <Button onClick={() => initItem(personIndex)} variant="outlined">
        <Plus />
      </Button>
    </>
  );
};

export default PersonItems;
