import { Server } from "socket.io";

let io: Server;

export function initSocket(
  server: any
) {
  io = new Server(server, {
    cors: {
      origin:
        "http://localhost:5173",
    },
  });

  io.on(
    "connection",
    (socket) => {
      console.log(
        "Client connected:",
        socket.id
      );

      socket.on(
        "join_room",
        (conversationId: string) => {
          socket.join(
            conversationId
          );

          console.log(
            `${socket.id} joined ${conversationId}`
          );
        }
      );

      socket.on(
        "disconnect",
        () => {
          console.log(
            "Client disconnected:",
            socket.id
          );
        }
      );
    }
  );

  return io;
}

export function getIO() {
  if (!io) {
    throw new Error(
      "Socket.IO not initialized"
    );
  }

  return io;
}