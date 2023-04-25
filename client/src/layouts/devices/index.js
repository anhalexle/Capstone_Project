// @mui material components
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';

// Material Dashboard 2 React example components
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
// Data
import imgTanso from '../../assets/images/MyProject/tanso.png';
import ReactSpeedometer from 'react-d3-speedometer';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import useMultiContext from '../../useMultiContext';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Button } from '@mui/material';
import iconOn from '../../assets/images/iconOn.png';
import iconOff from '../../assets/images/iconOff.png';
import { styled } from '@mui/material/styles';
//sliderbar
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import MuiInput from '@mui/material/Input';
import VolumeUp from '@mui/icons-material/VolumeUp';
const Input = styled(MuiInput)`
  width: 42px;
`;
const PrettoSlider = styled(Slider)({
  color: '#52af77',
  height: 1,
  '& .MuiSlider-track': {
    // border: 'none',
    height: 10,
    backgroundColor: '#3366CC',
  },
  '& .MuiSlider-thumb': {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: 'inherit',
    },
    '&:before': {
      display: 'none',
    },
  },
  '& .MuiSlider-valueLabel': {
    lineHeight: 1.2,
    fontSize: 12,
    background: 'unset',
    padding: 0,
    width: 32,
    height: 32,
    borderRadius: '50% 50% 50% 0',
    backgroundColor: '#52af77',
    transformOrigin: 'bottom left',
    transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
    '&:before': { display: 'none' },
    '&.MuiSlider-valueLabelOpen': {
      transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
    },
    '& > *': {
      transform: 'rotate(45deg)',
    },
  },
  '& .MuiSlider-rail': {
    opacity: 0.5,
    backgroundColor: '#00FFFF',
  },
});

