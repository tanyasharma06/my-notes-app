import { io } from "socket.io-client";
export const socket = io("http://localhost:4000", { autoConnect: false });

export const connectSocket = (userId) => {
  if (!socket.connected) socket.connect();
  socket.emit("auth", userId);
};
