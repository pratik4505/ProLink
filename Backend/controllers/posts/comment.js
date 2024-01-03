
const Post = require('../../models/post');
const User = require('../../models/user');
const Comment = require('../../models/comment');



exports.getComments=async (req, res) => {
  try {
    const postId = req.params.postId;

    
    const post = await Post.findById(postId).select('comments').populate('comments');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

   
    const commentsData = post.comments;

    res.status(200).json({ comments: commentsData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.addComment=async (req, res) => {
    try {
      const { content, postID } = req.body;
      const loggedInUserId = req.userId;
  
      // Find the user to get their username
      const user = await User.findById(loggedInUserId).select('userName');
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Create a new comment
      const newComment = new Comment({
        commentBy: user.userName,
        commentById:loggedInUserId,
        content
      });
  
      // Save the comment to the database
      const savedComment = await newComment.save();
  
      // Update the post's comments array
      const post = await Post.findById(postID);
  
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      post.comments.push(savedComment._id);
      await post.save();
  
      // Send the created comment in the response
      res.status(201).json(savedComment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while adding the comment' });
    }
  };



exports.addReply = async (req, res) => {
    try {
      const { commentId, content } = req.body;
      const loggedInUserId = req.userId;
  
      if (!commentId || !content) {
        return res.status(400).json({ message: 'Comment ID and content are required.' });
      }
  
      // Get the user's name associated with the loggedInUserId
      // Replace 'User' with the actual model name
      const user = await User.findById(loggedInUserId).select('userName');
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      // Create a new reply object
      const reply = {
        name: user.userName, // Replace with the correct field in your User model
        commentById: loggedInUserId,
        content,
        createdAt: new Date().toISOString(), // Use current date and time
      };
  
      // Find the comment by ID and push the new reply into the replies array
      const comment = await Comment.findByIdAndUpdate(
        commentId,
        { $push: { replies: reply } },
        { new: true }
      );
  
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found.' });
      }
  
      // Send the updated comment with the new reply in the response
      res.status(200).json(comment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while adding a reply.' });
    }
  };