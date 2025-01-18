import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*", // Fixing the typo
  },
});

let user = []; // To store connected users
let messages = []; // To store chat messages

function RoomIdGenerator(){
let randomString = "";
const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const charactersLength = 62; // Length of the `characters` string

    for (let i = 0; i < 10; i++) {
      const randomIndex = Math.floor(Math.random() * charactersLength); // Generate a random index
      randomString += characters[randomIndex]; // Add the character at the random index
    }
    return randomString;
}

io.on("connection", (socket) => {
  user.push(socket.id);

  io.emit("new-user", user);

  socket.on("newMessage", (messageObj) => {
    messages.push(messageObj);
    io.emit("incomingMessage", messages); 
  });
  socket.on("newRoomMessage", (messageObj) => {
    io.to(messageObj.rid).emit("incomingRoomMessage", {id: messageObj.id, mess: messageObj.message, name:messageObj.name}); 
    console.log(messageObj.rid,messageObj.id, messageObj.message);
  });
  socket.on("newPrivateMessage", (messageObj) => {
    io.to(messageObj.to).emit("incomingPrivateMessage", {id: messageObj.from, mess: messageObj.message, name:messageObj.name}); 
    console.log(messageObj.to,messageObj.from, messageObj.message);
  });

  socket.on("disconnect", () => {
    user = user.filter((id) => id !== socket.id);
    if(user.length==0) messages=[];
    io.emit("new-user", user);
  });

  socket.on('createRoomId',(d)=>{
       const roomId=RoomIdGenerator();
       socket.join(roomId)
       io.to(socket.id).emit('roomId',roomId);
  })
  socket.on('joinRoom',(roomId)=>socket.join(roomId));

});

const port=process.env.PORT || 8000

httpServer.listen(port,()=>{
    console.log('Connected.............')
})
