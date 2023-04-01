import { CSVLink } from "react-csv";
import { Button } from "@mui/material";

// eslint-disable-next-line react/prop-types
function ExcelDayIndex({ data, year }) {
  console.log(`data ${data}`);
  const headers = [
    { label: "Thời gian", key: "Date" },
    { label: "Giờ Thấp Điểm (kWh)", key: "OffPeak" },
    { label: "Giờ Bình Thường (kWh)", key: "Normal" },
    { label: "Giờ Cao Điểm (kWh)", key: "Peak" },
    { label: "Tổng (kWh)", key: "Total" },
  ];

  const dataFormatted = data
    // eslint-disable-next-line react/prop-types
    .map((item) => {
      return (
        item.ThisYear !== 0 && {
          Date: item.Date,
          OffPeak: item.OffPeak,
          Normal: item.Normal,
          Peak: item.Peak,
          Total: item.Peak + item.Normal + item.OffPeak,
        }
      );
    })
    .filter((item) => item !== false);

  return (
    <CSVLink data={dataFormatted} headers={headers} filename={`Sản lượng tiêu thụ trong ngày.csv`}>
      <Button variant="contained" style={{ color: "white" }}>
        Xuất Excel
      </Button>
    </CSVLink>
  );
}

export default ExcelDayIndex;