const arrayDataPrint = Array(7).fill(0);
function Devices() {
  const [dataPrint, setDataPrint] = useState({
    data: arrayDataPrint,
    timestamp: Date.now(),
  });
  console.log(arrayDataPrint);
  const { socket } = useMultiContext();
  const [frequency, setFrequency] = useState(dataPrint.data[4] / 100);
  useEffect(() => {
    const handleData = (data) => {
      console.log('djfhdakjhfdkjhf', data);
      arrayDataPrint[0] = data?.state ?? arrayDataPrint[0];
      arrayDataPrint[1] =
        data && data.runStatus !== undefined
          ? data.runStatus
          : arrayDataPrint[1];
      arrayDataPrint[2] = data?.reverseStatus ?? arrayDataPrint[2];
      arrayDataPrint[3] = data?.frequencyOutput ?? arrayDataPrint[3];
      arrayDataPrint[4] = data?.frequencySetting ?? arrayDataPrint[4];
      arrayDataPrint[5] = data?.volt ?? arrayDataPrint[5];
      arrayDataPrint[6] = data?.cur ?? arrayDataPrint[6];

      setDataPrint((prevState) => ({
        data: arrayDataPrint,
        timestamp: Date.now(),
      }));
    };
    socket.emit('sendState', true);
    socket.on('receiveState', handleData);
    socket.on('changeState', handleData);
    // socket.on("alarm", handleServerWarning);
    return () => {
      // socket.off("alarm", handleServerWarning);
      socket.off('receiveState');
      socket.emit('sendState', false);
      socket.off('changeState');
    };
  }, []);

  const handleChangeState = (event: SelectChangeEvent) => {
    console.log('chang nè', event.target.value);
    socket.emit('changeState', event.target.value);
    // setAge(event.target.value as string);
  };
  const handleBlur = () => {
    if (frequency < 0) {
      setFrequency(0);
    } else if (frequency > 100) {
      setFrequency(100);
    }
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />

      <Box mt={5}>
        <FormControl fullWidth>
          <InputLabel color="secondary">Selection</InputLabel>
          <Select
            style={{ width: 300, height: 40 }}
            value={dataPrint.data[0]}
            label="Age"
            onChange={handleChangeState}
          >
            {/* <MenuItem value={0}>cc0</MenuItem> */}
            <MenuItem value={1}>Panel</MenuItem>
            {/* <MenuItem value={2}>cc2</MenuItem> */}
            {/* <MenuItem value={3}>cc3</MenuItem> */}
            {/* <MenuItem value={4}>cc4</MenuItem> */}
            {/* <MenuItem value={5}>cc5</MenuItem> */}
            <MenuItem value={6}>Communication</MenuItem>
            {/* <MenuItem value={7}>cc7</MenuItem> */}
          </Select>
        </FormControl>
      </Box>

      <Box mt={3}>
        <Grid
          container
          direction="column"
          justifyContent="flex-start"
          alignItems="center"
        >
          <Grid item style={{ height: 250 }}>
            <ReactSpeedometer
              sx={{ height: 100 }}
              maxValue={400}
              value={dataPrint.data[3] / 100}
              needleColor="red"
              startColor="green"
              segments={10}
              endColor="blue"
            />
          </Grid>
          <Grid item>
            <Typography id="input-slider" gutterBottom>
              Frequency: {frequency} (hz)
            </Typography>
            <PrettoSlider
              sx={{
                width: { xs: 300, sm: 500, md: 700 },
              }}
              value={frequency}
              max={400}
              onChange={(event: Event, newValue: number | number[]) => {
                socket.emit('frequency', newValue * 100);
                setFrequency(newValue);
              }}
            />
            {/* <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{
          width: { xs: 300, sm: 500, md: 700 },
        }}
      >
        <PrettoSlider
              value={frequency}
              onChange={(event: Event, newValue: number | number[]) => {
                socket.emit("frequency", newValue * 10);
                setFrequency(newValue);
                
              }}
              />
      </Box> */}
          </Grid>
        </Grid>
      </Box>

      <Box mt={5} pr="15%" pl="15%">
        <Box
          pb={3}
          style={{ backgroundColor: '#FFFFCC', borderRadius: '20px' }}
        >
          <Grid container spacing={2}>
            <Grid
              item
              container
              direction="column"
              justifyContent="center"
              alignItems="center"
              xs={12}
              md={6}
              lg={6}
            >
              <Grid>
                <Button
                  // style={{ width: 300, height: 40 }}
                  variant="contained"
                  style={{
                    color: 'white',
                    background: 'linear-gradient(to bottom, #757575, #BEBEBE)',
                    width: 200,
                    height: 50,
                  }}
                  onClick={() => {
                    socket.emit('run', true);
                  }}
                >
                  ON
                </Button>
              </Grid>
              <Grid mt={3}>
                <Button
                  variant="contained"
                  style={{
                    color: 'white',
                    background: 'linear-gradient(to bottom, #757575, #BEBEBE)',
                    width: 200,
                    height: 50,
                  }}
                  onClick={() => {
                    console.log('bắn off', false);
                    socket.emit('run', false);
                  }}
                >
                  OFF
                </Button>
              </Grid>
            </Grid>
            <Grid
              item
              container
              direction="column"
              justifyContent="flex-start"
              alignItems="center"
              xs={12}
              md={6}
              lg={6}
            >
              <Grid item>
                {dataPrint.data[1] ? (
                  <img style={{ width: 100, height: 100 }} src={iconOn}></img>
                ) : (
                  <img style={{ width: 100, height: 100 }} src={iconOff}></img>
                )}
              </Grid>
              <Grid item>Running</Grid>
            </Grid>
          </Grid>
        </Box>
      </Box>

      <Box mt={5} pr="15%" pl="15%">
        <Box
          pb={3}
          style={{ backgroundColor: '#FFFFCC', borderRadius: '20px' }}
        >
          <Grid container spacing={2}>
            <Grid
              item
              container
              direction="column"
              justifyContent="center"
              alignItems="center"
              md={6}
              lg={6}
            >
              <Grid>
                <Button
                  variant="contained"
                  style={{
                    color: 'white',
                    background: 'linear-gradient(to bottom, #757575, #BEBEBE)',
                    width: 200,
                    height: 50,
                  }}
                  onClick={() => {
                    socket.emit('reverse', true);
                  }}
                >
                  FORWARD
                </Button>
              </Grid>
              <Grid mt={3}>
                <Button
                  variant="contained"
                  style={{
                    color: 'white',
                    background: 'linear-gradient(to bottom, #757575, #BEBEBE)',
                    width: 200,
                    height: 50,
                  }}
                  onClick={() => {
                    console.log('bắn off', false);
                    socket.emit('reverse', false);
                  }}
                >
                  REVERSE
                </Button>
              </Grid>
            </Grid>
            <Grid
              item
              container
              direction="column"
              justifyContent="flex-start"
              alignItems="center"
              md={6}
              lg={6}
            >
              <Grid item>
                {dataPrint.data[2] ? (
                  <img style={{ width: 100, height: 100 }} src={iconOn}></img>
                ) : (
                  <img style={{ width: 100, height: 100 }} src={iconOff}></img>
                )}
              </Grid>
              <Grid item>Forward</Grid>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* <Box mt={3}>
        <Grid container>
          <Grid>
            <Button
              variant="contained"
              style={{
                color: 'white',
                background: 'linear-gradient(to bottom, #757575, #BEBEBE)',
              }}
              onClick={() => {
                socket.emit('reverse', true);
              }}
            >
              ON
            </Button>
          </Grid>
          <Grid>
            <Button
              variant="contained"
              style={{
                color: 'white',
                background: 'linear-gradient(to bottom, #757575, #BEBEBE)',
              }}
              onClick={() => {
                console.log('bắn off', false);
                socket.emit('reverse', false);
              }}
            >
              OFF
            </Button>
          </Grid>
        </Grid>
        <Grid container>
          Running{' '}
          {dataPrint.data[2] ? (
            <img src={iconOn}></img>
          ) : (
            <img src={iconOff}></img>
          )}
        </Grid>
      </Box> */}
    </DashboardLayout>
  );
}

export default Devices;
