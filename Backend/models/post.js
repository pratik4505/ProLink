const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  content: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['user', 'company'],
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  companyId: {
    type: Schema.Types.ObjectId,
    ref: 'Company'
  },
  likedBy:{
    type: Map,
    of: {
      type: String,
      enum: ["thumbsup", "congo", "mindblowing", "heart"],
      
    },
  },
  imageUrl: {
    type: String
  },
  videoUrl: {
    type: String
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ]
},
{
  timestamps: true,
});

postSchema.index({ content: "text" });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
