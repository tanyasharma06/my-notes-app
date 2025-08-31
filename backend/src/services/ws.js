export const initSocket = (io) => {
  io.on("connection", (socket) => {
    // client should send its userId after auth
    socket.on("auth", (userId) => {
      if (userId) socket.join(userId);
    });
  });
};
