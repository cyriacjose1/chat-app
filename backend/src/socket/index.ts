import { Server } from "socket.io";

let io: Server;

const onlineUsers = new Map<string, string>();

export function initSocket(server: any) {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("join_room", (conversationId: string) => {
      socket.join(conversationId);
      console.log(`${socket.id} joined ${conversationId}`);
    });
    
    socket.on(
  "typing_start",
  (conversationId: string) => {
    socket.to(
      conversationId
    ).emit(
      "user_typing"
    );
  }
);

socket.on(
  "typing_stop",
  (conversationId: string) => {
    socket.to(
      conversationId
    ).emit(
      "user_stop_typing"
    );
  }
);


    socket.on("register_user", (userId: string) => {
      onlineUsers.set(userId, socket.id);

      io.emit("online_users", Array.from(onlineUsers.keys()));
      console.log(`User online: ${userId} (${socket.id})`);
    });

    socket.on("disconnect", () => {
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          break; 
        }
      }

      io.emit("online_users", Array.from(onlineUsers.keys()));
      console.log("Client disconnected:", socket.id);
    });
  });

  return io;
}

export function getIO() {
  if (!io) {
    throw new Error("Socket.IO not initialized");
  }
  return io;
}