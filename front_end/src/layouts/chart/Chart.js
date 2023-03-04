import React from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import { useLoaderData } from "react-router-dom";
import datasets from "../../MOCK_DATA.json";
import Form from "./Form";

function Chart() {
  const dataChart = useLoaderData();
  const char = {
    labels: dataChart.map((e) => e.createdAt.day),
    datasets: {
      label: "Voltage",
      data: datasets.map((data) => data.value),
    },
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={5}>
        <Form />
      </MDBox>
      <MDBox py={5}>
        <MDBox mb={1.5} mt={4.5}>
          <ReportsLineChart
            color="success"
            title="Voltage Report in February"
            description={<>This chart describe the amount of Volatge has been used in February</>}
            date={new Date(3, 13, 2023).toUTCString}
            chart={char}
          />
        </MDBox>
      </MDBox>
    </DashboardLayout>
  );
}

export default Chart;
