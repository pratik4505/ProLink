let io;
const User = require("./models/user");
const uuid = require("uuid");
const Chat = require("./models/chat");
const Notification = require("./models/notification");
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

    

    socket.on("setup", async (room) => {
      // console.log("setup");
      socket.join(room.toString());
      
      
      try {
        const chats = await Chat.find({
          memberIds: { $in: [room] },
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
        const description = `${ data.userData.userName} endorsed your ${data.skill} skill with recommendation "${data.recommendation}"`;

        const newNotification = new Notification({
          type: "endorsement",
          title: title,
          description: description,
          userId: data.to,
        });

        await newNotification.save();

        // Emit the notification to the specific user
        socket
          .to(data.to)
          .emit("newNotification", {
            ...newNotification.toJSON()
          });
      } catch (error) {
        console.error("Error processing endorsement:", error);
      }
    });

    socket.on("newRequest", async (data) => {
      try {
       
        const newNotification = new Notification({
          type: "newRequest",
          title: data.userData.userName, 
          description: `sent you a ${data.requestType}`,
          userId: data.to.toString(),
        });
    
        await newNotification.save();
    
        socket
          .to(data.to)
          .emit("newNotification", {
            ...newNotification.toJSON(), 
          });
      } catch (error) {
        console.error("Error processing request:", error);
      }
    });


    socket.on("acceptRequest", async (data) => {
      try {
       
        const newNotification = new Notification({
          type: "acceptRequest",
          title:  data.userData.userName, 
          description: `accepted your ${data.requestType}`,
          userId: data.to.toString(),
          byId: data.userData.userId.toString(),
        });
    
        await newNotification.save();
    
        socket
          .to(data.to)
          .emit("newNotification", {
            ...newNotification.toJSON(), 
          });
      } catch (error) {
        console.error("Error processing request:", error);
      }
    })
    



    socket.on("sendMessage", (data) => {
      const roomMembersArray = Array.from(
        io.sockets.adapter.rooms.get(data.room) || []
      );
      //console.log('Members in room1:',data.room,"  ", roomMembersArray);
      socket.to(data.room).emit("receiveMessage", {
        senderId: data.senderId,
        message: data.message,
        senderName: data.userData.userName,
        createdAt: data.createdAt,
      });
    });

    socket.on("joinChat", (data) => {
      socket.join(data.chatId);
      if (data.otherId !== data.userData.userId) {
        // console.log("clientJoinChat")
        socket.to(data.otherId).emit("clientJoinChat", data);
      }
    });

    socket.on("callUser", (data) => {
      // console.log(data);
      io.to(data.userToCall).emit("incomingCall", { userData: data.userData });
    })
    


    socket.on("answerCall", (data) => {
      io.to(data.to).emit("isCallAccepted", {isAccepted:data.isAccepted });
    })

   

  });
};
