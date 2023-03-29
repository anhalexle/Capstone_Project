/* eslint-disable react/prop-types */
import React from "react";

import { Bar } from "react-chartjs-2";
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

function ChartReport({ data }) {
  console.log("in trong chart report", data, legend);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Mức tiêu thụ giờ thấp điểm năm hiện tại",
        backgroundColor: "rgb(75, 192, 192)",
        // eslint-disable-next-line react/prop-types
        data: data.chart.map((data) => (data.ThisYear?.offPeak ? data.ThisYear.offPeak : 0)),

        borderColor: "white",
        type: "bar",
        stack: "Stack 0",
      },
      {
        label: "Mức tiêu thụ giờ bình thường năm hiện tại",
        backgroundColor: "rgb(53, 162, 235)",
        // data: data.chart.map((data) => data.ThisYear.normal),
        data: data.chart.map((data) => (data.ThisYear?.normal ? data.ThisYear.normal : 0)),
        type: "bar",
        stack: "Stack 0",
      },
      {
        label: "Mức tiêu thụ giờ cao điểm năm hiện tại",
        backgroundColor: "red",
        // data: data.chart.map((data) => data.ThisYear.peak),
        data: data.chart.map((data) => (data.ThisYear?.peak ? data.ThisYear.peak : 0)),
        type: "bar",
        stack: "Stack 0",
      },
      {
        label: "Mức tiêu thụ năm trước",
        borderColor: "rgb(255, 99, 132)",
        borderWidth: 2,
        fill: false,
        // eslint-disable-next-line react/prop-types
        // data: data.chart.map((data) => data.LastYearTotal),
        data: data.chart.map((data) => (data?.LastYearTotal ? data.LastYearTotal : 0)),
        type: "line",
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

export default ChartReport;
