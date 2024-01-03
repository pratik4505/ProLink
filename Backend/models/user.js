const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  
  summary: String,
  industry: String,
  about: String,
  location: String,
  likedPosts: {
    type: Map,
    of: {
      type: String,
      enum: ["thumbsup", "congo", "mindblowing", "heart"],
      
    },
  },

  connections: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  companyFollows: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
  ],
  requests: {
    type: Map,
    of: {
      type: {
        type: String,
        enum: ["message", "connect"],
        required: true,
      },
      fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  },
  imageUrl: {
    type: String,
  },
  phoneNo: String,
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  messageOnly: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  experience: {
    type: Map,
    of: {
      title: String,
      description: String,
      startDate: Date,
      endDate: { type: String, default: "-Present" },
      imageUrl: String,
    },
  },

  education: {
    type: Map,
    of: {
      place: String,
      degree: String,
      startDate: Date,
      endDate: { type: String, default: "-Present" },
      imageUrl: String,
    },
  },

  skills: {
    type: Map,
    of: {
      skill: String,
      endorses: [
        {
          endorsedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          recommendation: String,
        },
      ],
    },
  },
  companyPages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Company" }],
  moreSections: {
    type: Map,
    of: {
      title: {
        type: String,
        required: true,
      },
      description: String,
    },
  },
});

module.exports = mongoose.model("User", userSchema);
