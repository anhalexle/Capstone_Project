/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MasterCard from "examples/Cards/MasterCard";
import DefaultInfoCard from "examples/Cards/InfoCards/DefaultInfoCard";

// Billing page components
import PaymentMethod from "layouts/billing/components/PaymentMethod";
import Invoices from "layouts/billing/components/Invoices";
import BillingInformation from "layouts/billing/components/BillingInformation";
import Transactions from "layouts/billing/components/Transactions";
import { GridToolbarExport } from "@mui/x-data-grid-pro";
//Print
import { useReactToPrint } from "react-to-print";
import { useRef, useState } from "react";
//bảng
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
//
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
//
import ChartDayIndex from "../billing/Chart/ChartDayIndex";
import ChartYearIndex from "../billing/Chart/ChartYearIndex";
import { TextField, Button } from "@mui/material";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addDays, setHours, setMinutes } from "date-fns";
//
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { styled } from "@mui/material/styles";
//
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Warning } from "@mui/icons-material";

function Billing() {
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "cccc",
  });
  // ----------------------------------------------------------------------------------------------------------------------
  //báo cáo:
  const arryMonth = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const [yearReport, setYearReport] = useState(new Date().getFullYear());
  const [monthReport, setMonthReport] = useState(new Date().getMonth() - 1);
  const startDateReport = new Date(
    monthReport === 1 ? `12/12/${yearReport - 1}` : `12/${monthReport - 1}/${yearReport}`
  );
  const endDateReport = new Date(`11/${monthReport}/${yearReport}`);
  // Tính hiệu của hai đối tượng Date theo đơn vị mili giây
  console.log("ngayffffffffffffff", endDateReport.getTime(), startDateReport.getTime());
  const timeDiff = Math.abs(endDateReport.getTime() - startDateReport.getTime());
  const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

  // ----------------------------------------------------------------------------------------------------------------
  // xử lý tra cứu điện trong ngày
  const [startIndexDay, setStartIndexDay] = useState(
    new Date(new Date().setDate(new Date().getDate() - 1))
  );
  const [endIndexDay, setEndIndexDay] = useState(new Date());
  const [dataIndexDay, setDataIndexDay] = useState([]);
  // chỉ số biểu đồ
  const [valueTabIndexDay, setvalueTabIndexDay] = useState("1");
  const handleFindIndexDay = () => {
    // gửi yêu cầu fetch dữ liệu từ server với startDate và endDate đã chọn
    console.log(
      "bắn",
      `http://localhost:3001/api/v1/alarms/getSpecificAlarm?startDate=${startIndexDay}&endDate=${endIndexDay}`
    );
    ///
    // fetch(
    //   `http://localhost:3001/api/v1/alarms/getSpecificAlarm?startDate=${startIndexDay}&endDate=${endIndexDay}`
    // )
    ///giả lập
    fetch("http://localhost:3001/api/indexDay")
      .then((response) => response.json())
      .then((data) => {
        setDataIndexDay(data);
        console.log("data nè", data);
      })
      .catch((error) => {
        Alert("Error fetching data from server:", error);
      });
  };
  //xử lý tra cứu điện trong năm
  const [yearIndex, setYearIndex] = useState(new Date().getFullYear());
  const [dataIndexYear, setDataIndexYear] = useState([]);
  // chỉ số biểu đồ
  const [valueTabIndexYear, setvalueTabIndexYear] = useState("1");
  const handleFindIndexYear = () => {
    // fetch(
    //   `http://localhost:3001/api/v1/alarms/getSpecificAlarm?year=${yearIndex}`
    // )
    ///giả lập
    fetch("http://localhost:3001/api/indexYear")
      .then((response) => response.json())
      .then((data) => {
        setDataIndexYear(data);
        console.log("data year nè", data);
      })
      .catch((error) => {
        Alert("Error fetching data from server:", error);
      });
  };

  //Định dạng màu cho table
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
  return (
    <DashboardLayout>
      {/* <DashboardNavbar absolute isMini /> */}
      <DashboardNavbar></DashboardNavbar>
      {/* <MDBox mt={8}> */}
      {/* <MDBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <Grid container spacing={3}>
                <Grid item xs={12} xl={6}>
                  <MasterCard number={4562112245947852} holder="jack peterson" expires="11/22" />
                </Grid>
                <Grid item xs={12} md={6} xl={3}>
                  <DefaultInfoCard
                    icon="account_balance"
                    title="salary"
                    description="Belong Interactive"
                    value="+$2000"
                  />
                </Grid>
                <Grid item xs={12} md={6} xl={3}>
                  <DefaultInfoCard
                    icon="paypal"
                    title="paypal"
                    description="Freelance Payment"
                    value="$455.00"
                  />
                </Grid>
                <Grid item xs={12}>
                  <PaymentMethod />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} lg={4}>
              <Invoices />
            </Grid>
          </Grid>
        </MDBox>
        <MDBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={7}>
              <BillingInformation />
            </Grid>
            <Grid item xs={12} md={5}>
              <Transactions />
            </Grid>
          </Grid>
        </MDBox> */}
      {/* </MDBox> */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography
            sx={{
              width: "100%",
              flexShrink: 0,
              // fontStyle: "italic",
              color: "black",
            }}
          >
            BÁO CÁO
          </Typography>
        </AccordionSummary>
        <button onClick={handlePrint}>dsdsd</button>
        <AccordionDetails>
          <Grid align="center" mt={1} mb={3} container spacing={3}>
            {/* tháng */}
            <Grid item xs={4} md={4} lg={4}>
              {/* <Box sx={{ minWidth: 120 }}> */}
              <FormControl>
                <InputLabel color="secondary">Tháng</InputLabel>
                <Select
                  style={{ width: 100, height: 40 }}
                  value={monthReport}
                  label="Tháng"
                  onChange={(event) => {
                    setMonthReport(event.target.value);
                  }}
                >
                  {arryMonth.map((month) => (
                    <MenuItem key={month} value={month}>
                      {month}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {/* </Box> */}
            </Grid>
            {/* nú nhấn năm với tra cứu */}
            <Grid item xs={4} md={4} lg={4}>
              {/* <Box sx={{ minWidth: 120 }}> */}
              <FormControl>
                <InputLabel color="secondary">Năm</InputLabel>
                <Select
                  style={{ width: 100, height: 40 }}
                  value={yearReport}
                  label="Năm"
                  onChange={(event) => {
                    setYearReport(event.target.value);
                  }}
                >
                  {Array.from(
                    { length: new Date().getFullYear() - 2017 + 1 },
                    (_, index) => new Date().getFullYear() - index
                  ).map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {/* </Box> */}
            </Grid>
            {/* nút tra cứu */}
            <Grid item xs={4} md={4} lg={4}>
              <Button variant="contained" style={{ color: "white" }} onClick={handleFindIndexYear}>
                Tra Cứu
              </Button>
            </Grid>
          </Grid>

          <Box style={{ border: "2px solid #0077be", borderRadius: "4px", padding: "15px" }}>
            <Grid>
              <Typography
                sx={{
                  width: "100%",
                  color: "black",
                  textDecoration: "underline",
                }}
                variant="h5"
              >
                TÌNH HÌNH SỬ DỤNG ĐIỆN
              </Typography>

              <Typography variant="subtitle1">
                Kỳ hóa đơn: Tháng {monthReport}/{yearReport} ({dayDiff} ngày từ{" "}
                {startDateReport.toLocaleDateString()} đến {endDateReport.toLocaleDateString()})
              </Typography>
              {/* Bảng */}
              <TableContainer component={Paper}>
                <Table>
                  <TableBody>
                    <TableRow sx={{ backgroundColor: "#bf68e68a" }}>
                      <StyledTableCell sx={{ fontWeight: "bold" }} align="center">
                        Bộ chỉ số
                      </StyledTableCell>
                      <StyledTableCell sx={{ fontWeight: "bold" }} align="center">
                        Chỉ số mới
                      </StyledTableCell>
                      <StyledTableCell sx={{ fontWeight: "bold" }} align="center">
                        Chỉ số cũ
                      </StyledTableCell>
                      <StyledTableCell sx={{ fontWeight: "bold" }} align="center">
                        Hệ số nhân
                      </StyledTableCell>
                      <StyledTableCell sx={{ fontWeight: "bold" }} align="center">
                        Điện tiêu thụ  (kWh)
                      </StyledTableCell>
                    </TableRow>
                    {/* {dataIndexDay.map((row) => (
                      <StyledTableRow key={row.Date}>
                        <StyledTableCell align="center">{row.Date}</StyledTableCell>
                        <StyledTableCell align="center">{row.OffPeak}</StyledTableCell>
                        <StyledTableCell align="center">{row.Normal}</StyledTableCell>
                        <StyledTableCell align="center">{row.Peak}</StyledTableCell>
                        <StyledTableCell align="center">
                          {row.OffPeak + row.Normal + row.Peak}
                        </StyledTableCell>
                      </StyledTableRow>
                    ))} */}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* SẢN LƯỢNG ĐIỆN TIÊU THỤ TRONG NGÀY */}

      <Box mt={2} mb={2} ref={componentRef}>
        <Accordion>
          <AccordionSummary
            sx={{ backgroundColor: "#3b86ffb0", borderRadius: "7px" }}
            expandIcon={<ExpandMoreIcon />}
          >
            <Typography
              sx={{
                width: "100%",
                color: "black",
              }}
              variant="h4"
            >
              SẢN LƯỢNG ĐIỆN TIÊU THỤ TRONG NGÀY
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid align="center" mt={1} mb={3} container spacing={3}>
              <Grid item xs={12} md={4} lg={4}>
                <Grid>
                  <Typography>Ngày bắt đầu:</Typography>
                </Grid>
                <Grid>
                  <DatePicker
                    selected={startIndexDay}
                    onChange={(date) => setStartIndexDay(date)}
                    maxDate={new Date()}
                    dateFormat="dd/MM/yyyy"
                  ></DatePicker>
                </Grid>
              </Grid>
              {/* // */}
              <Grid item xs={12} md={4} lg={4}>
                <Grid>
                  <Typography>Ngày kết thúc:</Typography>
                </Grid>
                <Grid>
                  <DatePicker
                    selected={endIndexDay}
                    onChange={(date) => setEndIndexDay(date)}
                    maxDate={new Date()}
                    dateFormat="dd/MM/yyyy"
                    style={{
                      border: "2px solid #00bfff",
                      borderRadius: "5px",
                      padding: "10px",
                    }}
                    className="custom-datepicker"
                    calendarClassName="custom-datepicker-calendar"
                    dayClassName="custom-datepicker-day"
                  ></DatePicker>
                </Grid>
              </Grid>
              {/* // */}
              <Grid item xs={12} md={4} lg={4} style={{ paddingTop: "40px" }}>
                <Button variant="contained" style={{ color: "white" }} onClick={handleFindIndexDay}>
                  Tra Cứu
                </Button>
              </Grid>
            </Grid>
            <Box sx={{ width: "100%", typography: "body1" }}>
              <TabContext value={valueTabIndexDay}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <TabList
                    onChange={(event, newValue) => {
                      setvalueTabIndexDay(newValue);
                    }}
                    aria-label="lab API tabs example"
                  >
                    <Tab label="Chỉ Số" value="1" />
                    <Tab label="Biểu Đồ" value="2" />
                  </TabList>
                </Box>
                <TabPanel value="1">
                  <TableContainer component={Paper}>
                    <Table aria-label="customized table">
                      <TableBody>
                        <TableRow sx={{ backgroundColor: "#bf68e68a" }}>
                          <StyledTableCell sx={{ fontWeight: "bold" }} align="center">
                            Thời gian
                          </StyledTableCell>
                          <StyledTableCell sx={{ fontWeight: "bold" }} align="center">
                            Giờ thấp điểm&nbsp;(kWh)
                          </StyledTableCell>
                          <StyledTableCell sx={{ fontWeight: "bold" }} align="center">
                            Giờ bình thường&nbsp;(kWh)
                          </StyledTableCell>
                          <StyledTableCell sx={{ fontWeight: "bold" }} align="center">
                            Giờ cao điểm&nbsp;(kWh)
                          </StyledTableCell>
                          <StyledTableCell sx={{ fontWeight: "bold" }} align="center">
                            Tổng&nbsp;(kWh)
                          </StyledTableCell>
                        </TableRow>
                        {dataIndexDay.map((row) => (
                          <StyledTableRow key={row.Date}>
                            <StyledTableCell align="center">{row.Date}</StyledTableCell>
                            <StyledTableCell align="center">{row.OffPeak}</StyledTableCell>
                            <StyledTableCell align="center">{row.Normal}</StyledTableCell>
                            <StyledTableCell align="center">{row.Peak}</StyledTableCell>
                            <StyledTableCell align="center">
                              {row.OffPeak + row.Normal + row.Peak}
                            </StyledTableCell>
                          </StyledTableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </TabPanel>
                <TabPanel value="2">
                  <ChartDayIndex data={dataIndexDay}></ChartDayIndex>
                </TabPanel>
              </TabContext>
            </Box>
          </AccordionDetails>
        </Accordion>
      </Box>

      {/* Chỉ số điện */}

      <Box mt={2} mb={2} ref={componentRef}>
        <Accordion>
          <AccordionSummary
            sx={{ backgroundColor: "#3b86ffb0", borderRadius: "7px" }}
            expandIcon={<ExpandMoreIcon />}
          >
            <Typography
              sx={{
                width: "100%",
                color: "black",
              }}
              variant="h4"
            >
              TRA CỨU CHỈ SỐ
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid align="center" mt={1} mb={3} container spacing={3}>
              {/* nú nhấn năm với tra cứu */}
              <Grid item xs={6} md={6} lg={6}>
                {/* <Box sx={{ minWidth: 120 }}> */}
                <FormControl>
                  <InputLabel color="secondary">Năm</InputLabel>
                  <Select
                    style={{ width: 100, height: 40 }}
                    value={yearIndex}
                    label="Năm"
                    onChange={(event) => {
                      setYearIndex(event.target.value);
                    }}
                  >
                    {Array.from(
                      { length: new Date().getFullYear() - 2017 + 1 },
                      (_, index) => new Date().getFullYear() - index
                    ).map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {/* </Box> */}
              </Grid>
              {/* nút tra cứu */}
              <Grid item xs={6} md={6} lg={6}>
                <Button
                  variant="contained"
                  style={{ color: "white" }}
                  onClick={handleFindIndexYear}
                >
                  Tra Cứu
                </Button>
              </Grid>
            </Grid>
            <Box sx={{ width: "100%", typography: "body1" }}>
              <TabContext value={valueTabIndexYear}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <TabList
                    onChange={(event, newValue) => {
                      setvalueTabIndexYear(newValue);
                    }}
                  >
                    <Tab label="Chỉ Số" value="1" />
                    <Tab label="Biểu Đồ" value="2" />
                  </TabList>
                </Box>
                <TabPanel value="1">
                  <TableContainer component={Paper}>
                    <Table aria-label="customized table">
                      <TableBody>
                        <TableRow sx={{ backgroundColor: "#bf68e68a" }}>
                          <StyledTableCell sx={{ fontWeight: "bold" }} align="center">
                            Năm
                          </StyledTableCell>
                          <StyledTableCell sx={{ fontWeight: "bold" }} align="center">
                            Tháng
                          </StyledTableCell>
                          <StyledTableCell sx={{ fontWeight: "bold" }} align="center">
                            Giờ thấp điểm&nbsp;(kWh)
                          </StyledTableCell>
                          <StyledTableCell sx={{ fontWeight: "bold" }} align="center">
                            Giờ bình thường&nbsp;(kWh)
                          </StyledTableCell>
                          <StyledTableCell sx={{ fontWeight: "bold" }} align="center">
                            Giờ cao điểm&nbsp;(kWh)
                          </StyledTableCell>
                          <StyledTableCell sx={{ fontWeight: "bold" }} align="center">
                            Tổng&nbsp;(kWh)
                          </StyledTableCell>
                        </TableRow>
                        {dataIndexYear.map((row) => (
                          <StyledTableRow key={row.Month}>
                            <StyledTableCell align="center">{row.Year}</StyledTableCell>
                            <StyledTableCell align="center">{row.Month}</StyledTableCell>
                            <StyledTableCell align="center">{row.ThisYear.OffPeak}</StyledTableCell>
                            <StyledTableCell align="center">{row.ThisYear.Normal}</StyledTableCell>
                            <StyledTableCell align="center">{row.ThisYear.Peak}</StyledTableCell>
                            <StyledTableCell align="center">
                              {row.ThisYear.OffPeak + row.ThisYear.Normal + row.ThisYear.Peak}
                            </StyledTableCell>
                          </StyledTableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </TabPanel>
                <TabPanel value="2">
                  {/* <ChartDayIndex data={dataIndexYear}></ChartDayIndex> */}
                  <ChartYearIndex data={dataIndexYear}></ChartYearIndex>
                </TabPanel>
              </TabContext>
            </Box>
          </AccordionDetails>
        </Accordion>
      </Box>

      <Accordion
      // expanded={chartVoltage}
      // onChange={() => {
      //   setChartVoltage((prevState) => !prevState);
      // }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography
            sx={{
              width: "100%",
              flexShrink: 0,
              // fontStyle: "italic",
              color: "black",
            }}
          >
            TRA CỨU TIỀN ĐIỆN
          </Typography>
        </AccordionSummary>
        {/* <button onClick={handlePrint}>dsdsd</button> */}
        <AccordionDetails>
          <div>chào em anh đứng</div>
        </AccordionDetails>
      </Accordion>
      {/* <div ref={componentRef}>
        con chos nayf
        <div color="red"> ha has</div>
      </div> */}
    </DashboardLayout>
  );
}

export default Billing;
