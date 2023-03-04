/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-plusplus */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable default-case */
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import "./Form.css";
import Api from "api/Api";
import dataName from "../../parameters.json";

export async function onHandleSubmit(data) {
  const request = {
    date: {
      day: data.day,
      month: data.month,
      year: data.year,
    },
    name: data.type,
  };
  const res = await Api.post("/api/v1/data/drawChart", request);
  console.log(res);

  return res.data;
}

function Form() {
  const type = dataName.map((e) => ({
    id: e.id,
    name: e.name,
  }));

  const timeUnit = ["", "Day", "Month", "Year"];
  const [timeSelect, setTimeSelect] = useState({
    date: [],
    month: [],
    year: [],
    active: { day: false, month: false, year: false },
  });

  const { register, handleSubmit } = useForm();

  function handleChange(e) {
    const dataType = e.target.value;
    const active = { day: false, month: false, year: false };
    const dataDay = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
      27, 28, 29, 30,
    ];
    const dataMonth = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const dataYear = [];
    for (let i = 2019; i < 2030; i++) {
      dataYear.push(i);
    }
    switch (dataType) {
      case "day": {
        active.day = true;
        active.month = true;
        active.year = true;
        break;
      }
      case "month": {
        active.day = false;
        active.month = true;
        active.year = true;
        break;
      }
      case "year": {
        active.day = false;
        active.month = false;
        active.year = true;
        break;
      }
    }
    setTimeSelect({
      day: dataDay,
      month: dataMonth,
      year: dataYear,
      active,
    });
  }

  return (
    <>
      <h1>Please choose the data you want to display</h1>
      <form onSubmit={handleSubmit(onHandleSubmit)}>
        <div className="form-container">
          Data Type
          <select {...register("type")}>
            {type.map((e) => (
              <option value={e.id}>{e.name}</option>
            ))}
          </select>
        </div>
        <div className="form-container">
          Time Unit
          <select {...register("unit")} onChange={handleChange}>
            {timeUnit.map((e) => (
              <option value={e.toLowerCase()}>{e}</option>
            ))}
          </select>
        </div>
        {timeSelect.active.year && (
          <div className="form-container">
            Choose the specific year
            <select {...register("year")}>
              {timeSelect.year.map((e) => (
                <option>{e}</option>
              ))}
            </select>
          </div>
        )}
        {timeSelect.active.month && (
          <div className="form-container">
            Choose the specific month
            <select {...register("month")}>
              {timeSelect.month.map((e) => (
                <option>{e}</option>
              ))}
            </select>
          </div>
        )}
        {timeSelect.active.day && (
          <div className="form-container">
            Choose the specific day
            <select {...register("day")}>
              {timeSelect.day.map((e) => (
                <option>{e}</option>
              ))}
            </select>
          </div>
        )}
        <input type="submit" />
      </form>
    </>
  );
}

export default Form;
