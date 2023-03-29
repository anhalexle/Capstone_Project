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

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
//
import AppWidgetSummary from "./newWidget";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
// import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
// import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
// Data
// import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
// import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";
//
import Divider from "@mui/material/Divider";
// render dữ liệu nhận được từ server
import React, { useState, useEffect, useRef, useCallback } from "react";
/// real-time chart
// nhớ install "npm install recharts"
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
//  Provider
import { useContext } from "react";
// import { SocketContext } from "../../multiContext";
import useMultiContext from "useMultiContext";
//  ảnh
import imgPhase2 from "../../assets/images/MyProject/2phase.png";
import imgPhase3 from "../../assets/images/MyProject/3phase.png";
import imgA from "../../assets/images/MyProject/A.png";
import imgCosphi from "../../assets/images/MyProject/cosphi.png";
import imgDongdien from "../../assets/images/MyProject/dongdien.png";
import imgP from "../../assets/images/MyProject/P.png";
import imgTanso from "../../assets/images/MyProject/tanso.png";
//  toast
// import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import RealtimeChart from "../dashboard/real-timeChart";
import RealtimeChartCurrent from "./real-timeChartCurrent";

// import React from "react";
import { Line } from "react-chartjs-2";
import "chartjs-plugin-streaming";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";
import Icon from "@mui/material/Icon";

const arraydata_1 = Array(29).fill(0);

