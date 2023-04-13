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

import { useState, useEffect } from "react";
import axios from "axios";

// react-router-dom components
import { Link, useNavigate } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
import { Alert } from "@mui/material";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/Truong_BK_CS1.jpg";

import useMultiContext from "../../../useMultiContext";

function Basic() {
  const [rememberMe, setRememberMe] = useState(false);
  const { auth ,setAuth } = useMultiContext();
  const handleSetRememberMe = () => setRememberMe(!rememberMe);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // xử lí hiện thị ra thông báo khi đăng nhập sai
  const [errorMessage, setErrorMessage] = useState("");
  //khi chuyển sang trang log-in thì xóa localStorage
  localStorage.removeItem("token");

  const handleSignIn = async () => {
    try {
      const response = await axios.post("http://localhost:3001/api/v1/users/login", {
        email,
        password,
      });
      console.log("nhận nè", response.data);
      const roles = response?.data?.roles;
      const accessToken = response?.data?.accessToken;
      console.log("nhận nè he", roles, accessToken);
      setAuth(response.data);
      navigate("/", { replace: true });
    } catch (error) {
      console.error(error);
      setErrorMessage("Tên đăng nhập hoặc mật khẩu không đúng");
    }
  };
 
  //reset auth
  // useEffect(() => setAuth(null));
  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Sign in
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <MDInput
                type="email"
                label="email"
                fullWidth
                onChange={(e) => setEmail(e.target.value)}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Password"
                fullWidth
                onChange={(e) => setPassword(e.target.value)}
              />
            </MDBox>
            {/* <MDBox display="flex" alignItems="center" ml={-1}>
              <Switch checked={rememberMe} onChange={handleSetRememberMe} />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                onClick={handleSetRememberMe}
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;Remember me
              </MDTypography>
            </MDBox> */}
            {/* nút nhấn sign in */}
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth onClick={handleSignIn}>
                sign in
              </MDButton>
              {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
              {/* {errorMessage && <div>{errorMessage}</div>} */}
            </MDBox>
            {/* <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Don&apos;t have an email?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-up"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign up
                </MDTypography>
              </MDTypography>
            </MDBox> */}
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
