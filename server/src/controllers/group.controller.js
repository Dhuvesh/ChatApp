import Group from "../models/group.model.js";
import GroupMessage from "../models/groupMessage.model.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import cloudinary from "../lib/cloudinary.js";

export const createGroup = async (req, res) => {
  try {
    const { name, participants } = req.body;
    const adminId = req.user._id;

    if (!name || !participants || participants.length < 2) {
      return res.status(400).json({ error: "Invalid group data" });
    }

    // Add admin to participants if not already included
    if (!participants.includes(adminId.toString())) {
      participants.push(adminId);
    }

    const newGroup = new Group({
      name,
      participants,
      admin: adminId,
    });

    await newGroup.save();

    const populatedGroup = await Group.findById(newGroup._id)
      .populate("participants", "-password")
      .populate("admin", "-password");

    // Notify all participants about the new group
    participants.forEach((participantId) => {
      if (participantId !== adminId.toString()) {
        const receiverSocketId = getReceiverSocketId(participantId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("newGroup", populatedGroup);
        }
      }
    });

    res.status(201).json(populatedGroup);
  } catch (error) {
    console.error("Error in createGroup: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getGroups = async (req, res) => {
  try {
    const userId = req.user._id;

    const groups = await Group.find({ participants: userId })
      .populate("participants", "-password")
      .populate("admin", "-password")
      .sort({ updatedAt: -1 });

    res.status(200).json(groups);
  } catch (error) {
    console.error("Error in getGroups: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user._id;

    const group = await Group.findOne({
      _id: groupId,
      participants: userId,
    });

    if (!group) {
      return res.status(403).json({ error: "Not authorized to view this group" });
    }

    const messages = await GroupMessage.find({ groupId })
      .populate("senderId", "-password")
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getGroupMessages: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendGroupMessage = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { text, image } = req.body;
    const senderId = req.user._id;
    const group = await Group.findOne({
      _id: groupId,
      participants: senderId,
    });

    if (!group) {
      return res.status(403).json({ error: "Not authorized to send messages to this group" });
    }

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new GroupMessage({
      groupId,
      senderId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    const populatedMessage = await GroupMessage.findById(newMessage._id)
      .populate("senderId", "-password");

    // Emit the message to all group participants
    group.participants.forEach((participantId) => {
      if (participantId.toString() !== senderId.toString()) {
        const receiverSocketId = getReceiverSocketId(participantId.toString());
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("newGroupMessage", {
            message: populatedMessage,
            groupId: group._id,
          });
        }
      }
    });

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error("Error in sendGroupMessage: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const leaveGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user._id;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    if (!group.participants.includes(userId)) {
      return res.status(403).json({ error: "Not a member of this group" });
    }

    // Remove user from participants
    group.participants = group.participants.filter(
      (id) => id.toString() !== userId.toString()
    );

    // If no participants left or only one participant, delete the group
    if (group.participants.length <= 1) {
      await Group.findByIdAndDelete(groupId);
      return res.status(200).json({ message: "Group deleted" });
    }

    // If admin is leaving, assign new admin
    if (group.admin.toString() === userId.toString()) {
      group.admin = group.participants[0];
    }

    await group.save();

    // Notify remaining participants
    group.participants.forEach((participantId) => {
      const receiverSocketId = getReceiverSocketId(participantId.toString());
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("groupUpdated", group);
      }
    });

    res.status(200).json({ message: "Left group successfully" });
  } catch (error) {
    console.error("Error in leaveGroup: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};