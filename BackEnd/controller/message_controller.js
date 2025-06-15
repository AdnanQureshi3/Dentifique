import Conversation from "../models/conversation_Model.js";
import Message from "../models/message_Model.js";
import User from "../models/user_Model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";


export const sendMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const { message } = req.body;
        console.log(message);

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        })
        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId]
            })

        }
        const newMessage = await Message.create({
            senderId,
            receiverId,
            message,
            conversationId: conversation._id
        });

        if (newMessage) conversation.messages.push(newMessage._id);

        await Promise.all([conversation.save(), newMessage.save()]);
        const receiverSocketId = getReceiverSocketId(receiverId);

        if (receiverSocketId) {
            io.to(receiverSocketId).emit('newMessage', newMessage);
        }
        return res.status(201).json({
            success: true,
            newMessage
        })


    }
    catch (err) {
        console.log(err)
    }
}

export const getMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        }).populate("messages");;

        if (!conversation) return res.status(200).json({
            success: true,
            messages: []
        });

        return res.status(200).json({ success: true, messages: conversation?.messages });

    }
    catch (err) {
        console.log(err);
    }
}
export const deleteConversation = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        if (!conversation) return res.status(404).json({
            success: false,
            msg: "Converstation not found"
        });

        await Message.deleteMany({ conversationId: conversation._id });
        await conversation.deleteOne();
        return res.status(200).json({
            success: true,
            msg: "Converstation Deleted"
        });


    }
    catch (err) {
        console.log(err);
    }

}