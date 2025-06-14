import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password -__v -createdAt -updatedAt");

        if (!filteredUsers || filteredUsers.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }
        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error("Error fetching users for sidebar:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;
        //find all messages between the logged-in user and the user to chat with
        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ]
        })

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const sendMessages = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl;

        if (image) {
            // Assuming image is a base64 string, you might want to save it to a cloud storage or file system
            // For simplicity, let's assume image is already a URL or path
            const uploadedImageResponse = await cloudinary.uploader(image); // In a real application, you would handle the image upload here
            imageUrl = uploadedImageResponse.secure_url; // In a real application, you would handle the image upload here
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        });
        
        await newMessage.save();
        res.status(201).json({
            message: "Message sent successfully",
            data: newMessage
        });


    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}