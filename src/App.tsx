import {
  ArrowDownward,
  ArrowUpward,
  ExitToApp,
  Person,
  SwapVert,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  FormControl,
  Grid,
  InputAdornment,
  OutlinedInput,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import React from "react";
import "./App.css";
import { AppContext } from "./AppContext";
import { ItemType } from "./Item";
import { PersonType } from "./Person";
import PersonItems from "./PersonItems";
import PersonName from "./PersonName";
import PersonOwes from "./PersonOwes";
import {
  Rounding,
  calculateAmountOwed,
  formatAmountOwed,
  stringToRounding,
} from "./Util";

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
        variant: "outlined",
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

  const [rounding, setRounding] = React.useState<Rounding>(Rounding.Nearest);

  const handleSetRounding = (rounding: Rounding) => {
    setRounding(rounding);
  };

  const handleRoundingChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string
  ) => {
    handleSetRounding(stringToRounding(newAlignment));
  };

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

  const openVenmosURL = () => {
    persons
      .filter((person, i) => i > 0)
      .forEach((person, personIndex) => {
        const amountOwed = formatAmountOwed(
          calculateAmountOwed(persons, totalAmount, personIndex),
          rounding
        );

        window.open(
          `https://account.venmo.com/pay?amount=${amountOwed ?? 0}`,
          "_blank"
        );
      });
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
          rounding,
        }}
      >
        <Box margin={2} marginBottom={20}>
          <Grid container spacing={2}>
            <Grid item xs={1} lg={3}></Grid>
            <Grid item xs={10} lg={6}>
              <Stack spacing={4}>
                <Stack spacing={0.5}>
                  <Typography fontFamily={"Pacifico"} fontSize={64}>
                    <span style={{ color: PRIMARY_COLOR }}>Venmo Split</span>
                  </Typography>
                  <Typography fontSize={22} fontFamily={"PermanentMarker"}>
                    The easiest way to split the check
                  </Typography>
                </Stack>
                <Card>
                  <CardHeader
                    avatar={<Chip label={<b>Step 1</b>} />}
                    title={<b>Total Amount Spent</b>}
                  />
                  <Divider />
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
                {totalAmount > 0 && (
                  <Card>
                    <CardHeader
                      avatar={<Chip label={<b>Step 2</b>} />}
                      title={<b>Your Spending</b>}
                    />
                    <Divider />

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
                )}
                {totalAmount > 0 &&
                  persons[0] &&
                  persons[0].items.length > 0 && (
                    <Card>
                      <CardHeader
                        avatar={<Chip label={<b>Step 3</b>} />}
                        title={<b>Amount Split Between Friends</b>}
                      />
                      <Divider />

                      <CardContent>
                        <Stack spacing={4}>
                          <Typography variant="body2" color="text.secondary">
                            Add friends and fill in how much each friend spent,
                            not including tax and tip.
                          </Typography>

                          {persons.map((person, i) => {
                            if (i > 0) {
                              const personRender = (
                                <Stack>
                                  <PersonItems
                                    person={person}
                                    personIndex={i}
                                    name={
                                      <PersonName person={person} index={i} />
                                    }
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
                  )}
                {persons.length > 1 && (
                  <Card>
                    <CardHeader
                      avatar={<Chip label={<b>Finalize</b>} />}
                      title={<b>Venmo Your Friends</b>}
                      action={
                        <ToggleButtonGroup
                          value={rounding}
                          exclusive
                          onChange={handleRoundingChange}
                          size="small"
                          aria-label="Platform"
                        >
                          <ToggleButton
                            value="justify"
                            aria-label="justified"
                            disabled
                          >
                            $0.00
                          </ToggleButton>
                          <Tooltip
                            placement="top"
                            title="Round up to 2 decimal places."
                          >
                            <ToggleButton value={Rounding.Up}>
                              <ArrowUpward />
                            </ToggleButton>
                          </Tooltip>
                          <Tooltip
                            placement="top"
                            title="Round to the nearest 2 decimal places."
                          >
                            <ToggleButton value={Rounding.Nearest}>
                              <SwapVert />
                            </ToggleButton>
                          </Tooltip>
                          <Tooltip
                            placement="top"
                            title="Round down to 2 decimal places."
                          >
                            <ToggleButton value={Rounding.Down}>
                              <ArrowDownward />
                            </ToggleButton>
                          </Tooltip>
                        </ToggleButtonGroup>
                      }
                    />

                    <Divider />
                    <CardContent>
                      <Grid container spacing={2}>
                        {persons.map((person, i) => {
                          if (i > 0) {
                            const personRender = (
                              <Grid item xs={12} md={6}>
                                <PersonOwes
                                  persons={persons}
                                  totalAmount={totalAmount}
                                  personIndex={i}
                                />
                              </Grid>
                            );

                            return personRender;
                          }
                        })}
                      </Grid>
                    </CardContent>
                    <Divider />

                    <Box sx={{ p: 2 }}>
                      <Button
                        variant="contained"
                        onClick={openVenmosURL}
                        size={"small"}
                      >
                        <Typography marginRight={2} variant="body2">
                          Create Venmos
                        </Typography>
                        <ExitToApp fontSize={"small"} />
                      </Button>
                    </Box>
                  </Card>
                )}
              </Stack>
            </Grid>
            <Grid item xs={1} lg={3}></Grid>
          </Grid>
        </Box>
      </AppContext.Provider>
    </ThemeProvider>
  );
}

export default App;
