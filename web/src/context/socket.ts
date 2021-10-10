import {io, Socket } from "socket.io-client";
import React from 'react';

export const socket = io('http://localhost:3001', {
    withCredentials: true,
});
export const SocketContext = React.createContext<Socket>(socket);