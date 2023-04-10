/* eslint-disable react/prop-types */
import React from "react";

import { Bar } from "react-chartjs-2";
import ChartYearIndex from "./ChartYearIndex";
// import ChartDataLabels from "chartjs-plugin-datalabels";

const labels = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

const options = {
  plugins: {
    legend: {
      position: "bottom",
    },
  },
  datalabels: {
    color: "white",
    display: true,
  },
  responsive: true,
  // plugins: [ChartDataLabels],
};

const legend = {
  display: true,
  position: "bottom",
  labels: {
    fontSize: 14,
  },
};

function ChartYearIndexNew({ data }) {
  console.log("in trong chart new", data, legend);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Mức tiêu thụ giờ thấp điểm năm hiện tại",
        backgroundColor: "rgb(75, 192, 192)",
        // eslint-disable-next-line react/prop-types
        // data: data.chart.map((data) => (data.ThisYear?.offPeak ? data.ThisYear.offPeak : 0)),
        data: data.map((data) => (data.ThisYear?.OffPeak ? data.ThisYear.OffPeak : 0)),
        borderColor: "white",
        type: "bar",
        stack: "Stack 0",
      },
      {
        label: "Mức tiêu thụ giờ bình thường năm hiện tại",
        backgroundColor: "rgb(53, 162, 235)",
        // data: data.chart.map((data) => data.ThisYear.normal),
        data: data.map((data) => (data.ThisYear?.Normal ? data.ThisYear.Normal : 0)),
        type: "bar",
        stack: "Stack 0",
      },
      {
        label: "Mức tiêu thụ giờ cao điểm năm hiện tại",
        backgroundColor: "red",
        // data: data.chart.map((data) => data.ThisYear.peak),
        data: data.map((data) => (data.ThisYear?.Peak ? data.ThisYear.Peak : 0)),
        type: "bar",
        stack: "Stack 0",
      },
      {
        label: "Mức tiêu thụ giờ thấp điểm năm hiện tại",
        backgroundColor: "rgb(75, 192, 192)",
        // eslint-disable-next-line react/prop-types
        // data: data.chart.map((data) => (data.ThisYear?.offPeak ? data.ThisYear.offPeak : 0)),
        data: data.map((data) => (data.LastYear?.OffPeak ? data.LastYear.OffPeak : 0)),
        borderColor: "white",
        type: "bar",
        stack: "Stack 1",
      },
      {
        label: "Mức tiêu thụ giờ bình thường năm hiện tại",
        backgroundColor: "rgb(53, 162, 235)",
        // data: data.chart.map((data) => data.ThisYear.normal),
        data: data.map((data) => (data.LastYear?.Normal ? data.LastYear.Normal : 0)),
        type: "bar",
        stack: "Stack 1",
      },
      {
        label: "Mức tiêu thụ giờ cao điểm năm hiện tại",
        backgroundColor: "red",
        // data: data.chart.map((data) => data.ThisYear.peak),
        data: data.map((data) => (data.LastYear?.Peak ? data.LastYear.Peak : 0)),
        type: "bar",
        stack: "Stack 1",
      },
    ],
  };

  return (
    <div>
      {console.log("return", data, legend)}
      <Bar data={chartData} options={options} />
    </div>
  );
}

export default ChartYearIndexNew;
