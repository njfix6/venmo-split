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
  Grid,
  Card,
  CardHeader,
  CardContent,
  Chip,
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
import { Person } from "@mui/icons-material";

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
  components: {
    MuiCard: {
      defaultProps: {
        elevation: 3,
      },
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
      name: `Friend ${persons.length} `,
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
        <Box margin={2}>
          <Grid container spacing={2}>
            <Grid item xs={1} md={3}></Grid>
            <Grid item xs={10} md={6}>
              <Stack spacing={3}>
                <Stack>
                  <Typography fontFamily={"Pacifico"} fontSize={64}>
                    <span style={{ color: PRIMARY_COLOR }}>Venmo Split</span>
                  </Typography>
                  <Typography fontSize={24}>
                    The easiest way to split the check
                  </Typography>
                </Stack>

                <Card>
                  <CardHeader
                    avatar={<Chip label="Step 1" />}
                    title="Total Amount Spent"
                  />
                  <CardContent>
                    <Stack spacing={2}>
                      <Typography variant="body2" color="text.secondary">
                        Fill in the total amount spent on the bill, including
                        tax and tip.
                      </Typography>

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
                    </Stack>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader
                    avatar={<Chip label="Step 2" />}
                    title="Your Spending"
                  />
                  <CardContent>
                    <Stack spacing={2}>
                      <Typography variant="body2" color="text.secondary">
                        Fill in how much you spent on the bill, not including
                        tax and tip.
                      </Typography>

                      <Box>
                        {persons.map((person, i) => {
                          if (i === 0) {
                            return (
                              <PersonItems person={person} personIndex={i} />
                            );
                          }
                        })}
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader
                    avatar={<Chip label="Step 3" />}
                    title="Amount Split Between Friends"
                  />

                  <CardContent>
                    <Stack spacing={4}>
                      <Typography variant="body2" color="text.secondary">
                        Add friends and fill in how much each friend spent, not
                        including tax and tip.
                      </Typography>

                      {persons.map((person, i) => {
                        if (i > 0) {
                          const personRender = (
                            <Stack>
                              <PersonItems
                                person={person}
                                personIndex={i}
                                name={<PersonName person={person} index={i} />}
                              />
                            </Stack>
                          );

                          return personRender;
                        }
                      })}

                      <Box>
                        <Button onClick={initPerson} variant="contained">
                          <Person />
                        </Button>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
                {persons.length > 1 && (
                  <Card>
                    <CardHeader
                      avatar={<Chip label="Finalize" />}
                      title="Venmo Your Friends"
                    />

                    <CardContent>
                      <Stack spacing={2}>
                        {persons.map((person, i) => {
                          if (i > 0) {
                            const personRender = (
                              <PersonOwes
                                persons={persons}
                                totalAmount={totalAmount}
                                personIndex={i}
                              />
                            );

                            return personRender;
                          }
                        })}
                      </Stack>
                    </CardContent>
                  </Card>
                )}
              </Stack>
            </Grid>
            <Grid item xs={1} md={3}></Grid>
          </Grid>
        </Box>
      </AppContext.Provider>
    </ThemeProvider>
  );
}

export default App;
