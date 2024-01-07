const Notification=require('../../models/notification')
const relativeTime = require("dayjs/plugin/relativeTime"); 
const User=require('../../models/user');
const dayjs = require("dayjs");
dayjs.extend(relativeTime);


exports.getNotifications = async (req, res) => {
    try {
      const { limit, skip } = req.query;
      const userId = req.userId;
  
      const notifications = await Notification.find({ userId })
        .sort({ createdAt: -1 }) // Sorting in descending order
        .skip(parseInt(skip))
        .limit(parseInt(limit));
        
      res.json(notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
}  

exports.getRequests=async (req, res) => {
  try {
    const userId = req.userId;
   
    const user = await User.findById(userId).select("requests").lean();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userRequests = user.requests;
    const modifiedRequests = {};

    if(userRequests){
      for (const [key, value] of Object.entries(userRequests)) {
        const { fromUserId, createdAt, type } = value;
  
        const fromUser = await User.findById(fromUserId, "_id userName imageUrl");
        
        // Use fromNow for relative time
        const modifiedCreatedAt = dayjs(createdAt).fromNow();
  
        modifiedRequests[key] = {
          fromUser,
          createdAt: modifiedCreatedAt,
          type,
        };
      }
    }

    

    res.json(modifiedRequests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

exports.handleRequest=async (req, res) => {
  try {
    const userId = req.userId;
    const { mkey, request, action } = req.body;

    // Access the user model and delete the key with mkey
    await User.updateOne({ _id: userId }, { $unset: { [`requests.${mkey}`]: 1 } });

    // If action is "accept", perform additional actions
    if (action === 'accept') {
      const fromId = request.fromUser._id;

      if (request.type === 'message') {
        // Update the messageOnly arrays
        await User.updateOne(
          { _id: userId },
          { $addToSet: { messageOnly: fromId } }
        );
        await User.updateOne(
          { _id: fromId },
          { $addToSet: { messageOnly: userId } }
        );
      } else if (request.type === 'connect') {
        // Update the connections arrays
        await User.updateOne(
          { _id: userId },
          { $addToSet: { connections: fromId } }
        );
        await User.updateOne(
          { _id: fromId },
          { $addToSet: { connections: userId } }
        );
      }
    }

    return res.status(200).json({ message: 'Request handled successfully' });
  } catch (error) {
    console.error('Error handling request:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};