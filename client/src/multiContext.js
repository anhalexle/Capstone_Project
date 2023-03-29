import React, { createContext, useRef, useState } from "react";
import io from "socket.io-client";

const multiContext = createContext();

// eslint-disable-next-line react/prop-types
export const MultiProvider = ({ children }) => {
  const socket = io.connect("http://localhost:3001");
  const notificationsRef = useRef([]);
  const [auth, setAuth] = useState({
    roles: "admin",
    accessToken:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZ…Y4M30.MB5CQFO0esXyv5H0iwuIj3I8Ik9ilnzAAHsTedr_Dl4",
  });
  // const [auth, setAuth] = useState(null);
  return (
    // eslint-disable-next-line react/jsx-no-undef
    <multiContext.Provider value={{ socket, notificationsRef, auth, setAuth }}>
      {children}
    </multiContext.Provider>
  );
};

export default multiContext;
