import React from "react";
import "./App.css";
import {
  Box,
  Stack,
  Typography,
  Button,
  FormControl,
  InputAdornment,
  OutlinedInput,
  IconButton,
} from "@mui/material";
import { PersonType } from "./Person";
import { User } from "react-feather";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { ItemType } from "./Item";
import PersonItems from "./PersonItems";
import PersonName from "./PersonName";
import PersonOwes from "./PersonOwes";
import { AppContext } from "./AppContext";
import { formatAmountOwed, calculateAmountOwed } from "./Util";

const PRIMARY_COLOR = "#FF0000";
const PRIMARY_TEXT_COLOR = "#FFFFFF";

const theme = createTheme({
  palette: {
    primary: {
      light: PRIMARY_COLOR,
      main: PRIMARY_COLOR,
      dark: PRIMARY_COLOR,
      contrastText: PRIMARY_TEXT_COLOR,
    },
  },
});

function App() {
  const [persons, setPersons] = React.useState<PersonType[]>([
    {
      name: "self",
      items: [],
    },
  ]);

  const [totalAmount, setTotalAmount] = React.useState<number>(0);

  const handleSetTotalAmount = (amount: number) => {
    setTotalAmount(amount);
  };

  const handleChangeTotalAmount = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void => {
    handleSetTotalAmount(parseFloat(e.target.value));
  };

  const handleSetPersons = (persons: PersonType[]) => {
    setPersons(persons);
  };

  const initPerson = () => {
    const person: PersonType = {
      name: "",
      items: [],
    };

    handleSetPersons([...persons, person]);
  };

  const removeItem = (personIndex: number, itemIndex: number) => {
    const updatedPersons: PersonType[] = persons.map((person, index) => {
      if (index === personIndex) {
        const filteredItemsFromPerson: PersonType = {
          ...person,
          items: person.items.filter((item, i) => {
            return i !== itemIndex;
          }),
        };

        return filteredItemsFromPerson;
      }
      return person;
    });

    handleSetPersons(updatedPersons);
  };

  const removePerson = (personIndex: number) => {
    const updatedPersons: PersonType[] = persons.filter((person, index) => {
      return personIndex !== index;
    });

    console.log("debug: remove person ", personIndex, persons, updatedPersons);

    handleSetPersons(updatedPersons);
  };

  const initItem = (personIndex: number) => {
    const item: ItemType = {
      cost: 0,
    };

    const updatedPersons: PersonType[] = persons.map((person, i) => {
      if (i === personIndex) {
        return {
          ...person,
          items: [...person.items, item],
        };
      } else {
        return person;
      }
    });

    handleSetPersons(updatedPersons);
  };

  const changeName = (personIndex: number, name: string) => {
    const updatedPersons: PersonType[] = persons.map((person, i) => {
      if (i === personIndex) {
        return {
          ...person,
          name,
        };
      } else {
        return person;
      }
    });

    handleSetPersons(updatedPersons);
  };

  const changePriceItem = (
    personIndex: number,
    itemIndex: number,
    cost: number
  ) => {
    const updatedPersons: PersonType[] = persons.map((person, i) => {
      if (i === personIndex) {
        const items: ItemType[] = person.items.map((item, i) => {
          if (i === itemIndex) {
            const item: ItemType = {
              cost,
            };
            return item;
          } else {
            return item;
          }
        });

        return {
          ...person,
          items,
        };
      } else {
        return person;
      }
    });

    handleSetPersons(updatedPersons);
  };

  return (
    <ThemeProvider theme={theme}>
      <AppContext.Provider
        value={{
          removeItem,
          initItem,
          changePriceItem,
          removePerson,
          changeName,
        }}
      >
        <Box margin={"100px"}>
          <Stack>
            <Typography fontFamily={"Pacifico"} fontSize={64}>
              <span style={{ color: PRIMARY_COLOR }}>Venmo Split</span>
            </Typography>
            <Typography fontSize={24}>
              The easiest way to split the check
            </Typography>
          </Stack>
          <Stack marginTop={"100px"} spacing={"100px"}>
            <Stack spacing={2} direction={"row"} alignItems={"center"}>
              <Typography fontSize={24}>Total Amount:</Typography>
              <Box>
                <FormControl>
                  <OutlinedInput
                    value={totalAmount}
                    onChange={handleChangeTotalAmount}
                    id="outlined-adornment-amount"
                    startAdornment={
                      <InputAdornment position="start">$</InputAdornment>
                    }
                    type="number"
                  />
                </FormControl>
              </Box>
            </Stack>

            <Stack marginTop={"100px"} spacing={4}>
              {persons?.map((person: PersonType, i: number) => {
                if (i === 0) {
                  return (
                    <>
                      <Stack
                        spacing={2}
                        direction={"row"}
                        alignItems={"center"}
                      >
                        <Typography fontSize={24}>You Had:</Typography>
                        <PersonItems person={person} personIndex={i} />
                      </Stack>
                      <Typography fontSize={24}>Split with...</Typography>
                    </>
                  );
                }

                return (
                  <Box>
                    <Stack alignItems={"center"} spacing={2} direction={"row"}>
                      <PersonName person={person} index={i} />
                      <PersonItems person={person} personIndex={i} />
                    </Stack>
                    <PersonOwes
                      amountOwed={formatAmountOwed(
                        calculateAmountOwed(persons, totalAmount, i)
                      )}
                    />
                  </Box>
                );
              })}

              <Box>
                <Button onClick={initPerson} variant="contained">
                  <Box style={{ display: "flex" }} mr={1}>
                    <User />
                  </Box>
                  Add Friend
                </Button>
              </Box>
            </Stack>
          </Stack>
        </Box>
      </AppContext.Provider>
    </ThemeProvider>
  );
}

export default App;
