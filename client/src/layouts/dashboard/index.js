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
  const [chartVoltage, setChartVoltage] = useState(false);
  const { socket, notificationsRef } = useMultiContext();
  const [dataPrint, setDataPrint] = useState({ data: arraydata_1, timestamp: Date.now() });

  const [showAllNotifications, setShowAllNotifications] = useState(false);

  // const [data, setData] = useState([]); // dữ liệu chart

  const intervalRef = useRef(null); // lưu trữ reference tới interval
  useEffect(() => {
    const handleServerData = (newData) => {
      newData.flat().map((d) => {
        if (d.name === "Voltage_1") {
          arraydata_1[0] = d.value;
        } else if (d.name === "Voltage_2") {
          arraydata_1[1] = d.value;
        } else if (d.name === "Voltage_3") {
          arraydata_1[2] = d.value;
        } else if (d.name === "Volt_average") {
          arraydata_1[3] = d.value;
        } else if (d.name === "Line_V1_2") {
          arraydata_1[4] = d.value;
        } else if (d.name === "Line_V2_3") {
          arraydata_1[5] = d.value;
        } else if (d.name === "Line_V3_1") {
          arraydata_1[6] = d.value;
        } else if (d.name === "Line_Average") {
          arraydata_1[7] = d.value;
        } else if (d.name === "Current_1") {
          arraydata_1[8] = d.value;
        } else if (d.name === "Current_2") {
          arraydata_1[9] = d.value;
        } else if (d.name === "Current_3") {
          arraydata_1[10] = d.value;
        } else if (d.name === "Current_phase_N") {
          arraydata_1[11] = d.value;
        } else if (d.name === "Current_TB") {
          arraydata_1[12] = d.value;
        } else if (d.name === "f1") {
          arraydata_1[13] = d.value;
        } else if (d.name === "f2") {
          arraydata_1[14] = d.value;
        } else if (d.name === "f3") {
          arraydata_1[15] = d.value;
        } else if (d.name === "f_tb") {
          arraydata_1[16] = d.value;
        } else if (d.name === "pf1") {
          arraydata_1[17] = d.value;
        } else if (d.name === "pf2") {
          arraydata_1[18] = d.value;
        } else if (d.name === "pf3") {
          arraydata_1[19] = d.value;
        } else if (d.name === "pf_tb") {
          arraydata_1[20] = d.value;
        } else if (d.name === "integral_active_power_1") {
          arraydata_1[21] = d.value;
        } else if (d.name === "integral_active_power_2") {
          arraydata_1[22] = d.value;
        } else if (d.name === "integral_active_power_3") {
          arraydata_1[23] = d.value;
        } else if (d.name === "total_integral_active_power") {
          arraydata_1[24] = d.value;
        } else if (d.name === "instantaneous_active_power_1") {
          arraydata_1[25] = d.value;
        } else if (d.name === "instantaneous_active_power_2") {
          arraydata_1[26] = d.value;
        } else if (d.name === "instantaneous_active_power_3") {
          arraydata_1[27] = d.value;
        } else if (d.name === "total_instantaneous_active_power") {
          arraydata_1[28] = d.value;
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
        <Accordion style={{ borderRadius: "10px" }}>
          <AccordionSummary
            style={{ border: "3px solid #0077be", borderRadius: "7px" }}
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
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
            {/* <Accordion
              // sx={{height: 50 }}
              style={{ borderRadius: "7px" }}
              expanded={chartVoltage}
              onChange={() => {
                setChartVoltage((prevState) => !prevState);
              }}
            >
              <AccordionSummary
                style={{ border: "1.5px solid #0077be", borderRadius: "7px" }}
                expandIcon={<ExpandMoreIcon />}
              >
                <Typography
                  sx={{
                    width: "100%",
                    flexShrink: 0,
                    fontStyle: "italic",
                    color: "black",
                  }}
                >
                  Real-time Chart
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {chartVoltage && (
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
                )}
              </AccordionDetails>
            </Accordion> */}

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
        {/* //Voltage Phase */}
        <Grid container spacing={3}>
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
        <Divider />

        {/* //Dòng điện */}
        <Grid container spacing={3}>
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
        <Divider />

        {/* Tần số */}
        <Grid container spacing={3}>
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
        <Divider />
        {/* Cosphi */}
        <Grid container spacing={3}>
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
        <Divider />
        {/* INTEGRAL ACTIVE POWER */}
        <Grid container spacing={3}>
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
        <Divider />
        {/* INSTANTANEOUS ACTIVE POWER */}
        <Grid container spacing={3}>
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
        </Grid>

        <div />
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
