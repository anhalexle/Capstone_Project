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
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
//  Provider
import { useContext } from "react";
import { SocketContext } from "../../SocketContext";
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

const arraydata_1 = Array(29).fill(0);

function Dashboard() {
  // const [arraydata_1, setArraydata_1] = useState(Array(29).fill(0));

  const { socket, notificationsRef, arraydata } = useContext(SocketContext);
  const [dataPrint, setDataPrint] = useState({ data: arraydata_1, timestamp: Date.now() });

  const [data, setData] = useState([]); // dữ liệu chart

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

      // real-time chart

      // setData((prevData) => {
      //   const timestamp = new Date().getTime(); // lấy thời gian hiện tại
      //   return [...prevData, { time: timestamp, value: newData }];
      // });
    };
    socket.emit("send-me-data");

    socket.on("send-all-data-client", handleServerData);
    socket.on("new-data-client", handleServerData);
    console.log("useEffect lần 1");
    return () => {
      socket.off("new-data", handleServerData);
      clearInterval(intervalRef.current);
    };
  }, []);

  // useEffect(() => {
  //   // thiết lập interval để update chart
  //   intervalRef.current = setInterval(() => {
  //     setData((prevData) => {
  //       const newTimestamp = new Date().getTime(); // lấy thời gian hiện tại
  //       // xoá dữ liệu cũ hơn 30 giây
  //       const filteredData = prevData.filter((d) => d.time >= newTimestamp - 30000);
  //       return filteredData;
  //     });
  //   }, 1000); // update chart mỗi giây
  // }, []);


  console.log("reder ngoài callback tới trước return");
  return (
    <DashboardLayout>
      {console.log("****************trong returen*******************")}
      <DashboardNavbar />
      <MDBox>
        <RealtimeChart />
      </MDBox>
      {/* <MDBox> ve real-time chart new

        <LineChart
          width={700}
          height={300}
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis
            dataKey="time"
            type="number"
            domain={["dataMin", "dataMax"]}
            tickCount={10}
            tickFormatter={(time) =>
              new Date(time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            }
            label={{ value: "Time", position: "insideBottomRight", offset: 0 }}
          />
          <YAxis
            dataKey="value"
            label={{ value: "Value", angle: -90, position: "insideLeft" }}
            domain={[150, 300]}
          />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip
            labelFormatter={(time) =>
              new Date(time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            }
          />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="#8884d8" />
        </LineChart>

      </MDBox> */}
      
      <MDBox py={5}>
        {/* //Voltage Phase */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5} mt={1.5}>
              {/* Có thể dùng memo để render componet ComplexStatisticsCard */}
              {console.log("giá trị voltage1", dataPrint[0])}
              <ComplexStatisticsCard
                color="warning"
                icon_img={imgPhase3}
                title="VOLTAGE 1 (V)"
                count={dataPrint.data[0]}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5} mt={1.5}>
              <ComplexStatisticsCard
                icon_img={imgPhase3}
                title="VOLTAGE 2 (V)"
                count={dataPrint.data[1]}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5} mt={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon_img={imgPhase3}
                title="VOLTAGE 3 (V)"
                count={dataPrint.data[2]}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5} mt={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon_img={imgPhase3}
                title="VOLTAGE AVERAGE (V)"
                count={dataPrint.data[3]}
              />
            </MDBox>
          </Grid>
        </Grid>
        <Divider />

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

        {/*         
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={1.5} mt={1.5}>
                <ReportsBarChart
                  color="info"
                  title="website views"
                  description="Last Campaign Performance"
                  date="campaign sent 2 days ago"
                  chart={reportsBarChartData}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={1.5} mt={1.5}>
                <ReportsLineChart
                  color="success"
                  title="daily sales"
                  description={
                    <>
                      (<strong>+15%</strong>) increase in today sales.
                    </>
                  }
                  date="updated 4 min ago"
                  chart={sales}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={1.5} mt={1.5}>
                <ReportsLineChart
                  color="dark"
                  title="completed tasks"
                  description="Last Campaign Performance"
                  date="just updated"
                  chart={tasks}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox> */}
        {/* <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              <Projects />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <OrdersOverview />
            </Grid>
          </Grid>
        </MDBox> */}
        <div />
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
