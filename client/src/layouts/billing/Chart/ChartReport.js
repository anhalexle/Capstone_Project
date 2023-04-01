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
  console.log("cccccccccccccccccccccccccccccccccccccccc", data);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Mức tiêu thụ giờ thấp điểm năm hiện tại",
        backgroundColor: "rgb(75, 192, 192)",
        // eslint-disable-next-line react/prop-types
        data: data.data.result.map((data) => (data.ThisYear?.OffPeak ? data.ThisYear.OffPeak : 0)),
        borderColor: "white",
        type: "bar",
        stack: "Stack 0",
      },
      {
        label: "Mức tiêu thụ giờ bình thường năm hiện tại",
        backgroundColor: "rgb(53, 162, 235)",
        // data: data.chart.map((data) => data.ThisYear.normal),
        data: data.data.result.map((data) => (data.ThisYear?.Normal ? data.ThisYear.Normal : 0)),
        type: "bar",
        stack: "Stack 0",
      },
      {
        label: "Mức tiêu thụ giờ cao điểm năm hiện tại",
        backgroundColor: "red",
        // data: data.chart.map((data) => data.ThisYear.peak),
        data: data.data.result.map((data) => (data.ThisYear?.Peak ? data.ThisYear.Peak : 0)),
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
        data: data.data.result.map((data) => (data?.LastYear ? data.LastYear : 0)),
        type: "line",
      },
    ],
  };

  return (
    <div>

      <Bar data={chartData} options={options} />
    </div>
  );
}

export default ChartReport;
