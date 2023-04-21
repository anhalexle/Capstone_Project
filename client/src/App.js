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

import { useState, useEffect, useMemo } from 'react';

// react-router components
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Basic from './layouts/authentication/sign-in';
import RequireAuth from './RequireAuth';
import jwt_decode from 'jwt-decode';
//trang không có quyền đăng nhập
import Unauthorized from '../src/layouts/Unauthorized/index';

// @mui material components
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Icon from '@mui/material/Icon';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';

// Material Dashboard 2 React example components
import Sidenav from 'examples/Sidenav';
import Configurator from 'examples/Configurator';

// Material Dashboard 2 React themes
import theme from 'assets/theme';
import themeRTL from 'assets/theme/theme-rtl';

// Material Dashboard 2 React Dark Mode themes
import themeDark from 'assets/theme-dark';
import themeDarkRTL from 'assets/theme-dark/theme-rtl';

// RTL plugins
import rtlPlugin from 'stylis-plugin-rtl';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';

// Material Dashboard 2 React routes
import { pulicRoutes, privateRoutes } from 'routes';
import useMultiContext from 'useMultiContext';

// Material Dashboard 2 React contexts
import {
  useMaterialUIController,
  setMiniSidenav,
  setOpenConfigurator,
} from 'context';
// Images
import brandWhite from 'assets/images/logo-ct.png';
import brandDark from 'assets/images/logo-ct-dark.png';
export default function App() {
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    direction,
    layout,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);
  const { pathname } = useLocation();
  const { auth } = useMultiContext();

  // console.log("render app");
  // const token = localStorage.getItem("token"); // Lấy chuỗi token từ localStorage
  // console.log("Lấy chuỗi token từ localStorage", token);
  // const decoded = jwt_decode(token); // Giải mã chuỗi token
  // console.log("iải mã chuỗi token", decoded);
  // const account = decoded.id; // Lấy giá trị của thuộc tính "sub" trên payload
  // console.log("Giải mã token", account); // 'user1'
  // Cache for the rtl
  // kiểm tra có token thì vào trang doashborad luôn không thì vào log-in
  // const token = localStorage.getItem("token");

  useMemo(() => {
    const cacheRtl = createCache({
      key: 'rtl',
      stylisPlugins: [rtlPlugin],
    });

    setRtlCache(cacheRtl);
  }, []);

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  // Change the openConfigurator state
  const handleConfiguratorOpen = () =>
    setOpenConfigurator(dispatch, !openConfigurator);

  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute('dir', direction);
  }, [direction]);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        return (
          <Route
            exact
            path={route.route}
            element={route.component}
            key={route.key}
          />
        );
      }

      return null;
    });

  const configsButton = (
    <MDBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="3.25rem"
      height="3.25rem"
      bgColor="white"
      shadow="sm"
      borderRadius="50%"
      position="fixed"
      right="2rem"
      bottom="2rem"
      zIndex={99}
      color="dark"
      sx={{ cursor: 'pointer' }}
      onClick={handleConfiguratorOpen}
    >
      <Icon fontSize="small" color="inherit">
        settings
      </Icon>
    </MDBox>
  );

  return (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <CssBaseline />
      {layout === 'dashboard' && (
        <>
          <Sidenav
            color={sidenavColor}
            brand={
              (transparentSidenav && !darkMode) || whiteSidenav
                ? brandDark
                : brandWhite
            }
            brandName="Đồ Án Tốt Nghiệp "
            routes={[...privateRoutes, ...pulicRoutes]}
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
          />
          <Configurator />
          {configsButton}
        </>
      )}
      {layout === 'vr' && <Configurator />}
      <Routes>
        {/* <Route element={<RequireAuth allowedRoles={"admin"} />}>{getRoutes(privateRoutes)}</Route> */}
        {/* doashborad */}
        <Route element={<RequireAuth allowedRoles={['admin', 'user']} />}>
          <Route
            exact
            path={privateRoutes[0].route}
            element={privateRoutes[0].component}
            key={privateRoutes[0].key}
          />
          <Route
            exact
            path={privateRoutes[1].route}
            element={privateRoutes[1].component}
            key={privateRoutes[1].key}
          />
        </Route>

        {/* Notifications */}
        <Route element={<RequireAuth allowedRoles={['admin']} />}>
          <Route
            exact
            path={privateRoutes[2].route}
            element={privateRoutes[2].component}
            key={privateRoutes[2].key}
          />
          <Route
            exact
            path={privateRoutes[3].route}
            element={privateRoutes[3].component}
            key={privateRoutes[3].key}
          />
          <Route
            exact
            path={privateRoutes[4].route}
            element={privateRoutes[4].component}
            key={privateRoutes[4].key}
          />
        </Route>
        {getRoutes(pulicRoutes)}
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route
          path="/"
          element={
            auth === null ? (
              <Navigate to="authentication/sign-in" />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />
      </Routes>
    </ThemeProvider>
  );
}
