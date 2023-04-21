import { CSVLink } from 'react-csv';
import { Button } from '@mui/material';
import moment from 'moment';
// eslint-disable-next-line react/prop-types
function ExcelData({ data, name }) {
  console.log(`data ${data}`);
  const headers = [
    { label: 'Tên', key: 'Name' },
    { label: 'Thời gian', key: 'Time' },
    { label: 'Giá trị', key: 'Value' },
  ];

  const dataFormatted = data
    // eslint-disable-next-line react/prop-types
    .map((item) => {
      return {
        Name: name,
        Time: moment(item.createdAt).format('DD/MM/YYYY hh:mm A'),
        Value: item.value,
      };
    });

  return (
    <CSVLink
      data={dataFormatted}
      headers={headers}
      filename={`Data ${name}.csv`}
    >
      <Button variant="contained" style={{ color: 'white' }}>
        Xuất Excel
      </Button>
    </CSVLink>
  );
}

export default ExcelData;
