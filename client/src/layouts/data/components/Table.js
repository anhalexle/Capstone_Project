import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  tableCellClasses,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import moment from "moment";
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function TableData({ data, name }) {
  console.log("fsfdfs",data);
  return (
    <TableContainer component={Paper}>
      <Table aria-label="customized table">
        <TableBody>
          <TableRow sx={{ backgroundColor: "#bf68e68a" }}>
            <StyledTableCell sx={{ fontWeight: "bold" }} align="center">
              Tên
            </StyledTableCell>
            <StyledTableCell sx={{ fontWeight: "bold" }} align="center">
              Time Stamp
            </StyledTableCell>
            <StyledTableCell sx={{ fontWeight: "bold" }} align="center">
              Giá trị
            </StyledTableCell>
          </TableRow>
          {data.map((row) => {
            return (
              row.ThisYear !== 0 && (
                <StyledTableRow key={row.createdAt}>
                  <StyledTableCell align="center">{name}</StyledTableCell>
                  <StyledTableCell align="center">
                    {moment(row.createdAt).format("DD/MM/YYYY hh:mm A")}
                  </StyledTableCell>
                  <StyledTableCell align="center">{row.value}</StyledTableCell>
                </StyledTableRow>
              )
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
