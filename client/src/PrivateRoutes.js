import { Outlet, Navigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

const PrivateRoutes = () => {
  // console.log("ktra token");
  // const token = localStorage.getItem("token"); // Lấy chuỗi token từ localStorage
  // console.log("Lấy chuỗi token từ localStorage", token);
  // const decoded = jwt_decode(token); // Giải mã chuỗi token
  // console.log("iải mã chuỗi token", decoded);
  // const account = decoded.type; // Lấy giá trị của thuộc tính "sub" trên payload
  // console.log("Giải mã token", account); // 'user1'

  // let auth = { token: false };
  const token = localStorage.getItem("token");
  return token ? <Outlet /> : <Navigate to="authentication/sign-in" />;
};

export default PrivateRoutes;
