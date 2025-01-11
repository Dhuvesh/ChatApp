import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

const userSocketMap = {}; // {userId: socketId}
const userGroupsMap = {}; // {userId: [groupId1, groupId2, ...]}

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
    
    // Join user's group rooms
    if (userGroupsMap[userId]) {
      userGroupsMap[userId].forEach((groupId) => {
        socket.join(groupId);
      });
    }
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Handle joining groups
  socket.on("joinGroup", (groupId) => {
    socket.join(groupId);
    if (!userGroupsMap[userId]) {
      userGroupsMap[userId] = [];
    }
    userGroupsMap[userId].push(groupId);
  });

  // Handle leaving groups
  socket.on("leaveGroup", (groupId) => {
    socket.leave(groupId);
    if (userGroupsMap[userId]) {
      userGroupsMap[userId] = userGroupsMap[userId].filter(id => id !== groupId);
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    delete userGroupsMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };