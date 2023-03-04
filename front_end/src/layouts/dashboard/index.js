/* eslint-disable camelcase */
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
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// ảnh
import Divider from "@mui/material/Divider";
import imgPhase_2 from "../../assets/images/MyProject/2phase.png";
import imgPhase_3 from "../../assets/images/MyProject/3phase.png";
import imgA from "../../assets/images/MyProject/A.png";
import imgCosphi from "../../assets/images/MyProject/cosphi.png";
import imgDongdien from "../../assets/images/MyProject/dongdien.png";
import imgP from "../../assets/images/MyProject/P.png";
import imgTanso from "../../assets/images/MyProject/tanso.png";

//
function Dashboard() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={5}>
        {/* //Voltage Phase */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5} mt={1.5}>
              <ComplexStatisticsCard
                color="warning"
                icon_img={imgPhase_3}
                title="VOLTAGE 1 (V)"
                count={281}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5} mt={1.5}>
              <ComplexStatisticsCard icon_img={imgPhase_3} title="VOLTAGE 2 (V)" count="2,300" />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5} mt={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon_img={imgPhase_3}
                title="VOLTAGE 3 (V)"
                count="34k"
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5} mt={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon_img={imgPhase_3}
                title="VOLTAGE AVERAGE (V)"
                count="+91"
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
                icon_img={imgPhase_2}
                title="LINE VOLTAGE 1-2 (V)"
                count={281}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5} mt={1.5}>
              <ComplexStatisticsCard
                icon_img={imgPhase_2}
                title="LINE VOLTAGE 2-3 (V)"
                count="2,300"
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5} mt={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon_img={imgPhase_2}
                title="LINE VOLTAGE 3-1 (V)"
                count="0"
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5} mt={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon_img={imgPhase_2}
                title="LINE VOLTAGE AVERAGE (V)"
                count="+91"
              />
            </MDBox>
          </Grid>
        </Grid>
        <Divider />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={2.2}>
            <MDBox mb={1.5} mt={1.5}>
              <ComplexStatisticsCard
                color="warning"
                icon_img={imgDongdien}
                title="CURRENT 1 (A)"
                count={281}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={2.2}>
            <MDBox mb={1.5} mt={1.5}>
              <ComplexStatisticsCard icon_img={imgDongdien} title="CURRENT 2 (A)" count="2,300" />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={2.2}>
            <MDBox mb={1.5} mt={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon_img={imgDongdien}
                title="CURRENT 3 (A)"
                count="34k"
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={2.7}>
            <MDBox mb={1.5} mt={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon_img={imgDongdien}
                title="CURRENT PHASEN (A)"
                count="+91"
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={2.7}>
            <MDBox mb={1.5} mt={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon_img={imgDongdien}
                title="CURRENT AVERAGE (A)"
                count="+91"
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
                count={281}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5} mt={1.5}>
              <ComplexStatisticsCard icon_img={imgTanso} title="FREQUENCY 2 (Hz)" count="2,300" />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5} mt={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon_img={imgTanso}
                title="FREQUENCY 3 (Hz)"
                count="34k"
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5} mt={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon_img={imgTanso}
                title="FREQUENCY AVERAGE (Hz)"
                count="+91"
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
                count={281}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5} mt={1.5}>
              <ComplexStatisticsCard icon_img={imgCosphi} title="PF 2" count="2,300" />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5} mt={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon_img={imgCosphi}
                title="PF 3"
                count="34k"
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5} mt={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon_img={imgCosphi}
                title="PF AVERAGE"
                count="+91"
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
                count={281}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5} mt={1.5}>
              <ComplexStatisticsCard
                icon_img={imgA}
                title="INTEGRAL ACTIVE POWER 2 (kWh)"
                count="2,300"
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5} mt={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon_img={imgA}
                title="INTEGRAL ACTIVE POWER 3 (kWh)"
                count="34k"
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5} mt={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon_img={imgA}
                title="INTEGRAL ACTIVE POWER AVERAGE (kWh)"
                count="+91"
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
                count={281}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5} mt={1.5}>
              <ComplexStatisticsCard
                icon_img={imgP}
                title="INSTANTANEOUS ACTIVE POWER  2 (kW)"
                count="2,300"
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5} mt={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon_img={imgP}
                title="INSTANTANEOUS ACTIVE POWER  3 (kW)"
                count="34k"
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5} mt={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon_img={imgP}
                title="INSTANTANEOUS ACTIVE POWER  AVERAGE (kW)"
                count="+91"
              />
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>

      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;