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

import { useState, useEffect, useCallback, memo, useRef } from "react";
import moment from "moment";

// react-router components
import { useLocation, Link } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @material-ui core components
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Icon from "@mui/material/Icon";
//thêm icon
import ExpandMore from "@mui/icons-material/ExpandMore";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";

// Material Dashboard 2 React example components
import Breadcrumbs from "examples/Breadcrumbs";
import NotificationItem from "examples/Items/NotificationItem";

// Custom styles for DashboardNavbar
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
  navbarMobileMenu,
} from "examples/Navbars/DashboardNavbar/styles";

// Material Dashboard 2 React context
import {
  useMaterialUIController,
  setTransparentNavbar,
  setMiniSidenav,
  setOpenConfigurator,
} from "context";

//toast
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//context soket
//Provider
import { useContext } from "react";
// import { SocketContext } from "../../../multiContext";
import useMultiContext from "../../../useMultiContext";
//tỰ THÊM NÚT NHẤN
import Button from "@mui/material/Button";
//Di chuyển tới page notification
import NotificationsPage from "../../../layouts/notifications";
import { Route, Routes } from "react-router-dom";
import Grid from "@mui/material/Grid";
import MDAlert from "../../../components/MDAlert";
import MDTypography from "../../../components/MDTypography";

function DashboardNavbar({ absolute, light, isMini }) {
  useEffect(() => {
    setNotifications(notificationsRef.current);
  }, []);

  // const notificationsRef = useRef([]);
  const [notifications, setNotifications] = useState([]);
  //nút nhấn xem toàn bộ thông báo
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  //xóa alarm
  const [confirmClearNotifications, setConfirmClearNotifications] = useState(false);
  //đi tới trang notification
  // const history = useHistory();

  const { socket, notificationsRef } = useMultiContext();
  const idAlarmRef = useRef(0);

  const handleServerWarning = useCallback((myObject) => {
    //cài thêm thu viện moment
    const dateString = moment(myObject.parameter.createdAt).format("DD/MM/YYYY hh:mm A");
    const finalString = `${dateString} | ${myObject.parameter.name} | Value = ${myObject.parameter.value}`;
    let type_toast = "error";
    // setNotifications((prev => [...prev, { type: myObject.type, print: finalString }]));
    notificationsRef.current = [
      { id: idAlarmRef.current++, type: myObject.type, print: finalString },
      ...notificationsRef.current,
    ];
    setNotifications(notificationsRef.current);
    if (myObject.type === "High" || myObject.type === "Low") {
      type_toast = "warn";
    }
    toast[type_toast](finalString, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }, []);

  useEffect(() => {
    socket.on("alarm", handleServerWarning);
    return () => {
      socket.off("alarm", handleServerWarning);
    };
  }, []);

  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator, darkMode } = controller;
  const [openMenu, setOpenMenu] = useState(false);
  const route = useLocation().pathname.split("/").slice(1);

  useEffect(() => {
    // Setting the navbar type
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }

    // A function that sets the transparent state of the navbar.
    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    }

    /** 
     The event listener that's calling the handleTransparentNavbar function when 
     scrolling the window.
    */
    window.addEventListener("scroll", handleTransparentNavbar);

    // Call the handleTransparentNavbar function to set the state with the initial value.
    handleTransparentNavbar();

    // Remove event listener on cleanup
    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);
  const handleOpenMenu = (event) => setOpenMenu(event.currentTarget);
  const handleCloseMenu = () => setOpenMenu(false);

  // Render the notifications menu
  const displayNotification = ({ id, type, print }) => {
    let action;

    type === "High" || type === "Low" ? (action = "warning") : (action = "error");
    // if (type === 'High' || type === 'Low') {
    return (
      // <NotificationItem
      //   icon={<Icon>warning</Icon>}
      //   style={{ backgroundColor: 'yellow' }}
      //   title={`${type}: ${print}`}
      //   dismissible
      //    />
      <MDAlert
        color={action}
        dismissible
        onDismiss={() => {
          notificationsRef.current = notifications.filter((obj) => obj.id !== id);
          setNotifications(notificationsRef.current);
        }}
      >
        <MDTypography variant="body2" color="white">
          <MDTypography component="a" href="#" variant="body2" fontWeight="medium" color="white">
            {type}:{" "}
          </MDTypography>
          {print}
        </MDTypography>
      </MDAlert>
    );
  };

  // Add this function to handle the "confirm" button click
  const handleConfirmClearNotifications = () => {
    notificationsRef.current = [];
    setNotifications([]);
  };
  const renderMenu = () => (
    <Menu
      anchorEl={openMenu}
      anchorReference={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={Boolean(openMenu)}
      onClose={handleCloseMenu}
      sx={{ mt: 2 }}
    >
      {showAllNotifications
        ? notifications.map((n) => displayNotification(n))
        : notifications.slice(0, 5).map((n) => displayNotification(n))}

      <Button onClick={() => setShowAllNotifications(!showAllNotifications)}>
        <Icon sx={iconsStyle}>{showAllNotifications ? "expand_less" : "expand_more"}</Icon>
      </Button>
      <Button onClick={handleConfirmClearNotifications}>Confirm</Button>
      <Link to="/notifications">
        <Button>To Notifications</Button>
      </Link>
    </Menu>
  );

  // Styles for the navbar icons
  const iconsStyle = ({ palette: { dark, white, text }, functions: { rgba } }) => ({
    color: () => {
      let colorValue = light || darkMode ? white.main : dark.main;

      if (transparentNavbar && !light) {
        colorValue = darkMode ? rgba(text.main, 0.6) : text.main;
      }

      return colorValue;
    },
  });

  return (
    <AppBar
      position={absolute ? "static" : navbarType}
      // position="static"
      color="inherit"
      sx={(theme) => navbar(theme, { transparentNavbar, absolute, light, darkMode })}
    >
      <Toolbar sx={(theme) => navbarContainer(theme)}>
        <MDBox color="inherit" mb={{ xs: 1, md: 0 }} sx={(theme) => navbarRow(theme, { isMini })}>
          <Breadcrumbs icon="home" title={route[route.length - 1]} route={route} light={light} />
        </MDBox>
        {isMini ? null : (
          <MDBox sx={(theme) => navbarRow(theme, { isMini })}>
            <MDBox pr={1}>
              <MDInput label="Search here" />
            </MDBox>
            <MDBox color={light ? "white" : "inherit"}>
              <Link to="/authentication/sign-in/basic">
                <IconButton sx={navbarIconButton} size="small" disableRipple>
                  <Icon sx={iconsStyle}>account_circle</Icon>
                </IconButton>
              </Link>
              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarMobileMenu}
                onClick={handleMiniSidenav}
              >
                <Icon sx={iconsStyle} fontSize="medium">
                  {miniSidenav ? "menu_open" : "menu"}
                </Icon>
              </IconButton>
              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarIconButton}
                onClick={handleConfiguratorOpen}
              >
                <Icon sx={iconsStyle}>settings</Icon>
              </IconButton>

              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarIconButton}
                aria-controls="notification-menu"
                aria-haspopup="true"
                variant="contained"
                onClick={handleOpenMenu}
              >
                <Icon sx={iconsStyle}>notifications</Icon>
                {notifications.length > 0 && (
                  <div
                    style={{
                      width: "13px",
                      height: "13px",
                      backgroundColor: "red",
                      borderRadius: "50%",
                      padding: "5px",
                      fontSize: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "absolute",
                      top: "0px",
                      right: "4px",
                    }}
                  >
                    {notifications.length}
                  </div>
                )}
              </IconButton>
              {renderMenu()}
            </MDBox>
          </MDBox>
        )}
      </Toolbar>
      <Routes>
        <Route path="/notifications" element={<NotificationsPage />} />
      </Routes>
    </AppBar>
  );
}

// Setting default values for the props of DashboardNavbar
DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};

// Typechecking props for the DashboardNavbar
DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default memo(DashboardNavbar);
