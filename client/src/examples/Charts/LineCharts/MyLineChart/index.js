import React from 'react';
import { Line } from 'react-chartjs-2';
// import { Chart as ChartJS } from "chart.js/auto";

function LineChart() {
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'My First Dataset',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };
  return (
    <div>
      <Line data={data} />
    </div>
  );
}
export default LineChart;
