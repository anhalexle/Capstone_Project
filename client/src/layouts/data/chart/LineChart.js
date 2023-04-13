import React, { useRef, useEffect, useState } from "react";
import ApexCharts from "apexcharts";
import ReactApexChart from "react-apexcharts";
import moment from "moment";
import Checkbox from "@mui/material/Checkbox";
import { Typography, Grid } from "@mui/material";

// eslint-disable-next-line react/prop-types
function LineChart({ data }) {
  console.log("------", data);

  const categories = [];
  const data_y = [];

  // eslint-disable-next-line react/prop-types
  const start = moment(data[0].createdAt);
  // eslint-disable-next-line react/prop-types
  const end = moment(data[data.length - 1].createdAt);

  for (let m = start; m <= end; m.add(15, "minutes")) {
    const currentCreatedAt = m.toISOString();
    let valueToAdd = null;

    for (let i = 0; i < data.length - 1; i++) {
      const current = moment(data[i].createdAt);
      const next = moment(data[i + 1].createdAt);

      if (current <= m && m < next) {
        valueToAdd = data[i].value;
        break;
      }
    }

    categories.push(m.format("YYYY-MM-DD HH:mm:ss"));
    data_y.push(valueToAdd);
  }

  console.log("chào 1", categories);
  console.log("chào 2", data_y);
  const [series, setSeries] = React.useState([
    {
      name: "Giờ thấp điểm",
      // eslint-disable-next-line react/prop-types
      // data: data
      //   .map((value) => [
      //     value.ThisYear?.OffPeak ? value.ThisYear.OffPeak : 0,
      //     value.LastYear?.OffPeak ? value.LastYear.OffPeak : 0,
      //   ])
      //   .flat(),
      data: data_y,
    },
  ]);
  const [options, setOptions] = React.useState({
    chart: {
      height: 350,
      type: "line",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 5,
      curve: "smooth",
    },
    grid: {
      row: {
        colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
        opacity: 0.5,
      },
    },
    xaxis: {
      categories: categories,
      tickAmount: 10,
    },
  });
  return (
    <div>
      {console.log("fsdfsdf", options)}
      <ReactApexChart options={options} series={series} type="line" height={500}></ReactApexChart>
    </div>
  );
}
export default LineChart;
