// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
// Data
import imgTanso from "../../assets/images/MyProject/tanso.png";
import ReactSpeedometer from "react-d3-speedometer";
import React, { useState, useEffect, useRef, useCallback } from "react";
import useMultiContext from "../../useMultiContext";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Button } from "@mui/material";
import iconOn from "../../assets/images/iconOn.png";
import iconOff from "../../assets/images/iconOff.png";
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
  const [dataPrint, setDataPrint] = useState({ data: arrayDataPrint, timestamp: Date.now() });
  console.log(arrayDataPrint);
  const { socket } = useMultiContext();
  const [frequency, setFrequency] = useState(dataPrint.data[4]);

  useEffect(() => {
    const handleData = (data) => {
      console.log("djfhdakjhfdkjhf",data)
      arrayDataPrint[0] = data?.state ?? arrayDataPrint[0];
      arrayDataPrint[1] = (data && data.runStatus !== undefined) ? data.runStatus : arrayDataPrint[1];
      arrayDataPrint[2] = data?.reverseStatus ?? arrayDataPrint[2];
      arrayDataPrint[3] = data?.frequencyOutput ?? arrayDataPrint[3];
      arrayDataPrint[4] = data?.frequencySetting ?? arrayDataPrint[4];
      arrayDataPrint[5] = data?.volt ?? arrayDataPrint[5];
      arrayDataPrint[6] = data?.cur ?? arrayDataPrint[6];
      
      setDataPrint((prevState) => ({ data: arrayDataPrint, timestamp: Date.now() }));
    };
    socket.emit("/sendState");
    socket.on("/receiveState", handleData);
    socket.on("/updateState", handleData);
    // socket.on("alarm", handleServerWarning);
    return () => {
      // socket.off("alarm", handleServerWarning);
      socket.off("/receiveState");
      socket.off("/updateState");
    };
  }, []);

  const handleChangeState = (event: SelectChangeEvent) => {
    console.log("chang nè", event.target.value);
    socket.emit("changeState", event.target.value); 	
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
        <Box mt={3} display="flex" justifyContent="center" alignItems="center"  >
        <ReactSpeedometer
        sx = {{height: 250}}
          maxValue={200}
          value={dataPrint.data[3]}
          needleColor="red"
          startColor="green"
          segments={10}
          endColor="blue" />
        </Box>
        <Typography id="input-slider" gutterBottom>
            Frequency
          </Typography>
        <Box display="flex" justifyContent="center" alignItems="center"
          sx={{ 
            width: {xs:300, sm:500, md: 700} }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <VolumeUp />
            </Grid>
            <Grid item xs>
              <PrettoSlider
                value={frequency}
                onChange={(event: Event, newValue: number | number[]) => {
                  setFrequency(newValue);
                } } />
            </Grid>
            <Grid item>
              <Input
                value={frequency}
                // size="small"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setFrequency(event.target.value === '' ? '' : Number(event.target.value));
                } }
                onBlur={handleBlur}
                inputProps={{
                  step: 3,
                  min: 0,
                  max: 200,
                  type: 'number',
                  'aria-labelledby': 'input-slider',
                }} />
            </Grid>
          </Grid>
        </Box>


        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel>Run command selection</InputLabel>
            <Select
              value={dataPrint.data[0]}
              label="Age"
              onChange={handleChangeState}
            >
              <MenuItem value={0}>cc1</MenuItem>
              <MenuItem value={1}>cc1</MenuItem>
              <MenuItem value={2}>cc2</MenuItem>
              <MenuItem value={3}>cc3</MenuItem>
              <MenuItem value={4}>cc4</MenuItem>
              <MenuItem value={5}>cc5</MenuItem>
              <MenuItem value={6}>cc6</MenuItem>
              <MenuItem value={7}>cc7</MenuItem>
            </Select>
          </FormControl>
        </Box>


        <Box>
          <Grid container>
            <Grid>
              <Button
                variant="contained"
                style={{ color: "white" }}
                onClick={() => {
                  socket.emit("run", true);
                } }
              >
                ON
              </Button>
            </Grid>
            <Grid>
              <Button
                variant="contained"
                style={{ color: "white", background: "linear-gradient(to bottom, #757575, #BEBEBE)", }}
                onClick={() => {
                  console.log("bắn off", false);
                  socket.emit("run", false);
                } }
              >
                OFF
              </Button>
            </Grid>
          </Grid>
          <Grid container>
            Forward {dataPrint.data[1] ? <img src={iconOn}></img> : <img src={iconOff}></img>}
          </Grid>
        </Box>

        <Box>
          <Grid container>
            <Grid>
              <Button
                variant="contained"
                style={{ color: "white", background: "linear-gradient(to bottom, #757575, #BEBEBE)" }}
                onClick={() => {
                  socket.emit("reverse", true);
                } }
              >
                ON
              </Button>
            </Grid>
            <Grid>
              <Button
                variant="contained"
                style={{ color: "white", background: "linear-gradient(to bottom, #757575, #BEBEBE)", }}
                onClick={() => {
                  console.log("bắn off", false);
                  socket.emit("reverse", false);
                } }
              >
                OFF
              </Button>
            </Grid>
          </Grid>
          <Grid container>
            Running {dataPrint.data[2] ? <img src={iconOn}></img> : <img src={iconOff}></img>}
          </Grid>
        </Box>
      </DashboardLayout>
  );
}

export default Devices;