function Dashboard() {
  // const [arraydata_1, setArraydata_1] = useState(Array(29).fill(0));
   const [chartCurrent, setChartCurrent] = useState(false);
  const [chartVoltage, setChartVoltage] = useState(false);
  const [chartLineVoltage, setChartLineVoltage] = useState(false);
  const [chartFrequency, setChartFrequency] = useState(false);
  const [chartPF, setChartPF] = useState(false);
  const [chartA, setChartA] = useState(false);
  const [chartP, setChartP] = useState(false);
  const { socket, notificationsRef } = useMultiContext();
  const [dataPrint, setDataPrint] = useState({ data: arraydata_1, timestamp: Date.now() });

  const [showAllNotifications, setShowAllNotifications] = useState(false);

  // const [data, setData] = useState([]); // dữ liệu chart

  const intervalRef = useRef(null); // lưu trữ reference tới interval
  useEffect(() => {
    const handleServerData = (newData) => {
      // newData.flat().map((d) => {
      //   if (d.name === "Voltage_1") {
      //     arraydata_1[0] = d.value;
      //   } else if (d.name === "Voltage_2") {
      //     arraydata_1[1] = d.value;
      //   } else if (d.name === "Voltage_3") {
      //     arraydata_1[2] = d.value;
      //   } else if (d.name === "Volt_average") {
      //     arraydata_1[3] = d.value;
      //   } else if (d.name === "Line_V1_2") {
      //     arraydata_1[4] = d.value;
      //   } else if (d.name === "Line_V2_3") {
      //     arraydata_1[5] = d.value;
      //   } else if (d.name === "Line_V3_1") {
      //     arraydata_1[6] = d.value;
      //   } else if (d.name === "Line_Average") {
      //     arraydata_1[7] = d.value;
      //   } else if (d.name === "Current_1") {
      //     arraydata_1[8] = d.value;
      //   } else if (d.name === "Current_2") {
      //     arraydata_1[9] = d.value;
      //   } else if (d.name === "Current_3") {
      //     arraydata_1[10] = d.value;
      //   } else if (d.name === "Current_phase_N") {
      //     arraydata_1[11] = d.value;
      //   } else if (d.name === "Current_TB") {
      //     arraydata_1[12] = d.value;
      //   } else if (d.name === "f1") {
      //     arraydata_1[13] = d.value;
      //   } else if (d.name === "f2") {
      //     arraydata_1[14] = d.value;
      //   } else if (d.name === "f3") {
      //     arraydata_1[15] = d.value;
      //   } else if (d.name === "f_tb") {
      //     arraydata_1[16] = d.value;
      //   } else if (d.name === "pf1") {
      //     arraydata_1[17] = d.value;
      //   } else if (d.name === "pf2") {
      //     arraydata_1[18] = d.value;
      //   } else if (d.name === "pf3") {
      //     arraydata_1[19] = d.value;
      //   } else if (d.name === "pf_tb") {
      //     arraydata_1[20] = d.value;
      //   } else if (d.name === "integral_active_power_1") {
      //     arraydata_1[21] = d.value;
      //   } else if (d.name === "integral_active_power_2") {
      //     arraydata_1[22] = d.value;
      //   } else if (d.name === "integral_active_power_3") {
      //     arraydata_1[23] = d.value;
      //   } else if (d.name === "total_integral_active_power") {
      //     arraydata_1[24] = d.value;
      //   } else if (d.name === "instantaneous_active_power_1") {
      //     arraydata_1[25] = d.value;
      //   } else if (d.name === "instantaneous_active_power_2") {
      //     arraydata_1[26] = d.value;
      //   } else if (d.name === "instantaneous_active_power_3") {
      //     arraydata_1[27] = d.value;
      //   } else if (d.name === "total_instantaneous_active_power") {
      //     arraydata_1[28] = d.value;
      //   }
      // });
      newData.flat().map((d) => {
        switch(d.name) {
          case "Voltage_1":
            arraydata_1[0] = d.value;
            break;
          case "Voltage_2":
            arraydata_1[1] = d.value;
            break;
          case "Voltage_3":
            arraydata_1[2] = d.value;
            break;
          case "Volt_average":
            arraydata_1[3] = d.value;
            break;
          case "Line_V1_2":
            arraydata_1[4] = d.value;
            break;
          case "Line_V2_3":
            arraydata_1[5] = d.value;
            break;
          case "Line_V3_1":
            arraydata_1[6] = d.value;
            break;
          case "Line_Average":
            arraydata_1[7] = d.value;
            break;
          case "Current_1":
            arraydata_1[8] = d.value;
            break;
          case "Current_2":
            arraydata_1[9] = d.value;
            break;
          case "Current_3":
            arraydata_1[10] = d.value;
            break;
          case "Current_phase_N":
            arraydata_1[11] = d.value;
            break;
          case "Current_TB":
            arraydata_1[12] = d.value;
            break;
          case "f1":
            arraydata_1[13] = d.value;
            break;
          case "f2":
            arraydata_1[14] = d.value;
            break;
          case "f3":
            arraydata_1[15] = d.value;
            break;
          case "f_tb":
            arraydata_1[16] = d.value;
            break;
          case "pf1":
            arraydata_1[17] = d.value;
            break;
          case "pf2":
            arraydata_1[18] = d.value;
            break;
          case "pf3":
            arraydata_1[19] = d.value;
            break;
          case "pf_tb":
            arraydata_1[20] = d.value;
            break;
          case "integral_active_power_1":
            arraydata_1[21] = d.value;
            break;
          case "integral_active_power_2":
            arraydata_1[22] = d.value;
            break;
          case "integral_active_power_3":
            arraydata_1[23] = d.value;
            break;
          case "total_integral_active_power":
            arraydata_1[24] = d.value;
            break;
          case "instantaneous_active_power_1":
            arraydata_1[25] = d.value;
            break;
          case "instantaneous_active_power_2":
            arraydata_1[26] = d.value;
            break;
          case "instantaneous_active_power_3":
            arraydata_1[27] = d.value;
            break;
          case "total_instantaneous_active_power":
            arraydata_1[28] = d.value;
            break;
        }
      });
      setDataPrint((prevState) => ({ data: arraydata_1, timestamp: Date.now() }));
    };
    socket.emit("send-me-data");
    socket.on("send-all-data-client", handleServerData);
    socket.on("new-data-client", handleServerData);
    return () => {
      socket.off("new-data", handleServerData);
      clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar absolute />

      <MDBox py={5}>

{/* -----------------Current----------------- */}
          <Grid mb={1}>
          <Accordion style={{ borderRadius: "10px" }}>
            <AccordionSummary
              style={{ border: "3px solid #0077be", borderRadius: "7px" }}
              expandIcon={<ExpandMoreIcon />}
            >
              <Typography style={{ fontWeight: "bold", color: "#0077be" }}>CURRENT</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {/* //Voltage Phase */}
              {/* <Grid container spacing={3}> */}
                <Grid container spacing={3}>
                <Grid item xs={12} md={4} lg={4}>
                  <MDBox mb={1.5} mt={1.5}>
                    {/* Có thể dùng memo để render componet ComplexStatisticsCard */}
                    <AppWidgetSummary
                      title="CURRENT 1 (A)"
                      icon={imgDongdien}
                      color="error"
                      total={dataPrint.data[8]}
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} md={4} lg={4}>
                  <MDBox mb={1.5} mt={1.5}>
                    <AppWidgetSummary
                      title="CURRENT 2 (A)"
                      icon={imgDongdien}
                      color="warning"
                      total={dataPrint.data[9]}
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} md={4} lg={4}>
                  <MDBox mb={1.5} mt={1.5}>
                    <AppWidgetSummary
                      title="CURRENT 3 (A)"
                      icon={imgDongdien}
                      color="info"
                      total={dataPrint.data[10]}
                    />
                  </MDBox>
                </Grid>
                </Grid>


                <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={6}>
                  <MDBox mb={1.5} mt={1.5}>
                    <AppWidgetSummary
                      title="CURRENT PHASEN (A)"
                      icon={imgDongdien}
                      color="secondary"
                      total={dataPrint.data[11]}
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                  <MDBox mb={1.5} mt={1.5}>
                    <AppWidgetSummary
                      title="CURRENT AVERAGE (A)"
                      icon={imgDongdien}
                      color="secondary"
                      total={dataPrint.data[12]}
                    />
                  </MDBox>
                </Grid>
                </Grid>
              {/* </Grid> */}

              <Button
                sx={{
                  width: "100%",
                }}
                onClick={() => setChartCurrent(!chartCurrent)}
              >
                <Icon>{chartCurrent ? "expand_less" : "expand_more"}</Icon>
              </Button>
              {chartCurrent && (
                <Grid>
                  <RealtimeChartCurrent
                    data={[
                      dataPrint.data[8],
                      dataPrint.data[9],
                      dataPrint.data[10],
                      dataPrint.data[11],
                      dataPrint.data[12],
                    ]}
                    nameLine1="Current 1"
                    nameLine2="Current 2"
                    nameLine3="Current 3"
                    nameLine4="Current Phase"
                    // eslint-disable-next-line react/jsx-no-duplicate-props
                    nameLine5="Current Average"
                    title="Current (A)"
                  />
                </Grid>
              )}
            </AccordionDetails>
          </Accordion>
        </Grid>
        {/* ----------------------------------------------------------- */}

        {/* -----------------Voltage----------------- */}
        <Grid mb={1}>
          <Accordion style={{ borderRadius: "10px" }}>
            <AccordionSummary
              style={{ border: "3px solid #0077be", borderRadius: "7px" }}
              expandIcon={<ExpandMoreIcon />}
            >
              <Typography style={{ fontWeight: "bold", color: "#0077be" }}>VOLTAGE</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {/* //Voltage Phase */}
              <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={3}>
                  <MDBox mb={1.5} mt={1.5}>
                    {/* Có thể dùng memo để render componet ComplexStatisticsCard */}
                    <AppWidgetSummary
                      title="VOLTAGE 1 (V)"
                      icon={imgPhase3}
                      color="error"
                      total={dataPrint.data[0]}
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                  <MDBox mb={1.5} mt={1.5}>
                    <AppWidgetSummary
                      title="VOLTAGE 2 (V)"
                      icon={imgPhase3}
                      color="warning"
                      total={dataPrint.data[1]}
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                  <MDBox mb={1.5} mt={1.5}>
                    <AppWidgetSummary
                      title="VOLTAGE 3 (V)"
                      icon={imgPhase3}
                      color="info"
                      total={dataPrint.data[2]}
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                  <MDBox mb={1.5} mt={1.5}>
                    <AppWidgetSummary
                      title="VOLTAGE AVERAGE (V)"
                      icon={imgPhase3}
                      color="secondary"
                      total={dataPrint.data[3]}
                    />
                  </MDBox>
                </Grid>
              </Grid>

              <Button
                sx={{
                  width: "100%",
                }}
                onClick={() => setChartVoltage(!chartVoltage)}
              >
                <Icon>{chartVoltage ? "expand_less" : "expand_more"}</Icon>
              </Button>
              {chartVoltage && (
                <Grid>
                  <RealtimeChart
                    data={[
                      dataPrint.data[0],
                      dataPrint.data[1],
                      dataPrint.data[2],
                      dataPrint.data[3],
                    ]}
                    nameLine1="Voltage 1"
                    nameLine2="Voltage 2"
                    nameLine3="Voltage 3"
                    nameLine4="Voltage 4"
                    title="Voltage (v)"
                  />
                </Grid>
              )}
            </AccordionDetails>
          </Accordion>
        </Grid>
        {/* ----------------------------------------------------------- */}

        {/* -----------------Voltage Line----------------- */}
        <Grid mb={1}>
          <Accordion style={{ borderRadius: "10px" }}>
            <AccordionSummary
              style={{ border: "3px solid #0077be", borderRadius: "7px" }}
              expandIcon={<ExpandMoreIcon />}
            >
              <Typography style={{ fontWeight: "bold", color: "#0077be" }}>LINE VOLTAGE</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {/* //Voltage Phase */}
              <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={3}>
                  <MDBox mb={1.5} mt={1.5}>
                    {/* Có thể dùng memo để render componet ComplexStatisticsCard */}
                    <AppWidgetSummary
                      title="LINE VOLTAGE 1-2 (V)"
                      icon={imgPhase2}
                      color="error"
                      total={dataPrint.data[4]}
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                  <MDBox mb={1.5} mt={1.5}>
                    <AppWidgetSummary
                      title="LINE VOLTAGE 2-3 (V)"
                      icon={imgPhase2}
                      color="warning"
                      total={dataPrint.data[5]}
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                  <MDBox mb={1.5} mt={1.5}>
                    <AppWidgetSummary
                      title="LINE VOLTAGE 3-1 (V)"
                      icon={imgPhase2}
                      color="info"
                      total={dataPrint.data[6]}
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                  <MDBox mb={1.5} mt={1.5}>
                    <AppWidgetSummary
                      title="LINE VOLTAGE AVERAGE (V)"
                      icon={imgPhase2}
                      color="secondary"
                      total={dataPrint.data[7]}
                    />
                  </MDBox>
                </Grid>
              </Grid>
              <Button
                sx={{
                  width: "100%",
                }}
                onClick={() => setChartLineVoltage(!chartLineVoltage)}
              >
                <Icon>{chartLineVoltage ? "expand_less" : "expand_more"}</Icon>
              </Button>
              {chartLineVoltage && (
                <Grid>
                  <RealtimeChart
                    data={[
                      dataPrint.data[4],
                      dataPrint.data[5],
                      dataPrint.data[6],
                      dataPrint.data[7],
                    ]}
                    nameLine1="Line Voltage 1"
                    nameLine2="Line Voltage 2"
                    nameLine3="Line Voltage 3"
                    nameLine4="Line Voltage 4"
                    title="Line Voltage (v)"
                  />
                </Grid>
              )}
            </AccordionDetails>
          </Accordion>
        </Grid>
        {/* ----------------------------------------------------------- */}

        {/* -----------------FREQUENCY ----------------- */}
        <Grid mb={1}>
          <Accordion style={{ borderRadius: "10px" }}>
            <AccordionSummary
              style={{ border: "3px solid #0077be", borderRadius: "7px" }}
              expandIcon={<ExpandMoreIcon />}
            >
              <Typography style={{ fontWeight: "bold", color: "#0077be" }}>FREQUENCY</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {/* //Voltage Phase */}
              <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={3}>
                  <MDBox mb={1.5} mt={1.5}>
                    {/* Có thể dùng memo để render componet ComplexStatisticsCard */}
                    <AppWidgetSummary
                      title="FREQUENCY 1 (V)"
                      icon={imgTanso}
                      color="error"
                      total={dataPrint.data[13]}
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                  <MDBox mb={1.5} mt={1.5}>
                    <AppWidgetSummary
                      title="FREQUENCY  2 (V)"
                      icon={imgTanso}
                      color="warning"
                      total={dataPrint.data[14]}
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                  <MDBox mb={1.5} mt={1.5}>
                    <AppWidgetSummary
                      title="FREQUENCY  3 (V)"
                      icon={imgTanso}
                      color="info"
                      total={dataPrint.data[15]}
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                  <MDBox mb={1.5} mt={1.5}>
                    <AppWidgetSummary
                      title="FREQUENCY AVERAGE (V)"
                      icon={imgTanso}
                      color="secondary"
                      total={dataPrint.data[16]}
                    />
                  </MDBox>
                </Grid>
              </Grid>
              <Button
                sx={{
                  width: "100%",
                }}
                onClick={() => setChartFrequency(!chartFrequency)}
              >
                <Icon>{chartFrequency ? "expand_less" : "expand_more"}</Icon>
              </Button>
              {chartFrequency && (
                <Grid>
                  <RealtimeChart
                    data={[
                      dataPrint.data[13],
                      dataPrint.data[14],
                      dataPrint.data[15],
                      dataPrint.data[16],
                    ]}
                    nameLine1="Frequency 1"
                    nameLine2="Frequency 2"
                    nameLine3="Frequency 3"
                    nameLine4="Frequency 4"
                    title="Frequency (Hz)"
                  />
                </Grid>
              )}
            </AccordionDetails>
          </Accordion>
        </Grid>
        {/* ----------------------------------------------------------- */}

        {/* -----------------PF ----------------- */}
        <Grid mb={1}>
          <Accordion style={{ borderRadius: "10px" }}>
            <AccordionSummary
              style={{ border: "3px solid #0077be", borderRadius: "7px" }}
              expandIcon={<ExpandMoreIcon />}
            >
              <Typography style={{ fontWeight: "bold", color: "#0077be" }}>PF</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {/* //Voltage Phase */}
              <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={3}>
                  <MDBox mb={1.5} mt={1.5}>
                    {/* Có thể dùng memo để render componet ComplexStatisticsCard */}
                    <AppWidgetSummary
                      title="PF 1"
                      icon={imgCosphi}
                      color="error"
                      total={dataPrint.data[17]}
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                  <MDBox mb={1.5} mt={1.5}>
                    <AppWidgetSummary
                      title="PF 2"
                      icon={imgCosphi}
                      color="warning"
                      total={dataPrint.data[18]}
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                  <MDBox mb={1.5} mt={1.5}>
                    <AppWidgetSummary
                      title="PF 3"
                      icon={imgCosphi}
                      color="info"
                      total={dataPrint.data[19]}
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                  <MDBox mb={1.5} mt={1.5}>
                    <AppWidgetSummary
                      title="PF AVERAGE (V)"
                      icon={imgCosphi}
                      color="secondary"
                      total={dataPrint.data[20]}
                    />
                  </MDBox>
                </Grid>
              </Grid>
              <Button
                sx={{
                  width: "100%",
                }}
                onClick={() => setChartPF(!chartPF)}
              >
                <Icon>{chartPF ? "expand_less" : "expand_more"}</Icon>
              </Button>
              {chartPF && (
                <Grid>
                  <RealtimeChart
                    data={[
                      dataPrint.data[17],
                      dataPrint.data[18],
                      dataPrint.data[19],
                      dataPrint.data[20],
                    ]}
                    nameLine1="PF 1"
                    nameLine2="PF 2"
                    nameLine3="PF 3"
                    nameLine4="PF 4"
                    title="PF"
                  />
                </Grid>
              )}
            </AccordionDetails>
          </Accordion>
        </Grid>
        {/* ----------------------------------------------------------- */}

        {/* -----------------INTEGRAL ACTIVE POWER ----------------- */}
        <Grid mb={1}>
          <Accordion style={{ borderRadius: "10px" }}>
            <AccordionSummary
              style={{ border: "3px solid #0077be", borderRadius: "7px" }}
              expandIcon={<ExpandMoreIcon />}
            >
              <Typography style={{ fontWeight: "bold", color: "#0077be" }}>
                INTEGRAL ACTIVE POWER
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {/* //Voltage Phase */}
              <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={3}>
                  <MDBox mb={1.5} mt={1.5}>
                    {/* Có thể dùng memo để render componet ComplexStatisticsCard */}
                    <AppWidgetSummary
                      title="INTEGRAL ACTIVE POWER 1 (kWh)"
                      icon={imgA}
                      color="error"
                      total={dataPrint.data[21]}
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                  <MDBox mb={1.5} mt={1.5}>
                    <AppWidgetSummary
                      title="INTEGRAL ACTIVE POWER 2 (kWh)"
                      icon={imgA}
                      color="warning"
                      total={dataPrint.data[22]}
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                  <MDBox mb={1.5} mt={1.5}>
                    <AppWidgetSummary
                      title="INTEGRAL ACTIVE POWER 3 (kWh)"
                      icon={imgA}
                      color="info"
                      total={dataPrint.data[23]}
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                  <MDBox mb={1.5} mt={1.5}>
                    <AppWidgetSummary
                      title="INTEGRAL ACTIVE POWER 4 (kWh)"
                      icon={imgA}
                      color="secondary"
                      total={dataPrint.data[24]}
                    />
                  </MDBox>
                </Grid>
              </Grid>
              <Button
                sx={{
                  width: "100%",
                }}
                onClick={() => setChartA(!chartA)}
              >
                <Icon>{chartA ? "expand_less" : "expand_more"}</Icon>
              </Button>
              {chartA && (
                <Grid>
                  <RealtimeChart
                    data={[
                      dataPrint.data[21],
                      dataPrint.data[22],
                      dataPrint.data[23],
                      dataPrint.data[24],
                    ]}
                    nameLine1="INTEGRAL ACTIVE POWER 1"
                    nameLine2="INTEGRAL ACTIVE POWER 2"
                    nameLine3="INTEGRAL ACTIVE POWER 3"
                    nameLine4="INTEGRAL ACTIVE POWER 4"
                    title="INTEGRAL ACTIVE POWER"
                  />
                </Grid>
              )}
            </AccordionDetails>
          </Accordion>
        </Grid>
        {/* ----------------------------------------------------------- */}
{/* -----------------INSTANTANEOUS ACTIVE POWER ----------------- */}
<Grid mb={1}>
          <Accordion style={{ borderRadius: "10px" }}>
            <AccordionSummary
              style={{ border: "3px solid #0077be", borderRadius: "7px" }}
              expandIcon={<ExpandMoreIcon />}
            >
              <Typography style={{ fontWeight: "bold", color: "#0077be" }}>
              INSTANTANEOUS ACTIVE POWER
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {/* //Voltage Phase */}
              <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={3}>
                  <MDBox mb={1.5} mt={1.5}>
                    {/* Có thể dùng memo để render componet ComplexStatisticsCard */}
                    <AppWidgetSummary
                      title="INSTANTANEOUS ACTIVE POWER  1 (kW)"
                      icon={imgP}
                      color="error"
                      total={dataPrint.data[25]}
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                  <MDBox mb={1.5} mt={1.5}>
                    <AppWidgetSummary
                      title="INSTANTANEOUS ACTIVE POWER  2 (kW)"
                      icon={imgP}
                      color="warning"
                      total={dataPrint.data[26]}
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                  <MDBox mb={1.5} mt={1.5}>
                    <AppWidgetSummary
                      title="INSTANTANEOUS ACTIVE POWER  3 (kW)"
                      icon={imgP}
                      color="info"
                      total={dataPrint.data[27]}
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                  <MDBox mb={1.5} mt={1.5}>
                    <AppWidgetSummary
                      title="INSTANTANEOUS ACTIVE POWER  AVERAGE (kW)"
                      icon={imgP}
                      color="secondary"
                      total={dataPrint.data[28]}
                    />
                  </MDBox>
                </Grid>
              </Grid>
              <Button
                sx={{
                  width: "100%",
                }}
                onClick={() => setChartP(!chartP)}
              >
                <Icon>{chartP ? "expand_less" : "expand_more"}</Icon>
              </Button>
              {chartP && (
                <Grid>
                  <RealtimeChart
                    data={[
                      dataPrint.data[25],
                      dataPrint.data[26],
                      dataPrint.data[27],
                      dataPrint.data[28],
                    ]}
                    nameLine1="INSTANTANEOUS ACTIVE POWER 1"
                    nameLine2="INSTANTANEOUS ACTIVE POWER 2"
                    nameLine3="INSTANTANEOUS ACTIVE POWER 3"
                    nameLine4="INSTANTANEOUS ACTIVE POWER 4"
                    title="INSTANTANEOUS ACTIVE POWER"
                  />
                </Grid>
              )}
            </AccordionDetails>
          </Accordion>
        </Grid>
        {/* ----------------------------------------------------------- */}

        {/* //Voltage Phase */}

       
        {/* <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5} mt={1.5}>
              <ComplexStatisticsCard
                color="warning"
                icon_img={imgPhase2}
                title="LINE VOLTAGE 1-2 (V)"
                count={dataPrint.data[4]}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5} mt={1.5}>
              <ComplexStatisticsCard
                icon_img={imgPhase2}
                title="LINE VOLTAGE 2-3 (V)"
                count={dataPrint.data[5]}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5} mt={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon_img={imgPhase2}
                title="LINE VOLTAGE 3-1 (V)"
                count={dataPrint.data[6]}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5} mt={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon_img={imgPhase2}
                title="LINE VOLTAGE AVERAGE (V)"
                count={dataPrint.data[7]}
              />
            </MDBox>
          </Grid>
        </Grid>
        <Divider /> */}

        {/* //Dòng điện */}
        {/* <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={2.2}>
            <MDBox mb={1.5} mt={1.5}>
              <ComplexStatisticsCard
                color="warning"
                icon_img={imgDongdien}
                title="CURRENT 1 (A)"
                count={dataPrint.data[8]}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={2.2}>
            <MDBox mb={1.5} mt={1.5}>
              <ComplexStatisticsCard
                icon_img={imgDongdien}
                title="CURRENT 2 (A)"
                count={dataPrint.data[9]}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={2.2}>
            <MDBox mb={1.5} mt={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon_img={imgDongdien}
                title="CURRENT 3 (A)"
                count={dataPrint.data[10]}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={2.7}>
            <MDBox mb={1.5} mt={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon_img={imgDongdien}
                title="CURRENT PHASEN (A)"
                count={dataPrint.data[11]}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={2.7}>
            <MDBox mb={1.5} mt={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon_img={imgDongdien}
                title="CURRENT AVERAGE (A)"
                count={dataPrint.data[12]}
              />
            </MDBox>
          </Grid>
        </Grid>
        <Divider /> */}

        {/* Tần số */}
        {/* <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5} mt={1.5}>
              <ComplexStatisticsCard
                color="warning"
                icon_img={imgTanso}
                title="FREQUENCY 1 (Hz)"
                count={dataPrint.data[13]}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5} mt={1.5}>
              <ComplexStatisticsCard
                icon_img={imgTanso}
                title="FREQUENCY 2 (Hz)"
                count={dataPrint.data[14]}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5} mt={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon_img={imgTanso}
                title="FREQUENCY 3 (Hz)"
                count={dataPrint.data[15]}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5} mt={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon_img={imgTanso}
                title="FREQUENCY AVERAGE (Hz)"
                count={dataPrint.data[16]}
              />
            </MDBox>
          </Grid>
        </Grid>
        <Divider /> */}
        {/* Cosphi */}
        {/* <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5} mt={1.5}>
              <ComplexStatisticsCard
                color="warning"
                icon_img={imgCosphi}
                title="PF 1"
                count={dataPrint.data[17]}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5} mt={1.5}>
              <ComplexStatisticsCard icon_img={imgCosphi} title="PF 2" count={dataPrint.data[18]} />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5} mt={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon_img={imgCosphi}
                title="PF 3"
                count={dataPrint.data[19]}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5} mt={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon_img={imgCosphi}
                title="PF AVERAGE"
                count={dataPrint.data[20]}
              />
            </MDBox>
          </Grid>
        </Grid>
        <Divider /> */}
        {/* INTEGRAL ACTIVE POWER */}
        {/* <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5} mt={1.5}>
              <ComplexStatisticsCard
                color="warning"
                icon_img={imgA}
                title="INTEGRAL ACTIVE POWER 1 (kWh)"
                count={dataPrint.data[21]}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5} mt={1.5}>
              <ComplexStatisticsCard
                icon_img={imgA}
                title="INTEGRAL ACTIVE POWER 2 (kWh)"
                count={dataPrint.data[22]}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5} mt={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon_img={imgA}
                title="INTEGRAL ACTIVE POWER 3 (kWh)"
                count={dataPrint.data[23]}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5} mt={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon_img={imgA}
                title="INTEGRAL ACTIVE POWER AVERAGE (kWh)"
                count={dataPrint.data[24]}
              />
            </MDBox>
          </Grid>
        </Grid>
        <Divider /> */}
        {/* INSTANTANEOUS ACTIVE POWER */}
        {/* <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5} mt={1.5}>
              <ComplexStatisticsCard
                color="warning"
                icon_img={imgP}
                title="INSTANTANEOUS ACTIVE POWER  1 (kW)"
                count={dataPrint.data[25]}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5} mt={1.5}>
              <ComplexStatisticsCard
                icon_img={imgP}
                title="INSTANTANEOUS ACTIVE POWER  2 (kW)"
                count={dataPrint.data[26]}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5} mt={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon_img={imgP}
                title="INSTANTANEOUS ACTIVE POWER  3 (kW)"
                count={dataPrint.data[27]}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5} mt={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon_img={imgP}
                title="INSTANTANEOUS ACTIVE POWER  AVERAGE (kW)"
                count={dataPrint.data[28]}
              />
            </MDBox>
          </Grid>
        </Grid> */}

        
        
      </MDBox>
    </DashboardLayout>
  );
}

export default Dashboard;
