const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    commentBy: String,
    commentById: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    content: {
      type: String,
      required: true,
    },
    
    replies: [
      {
        name: { type: String },
        commentById: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        content: { type: String },
        createdAt: {
          type: Date,
          default: Date.now,
        }
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
