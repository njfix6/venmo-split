import { Person } from "@mui/icons-material";
import {
  Card,
  CardContent,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";
import "./App.css";
import { AppContext } from "./AppContext";
import { PersonType } from "./Person";
import {
  calculateAmountOwed,
  formatAmountOwed,
  formatLongValue,
  getPersonsPercentOfTotal,
  getPersonsTaxAmount,
  getTotalCostofItems,
  getTotalItemCostForPerson,
  getTotalTaxAndTip,
} from "./Util";

type PersonOwesProps = {
  totalAmount: number;
  personIndex: number;
  persons: PersonType[];
};
// https://account.venmo.com/pay?amount=10

const PersonOwes = ({ persons, totalAmount, personIndex }: PersonOwesProps) => {
  const { rounding } = React.useContext(AppContext);

  const amountOwed = formatAmountOwed(
    calculateAmountOwed(persons, totalAmount, personIndex),
    rounding
  );

  const formatName = (name: string) => {
    const maxLength = 15;
    if (name.length > maxLength) {
      return `${name.substring(0, maxLength)}...`;
    }
    return name;
  };

  return (
    <>
      <Card variant="outlined">
        <Stack direction={"row"} spacing={2} alignItems={"center"} margin={2}>
          <Person />
          <Typography variant="h5" component="div" color="text.secondary">
            {formatName(persons[personIndex].name)} owes:
          </Typography>
          <div style={{ flexGrow: 1 }} />
          <Typography variant="h5" component="div" marginTop={0.5}>
            ${amountOwed}
          </Typography>
        </Stack>
        <Divider />
        <CardContent>
          <TableContainer>
            <Table size="small" aria-label="a dense table">
              <TableBody>
                <TableRow key={"personalTotal"}>
                  <TableCell align="left">
                    <Typography color="text.secondary" variant="body2">
                      {`Personal total amount spent (excluding tip and tax):`}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">{`$${formatLongValue(
                    getTotalItemCostForPerson(persons, personIndex)
                  )}`}</TableCell>
                </TableRow>

                <TableRow key={"total"}>
                  <TableCell align="left">
                    <Typography color="text.secondary" variant="body2">
                      {`Total amount spent (excluding tip and tax):`}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">{`$${formatLongValue(
                    getTotalCostofItems(persons, totalAmount, personIndex)
                  )}`}</TableCell>
                </TableRow>
                <TableRow
                  key={"taxandtip"}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="left">
                    <Typography color="text.secondary" variant="body2">
                      {`Total tax and tip:`}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">{`$${formatLongValue(
                    getTotalTaxAndTip(persons, totalAmount, personIndex)
                  )}`}</TableCell>
                </TableRow>

                <TableRow key={"percentTotal"}>
                  <TableCell align="left">
                    <Typography color="text.secondary" variant="body2">
                      {`Percent of total amount spent excluding tax and tip ($${formatLongValue(
                        getTotalItemCostForPerson(persons, personIndex)
                      )}/$${getTotalCostofItems(
                        persons,
                        totalAmount,
                        personIndex
                      )} ):`}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">{`${formatLongValue(
                    getPersonsPercentOfTotal(
                      persons,
                      getTotalCostofItems(persons, totalAmount, personIndex),
                      personIndex
                    ) * 100
                  )}%`}</TableCell>
                </TableRow>

                <TableRow
                  key={"taxandtipowed"}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="left">
                    <Typography color="text.secondary" variant="body2">
                      {`Tax and tip Owed (${formatLongValue(
                        getPersonsPercentOfTotal(
                          persons,
                          getTotalCostofItems(
                            persons,
                            totalAmount,
                            personIndex
                          ),
                          personIndex
                        )
                      )}x$${getTotalTaxAndTip(
                        persons,
                        totalAmount,
                        personIndex
                      )}):`}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">{`$${formatLongValue(
                    getPersonsTaxAmount(persons, totalAmount, personIndex)
                  )}`}</TableCell>
                </TableRow>

                <TableRow
                  key={"totalAmountOwed"}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="left">
                    <Typography color="text.secondary" variant="body2">
                      {`Total Amount Owed ($${formatLongValue(
                        getPersonsTaxAmount(persons, totalAmount, personIndex)
                      )}+$${formatLongValue(
                        getTotalItemCostForPerson(persons, personIndex)
                      )}):`}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">{`$${amountOwed}`}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </>
  );
};

export default PersonOwes;
