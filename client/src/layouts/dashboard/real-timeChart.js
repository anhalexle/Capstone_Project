import React, { useRef, useEffect, useState } from "react";
import ApexCharts from "apexcharts";
import ReactApexChart from "react-apexcharts";
import moment from "moment";
import Checkbox from "@mui/material/Checkbox";
import { Typography, Grid } from "@mui/material";

// eslint-disable-next-line react/prop-types
function RealtimeChart({ data, nameLine1, nameLine2, nameLine3, nameLine4, title }) {
  const [line1, setLine1] = useState(true);
  const [line2, setLine2] = useState(true);
  const [line3, setLine3] = useState(true);
  const [line4, setLine4] = useState(true);
  // Tạo một ref cho biểu đồ
  console.log("------vào------", data);
  const lineRef = useRef([line1, line2, line3, line4]);
  const nameRef = useRef([nameLine1, nameLine2, nameLine3, nameLine4, title]);
  console.log("------name------", nameRef.current);
  const dataRef = useRef(null);
  const dataUpdateSeries = useRef([]);
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  // Tạo các state cho series và options của biểu đồ
  const [series, setSeries] = React.useState([]);

  const [options, setOptions] = React.useState({
    chart: {
      id: "realtime",
      animations: {
        enabled: true,
        easing: "linear",
        dynamicAnimation: {
          speed: 1000,
        },
      },
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    markers: {
      size: 0,
    },
    xaxis: {
      categories: [],
      tickAmount: 6,
    },
    yaxis: {
      title: {
        text: nameRef.current[4],
      },
    },
    legend: {
      show: false,
    },
    grid: {
      borderColor: "#e7e7e7",
      row: {
        colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
        opacity: 0.5,
      },
    },
  });
  // Tạo một hàm để cập nhật series bằng hàm ApexCharts.exec
  const updateSeries = () => {
    // Thêm một phần tử mới vào cuối mảng với giá trị ngẫu nhiên và thời gian hiện tại
    dataUpdateSeries.current.push({
      x: moment(Date.now()).format("hh:mm:ss"),
      y_1: dataRef.current[0],
      y_2: dataRef.current[1],
      y_3: dataRef.current[2],
      y_4: dataRef.current[3],
    });
    console.log("current data", dataUpdateSeries.current);
    // Xóa phần tử đầu tiên của mảng nếu quá dài
    if (dataUpdateSeries.current.length > 50) {
      dataUpdateSeries.current.shift();
    }
    // Gọi hàm ApexCharts.exec với ref của biểu đồ và dữ liệu mới
    ApexCharts.exec(
      "realtime",
      "updateSeries",
      [
        lineRef.current[0]
          ? {
              name: nameRef.current[0],
              data: dataUpdateSeries.current.map((value) => value.y_1),
              color: "#FF0000", // Màu sắc đường thẳng 1
            }
          : null,
        lineRef.current[1]
          ? {
              name: nameRef.current[1],
              data: dataUpdateSeries.current.map((value) => value.y_2),
              color: "#FB8C00", // Màu sắc đường thẳng 2
            }
          : null,
        lineRef.current[2]
          ? {
              name: nameRef.current[2],
              data: dataUpdateSeries.current.map((value) => value.y_3),
              color: "#1A73E8", // Màu sắc đường thẳng 3
            }
          : null,
        lineRef.current[3]
          ? {
              name: nameRef.current[3],
              data: dataUpdateSeries.current.map((value) => value.y_4),
              color: "#495361", // Màu sắc đường thẳng 4
            }
          : null,
      ].filter(Boolean)
    );
    ApexCharts.exec(
      "realtime",
      "updateOptions",
      {
        xaxis: {
          categories: dataUpdateSeries.current.map((value) => value.x),
          tickAmount: 6,
        },
        animations: {
          enabled: true,
          easing: "linear",
          dynamicAnimation: {
            speed: 1000,
          },
        },
      },
      false,
      false
    );
  };

  // Sử dụng useEffect để gọi hàm updateSeries sau khi component được render lần đầu tiên và sau mỗi giây
  useEffect(() => {
    updateSeries();
    const interval = setInterval(() => {
      updateSeries();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <Grid container>
        <Grid
          item
          xs={3}
          sm={3}
          md={3}
          lg={3}
          xl={3}
          style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
        >
          <Checkbox
            checked={line1}
            onChange={() => {
              lineRef.current[0] = !line1;
              setLine1((prevState) => !prevState);
            }}
          ></Checkbox>
          <Typography
            style={{ textDecoration: line1 ? "" : "line-through" }}
            color="error"
            variant="h6"
          >
            {nameRef.current[0]}
          </Typography>
        </Grid>
        <Grid
          item
          xs={3}
          sm={3}
          md={3}
          lg={3}
          xl={3}
          style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
        >
          <Checkbox
            size="small"
            checked={line2}
            onChange={() => {
              lineRef.current[1] = !line2;
              setLine2((prevState) => !prevState);
            }}
          ></Checkbox>
          <Typography
            style={{ textDecoration: line2 ? "" : "line-through", color: "#FB8C00" }}
            variant="h6"
          >
            {nameRef.current[1]}
          </Typography>
        </Grid>
        <Grid
          item
          xs={3}
          sm={3}
          md={3}
          lg={3}
          xl={3}
          style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
        >
          <Checkbox
            size="small"
            checked={line3}
            onChange={() => {
              lineRef.current[2] = !line3;
              setLine3((prevState) => !prevState);
            }}
          ></Checkbox>
          <Typography
            style={{ textDecoration: line3 ? "" : "line-through", color: "#1A73E8" }}
            variant="h6"
          >
            {nameRef.current[2]}
          </Typography>
        </Grid>
        <Grid
          item
          xs={3}
          sm={3}
          md={3}
          lg={3}
          xl={3}
          style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
        >
          <Checkbox
            size="small"
            checked={line4}
            onChange={() => {
              lineRef.current[3] = !line4;
              setLine4((prevState) => !prevState);
            }}
          ></Checkbox>
          <Typography
            style={{ textDecoration: line4 ? "" : "line-through", color: "#495361" }}
            variant="h6"
          >
            {nameRef.current[3]}
          </Typography>
        </Grid>
      </Grid>
      <ReactApexChart options={options} series={series} type="line" height={500}></ReactApexChart>
    </div>
  );
}
export default RealtimeChart;
