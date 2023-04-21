import React, { useRef, useEffect, useState } from 'react';
import ApexCharts from 'apexcharts';
import ReactApexChart from 'react-apexcharts';
import moment from 'moment';
import Checkbox from '@mui/material/Checkbox';
import { Typography, Grid } from '@mui/material';

// eslint-disable-next-line react/prop-types
function ChartYearIndex({ data, titleChart }) {
  // Tạo một ref cho biểu đồ
  // const dataRef = useRef(data);
  console.log('dfsdfsfsdf', titleChart);
  const [series, setSeries] = React.useState([
    {
      name: 'Giờ thấp điểm',
      // eslint-disable-next-line react/prop-types
      data: data
        .map((value) => [
          value.ThisYear?.OffPeak ? value.ThisYear.OffPeak : 0,
          value.LastYear?.OffPeak ? value.LastYear.OffPeak : 0,
        ])
        .flat(),
    },
    {
      name: 'Giờ bình thường',
      data: data
        .map((value) => [
          value.ThisYear?.Normal ? value.ThisYear.Normal : 0,
          value.LastYear?.Normal ? value.LastYear.Normal : 0,
        ])
        .flat(),
    },
    {
      name: 'Giờ cao điểm',
      data: data
        .map((value) => [
          value.ThisYear?.Peak ? value.ThisYear.Peak : 0,
          value.LastYear?.Peak ? value.LastYear.Peak : 0,
        ])
        .flat(),
    },
  ]);
  const [options, setOptions] = React.useState({
    chart: {
      id: 'ChartYearIndex',
      type: 'bar',
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
            position: 'bottom',
            offsetX: -10,
            offsetY: 0,
          },
        },
      },
    ],
    dataLabels: {
      enabled: false,
    },
    // plotOptions: {
    //   bar: {
    //     horizontal: false,
    //     borderRadius: 10,
    //     dataLabels: {
    //       total: {
    //         enabled: true,
    //         style: {
    //           fontSize: "13px",
    //           fontWeight: 900,
    //         },
    //       },
    //     },
    //   },
    // },
    xaxis: {
      categories: data.map((value) => [value.Year, value.Year - 1]).flat(),
      group: {
        style: {
          fontSize: '20px',
          fontWeight: '20px',
        },
        groups: data.map((value) => {
          return { title: `T${value.Month}`, cols: 2 };
        }),
      },
    },
    yaxis: {
      title: {
        text: `${titleChart}`,
      },
    },
    legend: {
      position: 'bottom',
      // offsetY: 40,
    },
    fill: {
      opacity: 1,
    },
  });
  return (
    <div>
      {console.log('fsdfsdf', options)}
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={500}
      ></ReactApexChart>
    </div>
  );
}
export default ChartYearIndex;
