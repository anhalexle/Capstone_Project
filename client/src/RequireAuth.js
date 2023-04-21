import { Outlet, Navigate } from "react-router-dom";
// import jwt_decode from "jwt-decode";
import useMultiContext from "./useMultiContext";
// eslint-disable-next-line react/prop-types
const RequireAuth = ({ allowedRoles }) => {
  const { auth } = useMultiContext();
  return auth && auth.roles && allowedRoles && allowedRoles.includes(auth.roles) ? (
    <Outlet />
  ) : auth ? (
    <Navigate to="/unauthorized" replace />
  ) : (
    <Navigate to="/authentication/sign-in" replace />
  );
};
export default RequireAuth;
