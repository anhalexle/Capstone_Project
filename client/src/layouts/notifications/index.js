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

import { useEffect, useState } from "react";

// @mui material components
// import Grid from "@mui/material/Grid";
// import Card from "@mui/material/Card";

// import { 
//   Box, 
//   Typography, 
//   Table, 
//   TableHead, 
//   TableBody, 
//   TableCell, 
//   TableRow 
// } from '@material-ui/core';

//sửa lại thư viện
import { Grid, Card, Box, Typography, Table, TableHead, TableBody, TableCell, TableRow } from '@mui/material';
import moment from 'moment';
//thêm thư viện chọn ngày chọn giờ
// import { DatePicker, TimePicker } from '@material-ui/lab';

// cài thêm thư viện "npm install @mui/lab"
// import AdapterDateFns from '@mui/lab/AdapterDateFns';
// import LocalizationProvider from '@mui/lab/LocalizationProvider';
// import { DatePicker } from '@mui/x-date-pickers';
// import TimePicker from '@mui/lab/TimePicker';

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAlert from "components/MDAlert";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// import { DatePicker, TimePicker } from '@mui/lab';
import { TextField, Button } from "@mui/material"

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addDays, setHours, setMinutes } from 'date-fns';




function Notifications() {
  //data alarm
  const [dataAlarm, setDataAlarm] = useState([]);
  // pick date time
  const [startDate, setStartDate] = useState( setHours(setMinutes(new Date(), 0), 0));
 
  const [endDate, setEndDate] = useState(new Date());

  const [successSB, setSuccessSB] = useState(false);
  const [infoSB, setInfoSB] = useState(false);
  const [warningSB, setWarningSB] = useState(false);
  const [errorSB, setErrorSB] = useState(false);

  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);
  const openInfoSB = () => setInfoSB(true);
  const closeInfoSB = () => setInfoSB(false);
  const openWarningSB = () => setWarningSB(true);
  const closeWarningSB = () => setWarningSB(false);
  const openErrorSB = () => setErrorSB(true);
  const closeErrorSB = () => setErrorSB(false);

  const alertContent = (name) => (
    <MDTypography variant="body2" color="white">
      A simple {name} alert with{" "}
      <MDTypography component="a" href="#" variant="body2" fontWeight="medium" color="white">
        an example link
      </MDTypography>
      . Give it a click if you like.
    </MDTypography>
  );

  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title="Material Dashboard"
      content="Hello, world! This is a notification message"
      dateTime="11 mins ago"
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite
    />
  );

  const renderInfoSB = (
    <MDSnackbar
      icon="notifications"
      title="Material Dashboard"
      content="Hello, world! This is a notification message"
      dateTime="11 mins ago"
      open={infoSB}
      onClose={closeInfoSB}
      close={closeInfoSB}
    />
  );

  const renderWarningSB = (
    <MDSnackbar
      color="warning"
      icon="star"
      title="Material Dashboard"
      content="Hello, world! This is a notification message"
      dateTime="11 mins ago"
      open={warningSB}
      onClose={closeWarningSB}
      close={closeWarningSB}
      bgWhite
    />
  );

  const renderErrorSB = (
    <MDSnackbar
      color="error"
      icon="warning"
      title="Material Dashboard"
      content="Hello, world! This is a notification message"
      dateTime="11 mins ago"
      open={errorSB}
      onClose={closeErrorSB}
      close={closeErrorSB}
      bgWhite
    />
  );

  // xử lí API 
  useEffect(() => {
    console.log("fetch nè con đũy")
    fetch('http://localhost:3005/api/data')
      .then(response => response.json())
      .then(data => {
        console.log(data);
        // Xử lý dữ liệu trả về ở đây
        setDataAlarm(data);

      })
      .catch(error => {
        console.error('Error:', error);
      });

  }, [])
  //nhấn nút để lấy dữ liệu
  const handleFindButtonClick = () => {
    console.log(`http://yourserver.com/data?startDate=${startDate}&endDate=${endDate}`)
    // gửi yêu cầu fetch dữ liệu từ server với startDate và endDate đã chọn
    fetch(`http://yourserver.com/data?startDate=${startDate}&endDate=${endDate}`)
      .then(response => response.json())
      .then(data => {
        // xử lý dữ liệu trả về từ server
        setDataAlarm(data);
      })
      .catch(error => {
        console.error('Error fetching data from server:', error);
      });
  }


  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Grid>
        con cho nhác

      </Grid>
      <MDBox mt={6} mb={3}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} lg={8}>
            <Card>
            {console.log("re-render",setHours(setMinutes(new Date(), 30), 20))}
              <Box p={2}>
                <Typography variant="h5">
                  From&nbsp;
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    maxDate={new Date()}
                    showTimeSelect
                    // maxTime={startDate.getDate() === new Date().getDate() ? setHours(setMinutes(new Date(), new Date().getMinutes()), new Date().getHours()) : null}

                  //  minTime={new Date()}
                      timeIntervals={15}
                    dateFormat="dd/MM/yyyy h:mm aa"
                  />
                  &nbsp;To&nbsp;
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    maxDate={new Date()}
                    minDate={startDate}
                    showTimeSelect
                    timeIntervals={15}
                    dateFormat="dd/MM/yyyy h:mm aa"
                  />
                   <Button variant="contained" color="inherit" onClick={handleFindButtonClick}>Find</Button>

                  {/* <TextField type="date" 
                  variant="outlined" 
                  dateFormat='DD/MM/yyy'
                  maxDate={new Date()}
                  value = {new Date()}/>
                  <TextField type="time" variant="outlined" />
                  &nbsp;To&nbsp;
                  <TextField type="date" variant="outlined" />
                  <TextField type="time" variant="outlined" />
                  &nbsp;
                  <Button variant="contained" color="primary">
                    Find
                  </Button> */}
                </Typography>
              </Box>
              <Table>
                <TableBody>
                  <TableCell align="center" ><Typography variant="h5">Type</Typography></TableCell>
                  <TableCell align="center" ><Typography variant="h5">Time</Typography></TableCell>
                  <TableCell align="center" ><Typography variant="h5">Name</Typography></TableCell>
                  <TableCell align="center" ><Typography variant="h5">Value</Typography></TableCell>
                  {dataAlarm.map((item) => (
                    <TableRow key={item.parameter.createdAt}>
                      <TableCell align="center" style={{ color: item.type === 'HI' || item.type === 'LO' ? '#FFCC00' : 'red' }}>{item.type}</TableCell>
                      <TableCell align="center" style={{ color: item.type === 'HI' || item.type === 'LO' ? '#FFCC00' : 'red' }}>{moment(item.parameter.createdAt).format('DD/MM/YYYY hh:mm A')}</TableCell>
                      <TableCell align="center" style={{ color: item.type === 'HI' || item.type === 'LO' ? '#FFCC00' : 'red' }}>{item.parameter.name}</TableCell>
                      <TableCell align="center" style={{ color: item.type === 'HI' || item.type === 'LO' ? '#FFCC00' : 'red' }}>{item.parameter.value}</TableCell>

                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </Grid>

          <Grid item xs={12} lg={8}>
            <Card>
              <MDBox p={2} lineHeight={0}>
                <MDTypography variant="h5">Notifications</MDTypography>
                <MDTypography variant="button" color="text" fontWeight="regular">
                  Notifications on this page use Toasts from Bootstrap. Read more details here.
                </MDTypography>
              </MDBox>
              <MDBox p={2}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} lg={3}>
                    <MDButton variant="gradient" color="success" onClick={openSuccessSB} fullWidth>
                      success notification
                    </MDButton>
                    {renderSuccessSB}
                  </Grid>
                  <Grid item xs={12} sm={6} lg={3}>
                    <MDButton variant="gradient" color="info" onClick={openInfoSB} fullWidth>
                      info notification
                    </MDButton>
                    {renderInfoSB}
                  </Grid>
                  <Grid item xs={12} sm={6} lg={3}>
                    <MDButton variant="gradient" color="warning" onClick={openWarningSB} fullWidth>
                      warning notification
                    </MDButton>
                    {renderWarningSB}
                  </Grid>
                  <Grid item xs={12} sm={6} lg={3}>
                    <MDButton variant="gradient" color="error" onClick={openErrorSB} fullWidth>
                      error notification
                    </MDButton>
                    {renderErrorSB}
                  </Grid>
                </Grid>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Notifications;
