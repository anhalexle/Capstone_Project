/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// Material Dashboard 2 React example components
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

function Unauthorized() {
  const navigate = useNavigate();
  return (
    <DashboardLayout>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          '& > :not(style)': {
            m: 1,
            width: '100%',
            height: 500,
          },
          align: 'center',
        }}
      >
        <Paper align="center">
          <Typography
            sx={{
              width: '100%',
              color: 'black',
            }}
            variant="h4"
            mt={20}
            mb={5}
          >
            Xin lỗi bạn không có quyền truy cập!!
          </Typography>
          <Button
            variant="contained"
            style={{ color: 'white' }}
            onClick={() => navigate('/', { replace: true })}
          >
            Trở về
          </Button>
        </Paper>
      </Box>
    </DashboardLayout>
  );
}

export default Unauthorized;
