const Chat = require("../../models/chat");
const Message = require("../../models/message");
const mongoose = require('mongoose'); 
const User=require("../../models/user");
exports.getChats = async (req, res) => {
  try {
    // Get userId from req.userId
    const userId = req.userId;

    // Search for chats where userId is one of the memberIds
    const chats = await Chat.find({
      memberIds: userId,
    });
    if(chats.length>0){
        const chatData = chats.map((chat) => {
            // Determine the index of userId in the memberIds array
            const userIndex = chat.memberIds.indexOf(userId);
            const otherMemberId = chat.memberIds[1 - userIndex];
            const otherMemberName = chat.memberNames[1 - userIndex];
            const otherMemberImageUrl = chat.imageUrls
              ? chat.imageUrls[1 - userIndex]
              : null;
      
            return {
              chatId: chat._id,
              otherMemberId,
              otherMemberName,
              otherMemberImageUrl,
            };
          });
      
          res.status(200).json(chatData);
    }
    else
    res.status(200).json([]);
   
  } catch (error) {
    console.error("Error fetching chats:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const createdAt = req.query.createdAt
      ? new Date(req.query.createdAt)
      : new Date();
    const chatId = req.query.chatId;
    
    // Find messages based on chatId and createdAt
    const messages = await Message.find({
      chatId: new mongoose.Types.ObjectId(chatId),
       createdAt: { $lt: createdAt },
    })
      .sort({ createdAt: -1 }) // Sort in descending order based on createdAt
       .limit(limit);

      
    const revMessages = messages.reverse();

    res.status(200).json(revMessages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.postMessage = async (req, res) => {
  try {
    const { senderId, chatId, message } = req.body;
    
    // Create a new message document
    const newMessage = new Message({
      senderId,
      chatId,
      message,
    });

    // Save the message to the database
    await newMessage.save();

    res.status(201).json({ message: "Message saved successfully" });
  } catch (error) {
    //console.error("Error posting message:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//this endpoint is for getting chats of connections and message-only users
exports.getPossibleChats = async (req, res) => {
    try {
      const { chats, limit, skip } = req.body;
  



      const user = await User.findById(req.userId);
  
      // Check if user object has connections and messageOnly fields
      if (!user.connections && !user.messageOnly) {
        return res.status(200).json([]);
      }
  
      // Take the union of connections and messageOnly arrays
      let userIds = [...new Set([...user.connections, ...user.messageOnly])];
  
      // Remove userIds that match otherMemberId(formed chats) in chats array
      userIds = userIds.filter(userId => !chats.some(chat => chat.otherMemberId.toString() === userId.toString()));
      
     

      // Skip the first 'skip' number of elements and take 'limit' number of elements
      const limitedUserIds = userIds.slice(skip, skip + limit);
  
      const usersData = await User.find(
        { _id: { $in: limitedUserIds } },
        { userName: 1, imageUrl: 1, _id: 1 }
      );
  
      res.status(200).json(usersData);
    } catch (error) {
      console.error('Error in /message/getPossibleChats:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  

//this endpoint is for creating chats of connections and message-only users
  exports.createChat=async (req, res) => {
    try {
      const userId = req.userId; // Assuming you have middleware to extract userId from the request
  
      // Get the other userId from the request parameters
      const otherUserId = req.params.id;
  
      // Fetch user details for both userId and otherUserId
      const [userDetails, otherUserDetails] = await Promise.all([
        User.findById(userId),
        User.findById(otherUserId),
      ]);
  
      // Check if both users exist
      if (!userDetails || !otherUserDetails) {
        return res.status(404).json({ error: 'One or both users not found' });
      }
  
      // Create a new chat instance
      const newChat = new Chat({
        memberIds: [userId, otherUserId],
        memberNames: [userDetails.userName, otherUserDetails.userName],
        imageUrls: [userDetails.imageUrl, otherUserDetails.imageUrl],
      });
  
      // Save the chat to the database
      const savedChat = await newChat.save();
  
      // Return the created chat in the response
      res.status(200).json(savedChat);
    } catch (error) {
      console.error('Error creating chat:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }