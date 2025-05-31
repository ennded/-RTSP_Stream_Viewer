import { io } from "socket.io-client";

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:3001";

export const socket = io(SOCKET_URL, {
  withCredentials: true,
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
  timeout: 20000,
  forceNew: true,
});

export const joinStreamRoom = (streamId) => {
  if (socket.connected) {
    socket.emit("join", streamId);
  } else {
    const connectHandler = () => {
      socket.emit("join", streamId);
      socket.off("connect", connectHandler);
    };
    socket.on("connect", connectHandler);
  }
};

export const leaveStreamRoom = (streamId) => {
  if (socket.connected) {
    socket.emit("leave", streamId);
  }
};
