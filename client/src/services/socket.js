import { io } from "socket.io-client";

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL;

export const socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 3000,
  transports: ["websocket"],
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
