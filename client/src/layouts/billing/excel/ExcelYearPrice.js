import { CSVLink } from 'react-csv';
import { Button } from '@mui/material';

function ExcelYearPrice({ data, year }) {
  console.log('execPrice', data);

  const headers = [
    { label: 'Tháng', key: 'Month' },
    { label: 'Năm', key: 'Year' },
    { label: 'Giờ Thấp Điểm (VNĐ)', key: 'OffPeak' },
    { label: 'Giờ Bình Thường (VNĐ)', key: 'Normal' },
    { label: 'Giờ Cao Điểm (VNĐ)', key: 'Peak' },
    { label: 'Tổng (VNĐ)', key: 'Total' },
  ];

  const dataFormatted = data
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
      filename={`Tiền điện ${year}.csv`}
    >
      <Button variant="contained" style={{ color: 'white' }}>
        Xuất Excel
      </Button>
    </CSVLink>
  );
}

export default ExcelYearPrice;
