// @mui material components
import * as React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { addDays, setHours, setMinutes } from 'date-fns';
import LineChart from '../chart/LineChart';
import TableData from '../components/Table';
import ExcelData from '../components/ExcelData';

import Typography from '@mui/material/Typography';
import { API_URL } from '../../../api/Api';
function BoxChart() {
  // eslint-disable-next-line react/jsx-filename-extension

  const [startDate, setStartDate] = React.useState(
    setHours(setMinutes(new Date(), 0), 0)
  );
  const [endDate, setEndDate] = React.useState(new Date());
  // const [all, setAll] = React.useState(false);
  const [type, setType] = React.useState('');
  const [typeSpecific, setTypeSpecific] = React.useState('');
  const [typeSpecificTable, setTypeSpecificTable] = React.useState('');
  const [data, setData] = React.useState(null);
  // console.log("type", key);
  const typeList = [
    'VOLTAGE',
    'LINE VOLTAGE',
    'CURRENT',
    'FREQUENCY',
    'PF',
    'INTEGRAL ACTIVE POWER',
    'INSTANTANEOUS ACTIVE POWER',
  ];
  const voltageList = ['Voltage_1', 'Voltage_2', 'Voltage_3', 'Volt_average'];
  const lineVoltageList = [
    'Line_V1_2',
    'Line_V2_3',
    'Line_V3_1',
    'Line_Average',
  ];
  const currentList = [
    'Current_1',
    'Current_2',
    'Current_3',
    'Current_phase_N',
    'Current_TB',
  ];
  const frequencyList = ['f1', 'f2', 'f3', 'f_tb'];
  const PFList = ['pf1', 'pf2', 'pf3', 'pf_tb'];
  const integralList = [
    'integral_active_power_1',
    'integral_active_power_2',
    'integral_active_power_3',
    'total_integral_active_power',
  ];
  const instantaneousList = [
    'instantaneous_active_power_1',
    'instantaneous_active_power_2',
    'instantaneous_active_power_3',
    'total_instantaneous_active_power',
  ];

  async function onHandleSubmit() {
    const request = {
      startDate,
      endDate,
      name: typeSpecific,
    };
    console.log(request);
    console.log(`${API_URL}/api/v1/data/drawChart`);

    const response = await fetch(`${API_URL}/api/v1/data/drawChart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('data mới nhận nè', data);
      console.log('Trừ thử', data.data[1].createdAt - data.data[0].createdAt);
      setTypeSpecificTable(typeSpecific);
      setData(data.data);
      // setData(data);
    } else {
      console.log('Error occurred while fetching data');
    }
  }

  return (
    <Box>
      {/* <div>{key}</div> */}
      <Grid align="center" mt={1} mb={3} container spacing={3}>
        <Grid item xs={12} md={6} lg={6}>
          <FormControl>
            <InputLabel color="secondary">Type</InputLabel>
            <Select
              style={{ width: 300, height: 40 }}
              value={type}
              label="Type"
              onChange={(event) => {
                setType(event.target.value);
              }}
            >
              {typeList.map((item, index) => (
                <MenuItem key={index} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          {/* <Button variant="contained" style={{ color: "white" }} onClick={() => setAll(!all)}>
          {all ? "All" : "No All"}
        </Button> */}
          <FormControl>
            <InputLabel color="secondary">Unit</InputLabel>
            <Select
              style={{ width: 300, height: 40 }}
              value={typeSpecific}
              label="Unit"
              onChange={(event) => {
                setTypeSpecific(event.target.value);
              }}
            >
              {type === 'VOLTAGE' &&
                voltageList.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              {type === 'LINE VOLTAGE' &&
                lineVoltageList.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              {type === 'CURRENT' &&
                currentList.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              {type === 'FREQUENCY' &&
                frequencyList.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              {type === 'PF' &&
                PFList.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              {type === 'INTEGRAL ACTIVE POWER' &&
                integralList.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              {type === 'INSTANTANEOUS ACTIVE POWER' &&
                instantaneousList.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
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
          spacing={3}
        >
          <Grid item xs={12} md={6} lg={6}>
            <Button
              variant="contained"
              style={{ color: 'white' }}
              onClick={onHandleSubmit}
            >
              Tra Cứu
            </Button>
          </Grid>
          {data && (
            <Grid item xs={12} md={6} lg={6}>
              <ExcelData data={data} name={typeSpecificTable}></ExcelData>
            </Grid>
          )}
        </Grid>
      </Grid>
      {/* <Grid>{data && <LineChart data={data}></LineChart>}</Grid> */}
      <Grid>
        {data && (
          <Box padding={3}>
            <TableData data={data} name={typeSpecificTable}></TableData>
          </Box>
        )}
      </Grid>
      <Grid></Grid>
    </Box>
  );
}

export default BoxChart;
