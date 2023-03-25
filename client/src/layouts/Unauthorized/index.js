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

import { useEffect, useState } from "react";
import axios from "axios";
import { saveAs } from "file-saver";

import {
  Grid,
  Card,
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Alert,
} from "@mui/material";
import moment from "moment";
//thêm thư viện chọn ngày chọn giờ
// import { DatePicker, TimePicker } from '@material-ui/lab';

// cài thêm thư viện "npm install @mui/lab"
// import AdapterDateFns from '@mui/lab/AdapterDateFns';
// import LocalizationProvider from '@mui/lab/LocalizationProvider';
// import { DatePicker } from '@mui/x-date-pickers';
// import TimePicker from '@mui/lab/TimePicker';

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAlert from "components/MDAlert";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// import { DatePicker, TimePicker } from '@mui/lab';
import { TextField, Button } from "@mui/material";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addDays, setHours, setMinutes } from "date-fns";

function Unauthorized() {
  return (
    <DashboardLayout>
      <div>Bạn không có quyền truy cập</div>
    </DashboardLayout>
  );
}

export default Unauthorized;
