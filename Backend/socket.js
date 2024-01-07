let io;
const User = require("./models/user");
const uuid = require("uuid");
const Chat = require("./models/chat");
const Notification=require("./models/notification");
exports.init = (httpServer) => {
  io = require("socket.io")(httpServer);
  return io;
};

exports.getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

exports.runIO = (io) => {
  io.on("connection", (socket) => {
    //console.log("client connected");

    let token;
    let userId ;
    let Name;

    

    socket.on("setup", async (room) => {
     // console.log("setup");
      socket.join(room.toString());
      userId=room;
      const currentUser = await User.findById(userId).select("userName");
      Name = currentUser.userName;
      try {
        const chats = await Chat.find({
          memberIds: { $in: [userId] },
        });
       // console.log(chats);
        chats.forEach((chat) => {
          // Add the socket to the room based on the _id of each matching chat
          socket.join(chat._id.toString());
        });
      } catch (error) {
        console.error("Error searching chat collection:", error);
      }
      //console.log('Rooms joined by the socket:', socket.rooms);
      
    });


    

    socket.on("endorsement", async (data) => {
      try {
       
        const title = "An endorsement";
        const description = `${Name} endorsed your ${data.skill} skill with recommendation "${data.recommendation}"`;
    
        const newNotification = new Notification({
          title: title,
          description: description,
          userId: data.to,
        });
    
        await newNotification.save();
    
        // Emit the notification to the specific user
        socket
          .to(data.to)
          .emit("newNotification", { _id: newNotification._id, type: "endorsement", title, description });
      } catch (error) {
        console.error("Error processing endorsement:", error);
      }
    });

    socket.on("request", async (data) => {
      try {
      
        socket
          .to(data.to)
          .emit("newNotification", { type: data.type, userName:Name });
      } catch (error) {
        console.error("Error processing request:", error);
      }
    });

    socket.on("sendMessage", (data) => {
      const roomMembersArray = Array.from(io.sockets.adapter.rooms.get(data.room) || []);
  //console.log('Members in room1:',data.room,"  ", roomMembersArray);
      socket
        .to(data.room)
        .emit("receiveMessage", {
          senderId: data.senderId,
          message: data.message,
          senderName: Name,
          createdAt:data.createdAt
        });
    });

    socket.on("joinChat", (data) => {
      socket.join(data.chatId);
      if(data.otherId!==userId){
       // console.log("clientJoinChat")
        socket.to(data.otherId).emit("clientJoinChat", data);
      }
    });
  });
};
