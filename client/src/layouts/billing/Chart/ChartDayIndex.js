import React, { useRef, useEffect, useState } from "react";
import ApexCharts from "apexcharts";
import ReactApexChart from "react-apexcharts";
import moment from "moment";
import Checkbox from "@mui/material/Checkbox";
import { Typography, Grid } from "@mui/material";

// eslint-disable-next-line react/prop-types
function ChartDayIndex({ data }) {
  // Tạo một ref cho biểu đồ
  const dataRef = useRef(data);
  console.log("in trong chart 1", data, dataRef.current);
  const dataUpdateSeries = useRef([]);
  useEffect(() => {
    dataRef.current = data;
    console.log("in trong chart", dataRef.current);
    updateSeries();
  }, [data]);

  // Tạo các state cho series và options của biểu đồ
  const [series, setSeries] = React.useState([]);

  const [options, setOptions] = React.useState({
    chart: {
      id: "ChartDayIndex",
      type: "bar",
      height: 350,
      stacked: true,
      toolbar: {
        show: true,
      },
      zoom: {
        enabled: true,
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: "bottom",
            offsetX: -10,
            offsetY: 0,
          },
        },
      },
    ],
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 10,
        dataLabels: {
          total: {
            enabled: true,
            style: {
              fontSize: "13px",
              fontWeight: 900,
            },
          },
        },
      },
    },
    xaxis: {},
    yaxis: {
      title: {
        text: "Điện Năng Tiêu Thụ KWH",
      },
    },
    legend: {
      position: "top",
      // offsetY: 40,
    },
    fill: {
      opacity: 1,
    },
  });
  const updateSeries = () => {
    console.log(
      "in trong update",
      dataRef.current.map((value) => value.OffPeak)
    );
    ApexCharts.exec("ChartDayIndex", "updateSeries", [
      {
        name: "Giờ thấp điểm",
        data: dataRef.current.map((value) => value.OffPeak),
        // color: "#FFFF00", // Màu sắc đường thẳng 1
      },
      {
        name: "Giờ bình thường",
        data: dataRef.current.map((value) => value.Normal),
        // color: "#00FF00", // Màu sắc đường thẳng 2
      },
      {
        name: "Giờ cao điểm",
        data: dataRef.current.map((value) => value.Peak),
        // color: "#FF0000", // Màu sắc đường thẳng 2
      },
    ]);
    ApexCharts.exec(
      "ChartDayIndex",
      "updateOptions",
      {
        xaxis: {
          categories: dataRef.current.map((value) => value.Date),
        },
      },
      false,
      false
    );
  };

  // Sử dụng useEffect để gọi hàm updateSeries sau khi component được render lần đầu tiên và sau mỗi giây
  // useEffect(() => {
  //   updateSeries();
  // }, []);

  return (
    <div>
      <ReactApexChart options={options} series={series} type="bar" height={500}></ReactApexChart>
    </div>
  );
}
export default ChartDayIndex;
