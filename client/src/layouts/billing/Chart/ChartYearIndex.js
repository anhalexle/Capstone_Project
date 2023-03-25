import React, { useRef, useEffect, useState } from "react";
import ApexCharts from "apexcharts";
import ReactApexChart from "react-apexcharts";
import moment from "moment";
import Checkbox from "@mui/material/Checkbox";
import { Typography, Grid } from "@mui/material";

// eslint-disable-next-line react/prop-types
function ChartYearIndex({ data }) {
  // Tạo một ref cho biểu đồ
  const dataRef = useRef(data);
  console.log("in data year trong chart", data, dataRef.current);
  const dataUpdateSeries = useRef([]);
  useEffect(() => {
    dataRef.current = data;
    console.log("in trong chart", dataRef.current);
    console.log(
      "mảng đỉnh",
      dataRef.current.map((value) => [value.ThisYear.Peak, value.LastYear.Peak]).flat()
    );
    console.log(
      "mảng đéo đỉnh",
      dataRef.current.map((value) => [value.ThisYear.OffPeak, value.LastYear.OffPeak]).flat()
    );
    console.log(
      "mảng bình thường",
      dataRef.current.map((value) => [value.ThisYear.Normal, value.LastYear.Normal]).flat()
    );
    console.log("mảng tháng", dataRef.current.map((value) => [value.Year, value.Year - 1]).flat());
    updateSeries();
  }, [data]);

  // Tạo các state cho series và options của biểu đồ
  // const [series, setSeries] = React.useState([
  //   {
  //     name: "sales",
  //     data: [
  //       {
  //         x: "2019/01/01",
  //         y: 400,
  //       },
  //       {
  //         x: "2019/04/01",
  //         y: 430,
  //       },
  //       {
  //         x: "2019/07/01",
  //         y: 448,
  //       },
  //       {
  //         x: "2019/10/01",
  //         y: 470,
  //       },
  //       {
  //         x: "2020/01/01",
  //         y: 540,
  //       },
  //       {
  //         x: "2020/04/01",
  //         y: 580,
  //       },
  //       {
  //         x: "2020/07/01",
  //         y: 690,
  //       },
  //       {
  //         x: "2020/10/01",
  //         y: 690,
  //       },
  //     ],
  //   },
  // ]);
  const [series, setSeries] = React.useState([]);
  const [options, setOptions] = React.useState({
    chart: {
      id: "ChartYearIndex",
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
    // xaxis: {
    //   // type: "datetime",
    //   categories: ["T1", "T2", "T3"],
    //   group: {
    //     style: {
    //       fontSize: "10px",
    //       fontWeight: 700,
    //     },
    //     groups: [
    //       { title: "T1", cols: 2 },
    //       { title: "T2", cols: 2 },
    //       { title: "T3", cols: 2 },
    //       { title: "T4", cols: 2 },
    //       { title: "T5", cols: 2 },
    //       { title: "T6", cols: 2 },
    //       { title: "T7", cols: 2 },
    //       { title: "T8", cols: 2 },
    //       { title: "T10", cols: 2 },
    //       { title: "T11", cols: 2 },
    //       { title: "T12", cols: 2 },
    //     ],
    //   },
    // },

    yaxis: {
      title: {
        text: "Điện Năng Tiêu Thụ KWH",
      },
    },
    legend: {
      position: "right",
      offsetY: 40,
    },
    fill: {
      opacity: 1,
    },
  });

  //   chart: {
  //     type: "bar",
  //     height: 380,
  //   },
  //   xaxis: {
  //     type: "category",
  //     labels: {
  //       formatter: function (val) {
  //         return "Q" + dayjs(val).quarter();
  //       },
  //     },
  //     group: {
  //       style: {
  //         fontSize: "10px",
  //         fontWeight: 700,
  //       },
  //       groups: [
  //         { title: "2019", cols: 4 },
  //         { title: "2020", cols: 4 },
  //       ],
  //     },
  //   },
  //   title: {
  //     text: "Grouped Labels on the X-axis",
  //   },
  //   tooltip: {
  //     x: {
  //       formatter: function (val) {
  //         return "Q" + dayjs(val).quarter() + " " + dayjs(val).format("YYYY");
  //       },
  //     },
  //   },
  // });

  const updateSeries = () => {
    ApexCharts.exec("ChartYearIndex", "updateSeries", [
      {
        name: "Giờ thấp điểm",
        data: dataRef.current
          .map((value) => [value.ThisYear.OffPeak, value.LastYear.OffPeak])
          .flat(),
      },
      {
        name: "Giờ bình thường",
        data: dataRef.current.map((value) => [value.ThisYear.Normal, value.LastYear.Normal]).flat(),
      },
      {
        name: "Giờ cao điểm",
        data: dataRef.current.map((value) => [value.ThisYear.Peak, value.LastYear.Peak]).flat(),
      },
    ]);
    ApexCharts.exec("ChartYearIndex", "updateOptions", {
      xaxis: {
        categories: dataRef.current.map((value) => [value.Year, value.Year - 1]).flat(),
        group: {
          style: {
            fontSize: "20px",
            fontWeight: 700,
          },
          groups: dataRef.current.map((value) => {
            return { title: `T${value.Month}`, cols: 2 };
          }),
        },
      },
    });
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
export default ChartYearIndex;
