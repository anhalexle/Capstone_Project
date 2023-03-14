import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
// import useInterval from "@use-it/interval";

const RealTimeChart = () => {
  const [data, setData] = useState([{ time: Date.now(), value: 0 }]);
  const latestTime = data[data.length - 1].time;
  console.log("****************render-chart*****************");

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prevData) => [
        ...prevData,
        { time: Date.now(), value: Math.floor(220 + Math.random() * 3 - 1.5) },
      ]);
      if (data.length > 20) {
        setData((prevData) => prevData.slice(-20));
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <LineChart width={500} height={300} data={data}>
      <XAxis
        dataKey="time"
        type="number"
        // domain={["auto", "auto"]}
        domain={[latestTime - 15000, latestTime]} 
        // scale="time"
        tickCount={100}
        tickFormatter={(time) => new Date(time).toLocaleTimeString()}
      />
      <YAxis />
      <CartesianGrid strokeDasharray="3 3" />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
    </LineChart>
  );
};

export default RealTimeChart;
