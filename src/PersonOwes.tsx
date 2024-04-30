import { Person } from "@mui/icons-material";
import {
  Card,
  CardContent,
  Collapse,
  Divider,
  IconButton,
  IconButtonProps,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  styled,
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

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

type PersonOwesProps = {
  totalAmount: number;
  personIndex: number;
  persons: PersonType[];
};
// https://account.venmo.com/pay?amount=10

const PersonOwes = ({ persons, totalAmount, personIndex }: PersonOwesProps) => {
  const { rounding } = React.useContext(AppContext);

  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

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
          <Typography variant="h6" component="div" color="text.secondary">
            {formatName(persons[personIndex].name)} owes:
          </Typography>
          <div style={{ flexGrow: 1 }} />
          <Typography variant="h6" component="div" marginTop={0.5}>
            ${amountOwed}
          </Typography>
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </ExpandMore>
        </Stack>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Divider />

          <CardContent>
            <TableContainer>
              <Table size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell>Breakdown:</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
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
        </Collapse>
      </Card>
    </>
  );
};

export default PersonOwes;
