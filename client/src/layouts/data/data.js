import { useState } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import BoxChart from "./components/BoxChart";
import IconButton from "@mui/material/IconButton";
import Icon from "@mui/material/Icon";
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

function Data() {
  // const [boxCharts, setBoxCharts] = useState([]);
  const [boxChartCount, setBoxChartCount] = useState(1);
  const [boxCharts, setBoxCharts] = useState([<BoxChart key={1} />]);

  const addBoxChart = () => {
    const newBoxChartCount = boxChartCount + 1;
    setBoxChartCount(newBoxChartCount);
    setBoxCharts((prevBoxCharts) => [...prevBoxCharts, <BoxChart key={newBoxChartCount} />]);
  };

  const removeBoxChart = (key) => {
    setBoxCharts((prevBoxCharts) => prevBoxCharts.filter((boxChart) => boxChart.key !== key));
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      {boxCharts.map((boxChart) => (
        <Box key={boxChart.key} style={{ background: "white", position: "relative" }}>
          {boxChart}
          <IconButton
            onClick={() => removeBoxChart(boxChart.key)}
            style={{
              position: "absolute",
              top: "0.1%",
              right: "0.1%",
            }}
          >
            <Icon>clear</Icon>
          </IconButton>
        </Box>
      ))}
      <IconButton onClick={addBoxChart}>
        <Icon>add</Icon>
      </IconButton>
    </DashboardLayout>
  );
}

export default Data;
