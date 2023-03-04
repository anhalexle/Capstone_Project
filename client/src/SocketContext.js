import React, { createContext, useRef } from "react";
import io from "socket.io-client";

export const SocketContext = createContext();

const socket = io.connect("http://localhost:3001");


export const SocketProvider = ({ children }) => {
  const notificationsRef = useRef([]);
  const arraydata = useRef(Array(29).fill(0));
  // const idAlarmRef = useRef(0);
  return (
    <SocketContext.Provider value={{ socket, notificationsRef, arraydata }}>
      {children}
    </SocketContext.Provider>
  );
};
