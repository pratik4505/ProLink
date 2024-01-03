const Notification=require('../../models/notification')

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