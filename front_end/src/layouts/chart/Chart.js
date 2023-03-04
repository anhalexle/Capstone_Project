import React, { useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import datasets from "../../MOCK_DATA.json";
import Form from "./Form";

function Chart() {
  const [dataChart, setDataChart] = useState();
  console.log(dataChart);
  const char = dataChart
    ? {
      labels: dataChart.map((e) => new Date(e.createdAt).getDay()),
      datasets: {
        label: "Voltage",
        data: dataChart.map((data) => data.value),
      },
    }
    : null;

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={5}>
        <Form setData={setDataChart} />
      </MDBox>
      <MDBox py={5}>
        <MDBox mb={1.5} mt={4.5}>
          {char && (
            <ReportsLineChart
              color="success"
              title="Voltage Report in February"
              description={<>This chart describe the amount of Volatge has been used in February</>}
              date={new Date(3, 13, 2023).toUTCString}
              chart={char}
            />
          )}
        </MDBox>
      </MDBox>
    </DashboardLayout>
  );
}

export default Chart;
