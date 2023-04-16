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

import { useEffect, useState } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';

//sửa lại thư viện
import {
  Grid,
  Card,
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Alert,
} from '@mui/material';
import moment from 'moment';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';

// Material Dashboard 2 React example components
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';

// import { DatePicker, TimePicker } from '@mui/lab';
import { TextField, Button } from '@mui/material';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { addDays, setHours, setMinutes } from 'date-fns';
import { API_URL } from '../../api/Api';

function Notifications() {
  //data alarm
  const [dataAlarm, setDataAlarm] = useState(null);
  // pick date time
  const [startDate, setStartDate] = useState(
    setHours(setMinutes(new Date(), 0), 0)
  );

  const [endDate, setEndDate] = useState(new Date());

  const handleFindButtonClick = () => {
    // gửi yêu cầu fetch dữ liệu từ server với startDate và endDate đã chọn
    console.log(
      '+++++++++++++++++++',
      `${API_URL}/api/v1/alarms/getSpecificAlarm?startDate=${startDate}&endDate=${endDate}`
    );
    fetch(
      `${API_URL}/api/v1/alarms/getSpecificAlarm?startDate=${startDate}&endDate=${endDate}`
    )
      .then((response) => response.json())
      // .then((data) => console.log(data))
      .then((data) => {
        // xử lý dữ liệu trả về từ server
        setDataAlarm(data.alarmFilter);
      })
      .catch((error) => {
        Alert('Error fetching data from server:', error);
      });
  };

  const handleExport = async () => {
    try {
      const response = await fetch(`${API_URL}/api/v1/data/exportExcel`, {
        method: 'GET',
        headers: {
          'Content-Type':
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          Authorization: 'Bearer token',
        },
      });

      const blob = await response.blob(); // get the blob data from response
      const url = window.URL.createObjectURL(blob); // create URL from blob
      const link = document.createElement('a'); // create anchor element
      link.href = url; // set URL as href attribute
      link.setAttribute('download', 'report.xlsx'); // set filename as download attribute
      document.body.appendChild(link); // append anchor element to body
      link.click(); // simulate click on anchor element to start download
      link.remove(); // remove anchor element after download
    } catch (error) {
      console.log(error); // handle error here
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mt={6} mb={3}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} lg={8}>
            <Card>
              {console.log(
                're-render',
                setHours(setMinutes(new Date(), 30), 20)
              )}
              <Box p={2}>
                <Grid align="center" mt={1} mb={3} container spacing={3}>
                  <Grid item xs={12} md={4} lg={4}>
                    <Grid>
                      <Typography>Ngày bắt đầu:</Typography>
                    </Grid>
                    <Grid>
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
                    </Grid>
                  </Grid>
                  {/* // */}
                  <Grid item xs={12} md={4} lg={4}>
                    <Grid>
                      <Typography>Ngày kết thúc:</Typography>
                    </Grid>
                    <Grid>
                      <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        maxDate={new Date()}
                        minDate={startDate}
                        showTimeSelect
                        timeIntervals={15}
                        dateFormat="dd/MM/yyyy h:mm aa"
                      />
                    </Grid>
                  </Grid>
                  {/* // */}
                  <Grid
                    item
                    xs={12}
                    md={4}
                    lg={4}
                    container
                    style={{ paddingTop: '40px' }}
                  >
                    <Grid item xs={12} md={12} lg={12}>
                      <Button
                        variant="contained"
                        style={{ color: 'white' }}
                        onClick={handleFindButtonClick}
                      >
                        Tra Cứu
                      </Button>
                    </Grid>
                    {dataAlarm && (
                      <Grid item xs={12} md={12} lg={12} mt={2}>
                        <Button
                          variant="contained"
                          style={{ color: 'white' }}
                          onClick={handleExport}
                        >
                          Xuất excel
                        </Button>
                      </Grid>
                    )}
                  </Grid>
                </Grid>

                {/* <Typography variant="h5">
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
                  <Button variant="contained" color="inherit" onClick={handleFindButtonClick}>
                    Find
                  </Button>
                  <Button variant="contained" color="inherit" onClick={handleExport}>
                    Export Excel
                  </Button>
                </Typography> */}
              </Box>
              {dataAlarm && (
                <Table>
                  <TableBody>
                    <TableCell align="center">
                      <Typography variant="h5">Type</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="h5">Time</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="h5">Name</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="h5">Value</Typography>
                    </TableCell>
                    {dataAlarm.map((item) => (
                      <TableRow key={item.parameter.createdAt}>
                        <TableCell
                          align="center"
                          style={{
                            color:
                              item.type === 'High' || item.type === 'Low'
                                ? '#FFCC00'
                                : 'red',
                          }}
                        >
                          {item.type}
                        </TableCell>
                        <TableCell
                          align="center"
                          style={{
                            color:
                              item.type === 'High' || item.type === 'Low'
                                ? '#FFCC00'
                                : 'red',
                          }}
                        >
                          {moment(item.parameter.createdAt).format(
                            'DD/MM/YYYY hh:mm A'
                          )}
                        </TableCell>
                        <TableCell
                          align="center"
                          style={{
                            color:
                              item.type === 'High' || item.type === 'Low'
                                ? '#FFCC00'
                                : 'red',
                          }}
                        >
                          {item.parameter.name}
                        </TableCell>
                        <TableCell
                          align="center"
                          style={{
                            color:
                              item.type === 'High' || item.type === 'Low'
                                ? '#FFCC00'
                                : 'red',
                          }}
                        >
                          {item.parameter.value}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Notifications;
