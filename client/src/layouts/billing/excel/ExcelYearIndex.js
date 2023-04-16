import { CSVLink } from 'react-csv';
import { Button } from '@mui/material';

// eslint-disable-next-line react/prop-types
function ExcelYearIndex({ data, year }) {
  const headers = [
    { label: 'Tháng', key: 'Month' },
    { label: 'Năm', key: 'Year' },
    { label: 'Giờ Thấp Điểm (kWh)', key: 'OffPeak' },
    { label: 'Giờ Bình Thường (kWh)', key: 'Normal' },
    { label: 'Giờ Cao Điểm (kWh)', key: 'Peak' },
    { label: 'Tổng (kWh)', key: 'Total' },
  ];

  const dataFormatted = data
    // eslint-disable-next-line react/prop-types
    .map((item) => {
      return (
        item.ThisYear !== 0 && {
          Month: item.Month,
          Year: item.Year,
          OffPeak: item.ThisYear.OffPeak,
          Normal: item.ThisYear.Normal,
          Peak: item.ThisYear.Peak,
          Total:
            item.ThisYear.Peak + item.ThisYear.Normal + item.ThisYear.OffPeak,
        }
      );
    })
    .filter((item) => item !== false);

  return (
    <CSVLink
      data={dataFormatted}
      headers={headers}
      filename={`Chỉ số ${year}.csv`}
    >
      <Button variant="contained" style={{ color: 'white' }}>
        Xuất Excel
      </Button>
    </CSVLink>
  );
}

export default ExcelYearIndex;
