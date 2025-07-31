import { Server } from "socket.io";

export default function handler(req:any, res:any) {
  if (res.socket.server.io) {
    res.end();
    return;
  }

  const io = new Server(res.socket.server, { path: "/api/chat/socket" });
  res.socket.server.io = io;

  io.on("connection", (socket) => {
    console.log("✅ User connected:", socket.id);

    socket.on("join", (room) => socket.join(room));

    socket.on("sendMessage", (data) => {
      io.to(data.conversationId).emit("newMessage", data);
    });
  });

  res.end();
}
