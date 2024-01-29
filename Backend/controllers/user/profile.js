const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const User = require("../../models/user");
const { v4: uuidv4 } = require("uuid");

const clearImage = (filePath) => {
  filePath = path.join(__dirname, filePath);
  if (fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error clearing image:", err);
      }
    });
  }
};

exports.isAuthorized = async (req, res) => {
  const currentUser = await User.findById(req.userId).select(
    "_id userName imageUrl email"
  ).lean();
 
  res
    .status(200)
    .json({ userData: currentUser, message: "User authenticated" });
};

exports.getUserProfile = async (req, res) => {
  try {
    const openerId = req.userId;
    const ownerId = req.params.ownerId;

    const userProfile = await User.findById(ownerId).select(
      "userName summary industry about location connections imageUrl experience moreSections skills education requests"
    );

    if (!userProfile) {
      return res
        .status(404)
        .json({ message: "unable to getUserProfile, user not found" });
    }

    const isOwner = openerId === ownerId;
    let isConnecting, isConnection, isMessaging;
    isConnecting = isMessaging = isConnection = false;
    if (isOwner) {
      isConnecting = isMessaging = isConnection = false;
    } else if (userProfile.connections.includes(openerId)) {
      isConnection = true;
    } else if (userProfile.requests) {
      userProfile.requests.forEach((value, key) => {
        
        if (value.fromUserId.toString() === openerId) {
          if (value.type === "message") isMessaging = true;
          else isConnecting = true;
        }
      });
    }

    let modifiedSkills = {};

    if (userProfile.skills) {
      modifiedSkills = Object.fromEntries(
        Array.from(userProfile.skills, ([skillId, skill]) => [
          skillId,
          {
            skill: skill.skill,
            endorsementCount: skill.endorses.length,
            hasEndorsed: skill.endorses.some((endorsement) =>
              endorsement.endorsedBy.equals(openerId)
            ),
          },
        ])
      );
    }

    const connectionCount = userProfile.connections.length;

    const responseData = {
      isOwner,
      isConnection,
      isConnecting,
      isMessaging,
      userName: userProfile.userName,
      summary: userProfile.summary,
      industry: userProfile.industry,
      about: userProfile.about,
      location: userProfile.location,
      connectionCount,
      imageUrl: userProfile.imageUrl,
      experience: userProfile.experience,
      moreSections: userProfile.moreSections,
      skills: modifiedSkills,
      education: userProfile.education,
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching the user profile" });
  }
};

exports.postDetails = async (req, res) => {
  try {
    const { userName, summary, location, industry } = req.body;
    const userId = req.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.userName = userName;
    user.summary = summary;
    user.location = location;
    user.industry = industry;

    const updatedUser = await user.save();

    res.status(200).json({
      message: "User details updated successfully",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while updating user details" });
  }
};

exports.postAbout = async (req, res) => {
  try {
    const userId = req.userId;
    const { about } = req.body;

    // Update the user's "About" section
    await User.findByIdAndUpdate(userId, { about });

    res.status(200).json({ message: "About updated successfully" });
  } catch (error) {
    console.error("Error updating about:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.postEducation = async (req, res) => {
  try {
    const userId = req.userId;
    const educationId = req.params.educationId;

    const user = await User.findById(userId).select("education");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.education) {
      user.education = new Map();
    }

    const existingEducation = user.education.get(educationId);

    let response;

    if (existingEducation) {
      if (
        existingEducation.imageUrl &&
        req.files &&
        req.files["image"] &&
        req.files["image"][0]
      ) {
        clearImage(existingEducation.imageUrl);
        existingEducation.imageUrl = req.files["image"][0].path;
      }

      existingEducation.place = req.body.place;
      existingEducation.degree = req.body.degree;
      existingEducation.startDate = req.body.startDate;
      existingEducation.endDate = req.body.endDate;
      response = { [educationId]: existingEducation };
    } else {
      let path = undefined;
      if (req.files && req.files["image"] && req.files["image"][0]) {
        path = req.files["image"][0].path;
      }
      user.education.set(educationId, {
        imageUrl: path,
        place: req.body.place,
        degree: req.body.degree,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
      });
      response = { [educationId]: user.education.get(educationId) };
    }

    await user.save();

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.postExperience = async (req, res) => {
  try {
    const userId = req.userId;
    const experienceId = req.params.experienceId;

    const user = await User.findById(userId).select("experience");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.experience) {
      user.experience = new Map();
    }

    const existingExperience = user.experience.get(experienceId);

    let response = {};

    if (existingExperience) {
      if (
        existingExperience.imageUrl &&
        req.files &&
        req.files["image"] &&
        req.files["image"][0]
      ) {
        clearImage(existingExperience.imageUrl);
        existingExperience.imageUrl = req.files["image"][0].path;
      }

      existingExperience.title = req.body.title;
      existingExperience.description = req.body.description;
      existingExperience.startDate = req.body.startDate;
      existingExperience.endDate = req.body.endDate;
      response = { [experienceId]: existingExperience };
    } else {
      let path = undefined;
      if (req.files && req.files["image"] && req.files["image"][0]) {
        path = req.files["image"][0].path;
      }

      user.experience.set(experienceId, {
        imageUrl: path,
        title: req.body.title,
        description: req.body.description,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
      });
      response = { [experienceId]: user.experience.get(experienceId) };
    }

    await user.save();
    console.log(response);

    res.status(200).json(response);
  } catch (error) {
    console.error(
      "An error occurred while updating experience details:",
      error
    );
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.addSkill = async (req, res) => {
  try {
    const userId = req.userId;
    const { skillId, skill } = req.body;

    // Find the user by ID
    const user = await User.findById(userId).select("skills");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ensure that the 'skills' field is initialized as a map
    if (!user.skills) {
      user.skills = new Map();
    }

    // Update the skills map with the new skill
    user.skills.set(skillId, {
      skill,
      endorses: [],
    });

    // Save the updated user object
    await user.save();

    res.status(200).json({ message: "Skill added successfully" });
  } catch (error) {
    console.error("An error occurred while adding skill:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteSkill = async (req, res) => {
  try {
    const userId = req.userId; // Assuming you have middleware to extract user ID from the token
    const { key } = req.params;

    // Find the user by ID
    const user = await User.findById(userId).select("skills");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove the skill with the specified key from the skills map
    user.skills.delete(key);

    // Save the updated user object
    await user.save();

    res.status(200).json({ message: "Skill deleted successfully" });
  } catch (error) {
    console.error("An error occurred while deleting skill:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.endorse = async (req, res) => {
  try {
    const userId = req.userId; // Assuming you have middleware to extract user ID from the token
    const { ownerId, key, isEndorsed, recommendation } = req.body;

    // Find the owner user by ID
    const owner = await User.findById(ownerId).select("skills");

    if (!owner) {
      return res.status(404).json({ message: "Owner user not found" });
    }

    // Find the skill in the owner's skills map
    const ownerSkill = owner.skills.get(key);

    if (!ownerSkill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    // Update the endorsements based on the action
    if (isEndorsed) {
      // If endorsing, add a new endorsement object
      ownerSkill.endorses.push({
        endorsedBy: userId,
        recommendation,
      });
    } else {
      // If unendorsing, remove the endorsement object with the matching endorsedBy
      ownerSkill.endorses = ownerSkill.endorses.filter(
        (endorsement) => endorsement.endorsedBy !== userId
      );
    }

    // Update the skill in the owner's skills map
    owner.skills.set(key, ownerSkill);

    // Save the updated owner user object
    await owner.save();

    res.status(200).json({ message: "Endorsement updated successfully" });
  } catch (error) {
    console.error("An error occurred while updating endorsement:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.addProfileImage = async (req, res) => {
  try {
    // If the file is not present, return an error
    if (!req.files) {
      return res
        .status(400)
        .json({ message: "No profile image file provided" });
    }

    // Get the file path
    const imagePath = req.files["image"][0].path;

    const userId = req.userId;

    const user = await User.findById(userId).select("imageUrl");

    if (user.imageUrl) {
      clearImage(user.imageUrl);
    }
    user.imageUrl = "";

    user.imageUrl = imagePath;
    await user.save();

    res.status(200).json({ imageUrl: imagePath });
  } catch (error) {
    console.error(
      "An error occurred while uploading the profile image:",
      error
    );
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.addSection = async (req, res) => {
  try {
    const userId = req.userId;
    const { id, data } = req.body;

    // Find the user by userId
    const user = await User.findById(userId).select("moreSections");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Add the new section to moreSections map
    if (!user.moreSections) {
      user.moreSections = new Map();
    }
    user.moreSections.set(id, data);

    // Save the user with the updated moreSections
    await user.save();

    res.status(200).json({ message: "Section added successfully" });
  } catch (error) {
    console.error("An error occurred while adding section:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteSection = async (req, res) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId).select("moreSections");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const keyToDelete = req.params.key;

    // // Create a new object without the specified key
    // const updatedMoreSections = { ...user.moreSections };
    // delete updatedMoreSections[keyToDelete];

    // // Update the user with the modified object
    // user.moreSections = updatedMoreSections;
    if (user.moreSections.get(keyToDelete))
      user.moreSections.delete(keyToDelete);

    await user.save();

    res.status(200).json({ message: "Section deleted successfully" });
  } catch (error) {
    console.error("Error deleting section:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.postRequest = async (req, res) => {
  try {
    const { type, ownerId } = req.body;
    const fromUserId = req.userId;

    const user = await User.findById(ownerId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!user.requests) {
      user.requests = new Map();
    }
    const requestId = uuidv4();
    const createdAt = new Date(); // Current date and time

    user.requests.set(requestId, { type, fromUserId, createdAt });

    await user.save();

    res.status(200).json({ userId: fromUserId, message: "request Sent" });
  } catch (error) {
    console.error("An error occurred while handling request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getConnections = async (req, res) => {
  try {
    const ownerId = req.query.ownerId;
    const limit = parseInt(req.query.limit) || 10;
    const skip = parseInt(req.query.skip) || 0;

    const user = await User.findById(ownerId)
      .select("connections")
      .populate({
        path: "connections",
        select: "userName _id summary",
        options: {
          limit: limit,
          skip: skip,
        },
      });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hasMore = user.connections.length > skip + limit;

    res.status(200).json({
      data: user.connections,
      hasMore: hasMore,
    });
  } catch (error) {
    console.error("An error occurred while fetching connections:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
