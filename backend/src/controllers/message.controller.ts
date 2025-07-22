import { Request, Response } from "express";
import User from "../models/user.model.ts";
import Message from "../models/message.model.ts";
import imagekit from "../config/imageKit.ts";
import { v4 as uuidv4 } from "uuid";

export const getUsersForSidebar = async (req: Request, res: Response) => {
  try {
    const loggedUserId = req.userId;
    const filteredUsers = await User.find({
      _id: { $ne: loggedUserId },
    }).select("_password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error in getUsersForSidebar controller: ", error.message);
    } else {
      console.log("Unknown error in getUsersForSidebar controller", error);
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.userId;

    const messages = await Message.find({
      $or: [
        { senderId: myId, recieverId: userToChatId },
        { senderId: userToChatId, recieverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error in getMessages controller: ", error.message);
    } else {
      console.log("Unknown Error in getMessages controller: ", error);
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessages = async (req: Request, res: Response) => {
  const { text, image } = req.body;
  const { id: receiverId } = req.params;
  const senderId = req.userId;

  let imageUrl;

  try {
    if (image) {
      const fileName = `message_${senderId}_${receiverId}_${Date.now()}_${uuidv4()}`;
      
      const uploadResponse = await imagekit.upload({
        file: image,
        fileName,
        useUniqueFileName: true,
      });

      imageUrl = uploadResponse.url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    })

    await newMessage.save();

    // ToDO: realtime functionality goes here => socket.io

    res.status(201).json(newMessage);
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error in sendMessage controller: ", error.message);
    } else {
      console.log("Unknown Error in sendMessage controller: ", error);
    }
    res.status(500).json({ error: "Internal server error" });
  }
};
