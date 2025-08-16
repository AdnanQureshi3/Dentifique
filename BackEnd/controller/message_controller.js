import Conversation from "../models/conversation_Model.js";
import Message from "../models/message_Model.js";
import User from "../models/user_Model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";


export const sendMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const { message } = req.body;
        if (!message || !senderId || !receiverId) {
            return res.status(400).json({
                success: false,
                msg: "Invalid request data"
            });
        }
        
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        })
        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId]
            })
            
        }
        const NEW_Message = await Message.create({
            senderId,
            receiverId,
            message,
            conversationId: conversation._id
        });
        
        if (NEW_Message) conversation.messages.push(NEW_Message._id);
        
        await Promise.all([conversation.save(), NEW_Message.save()]);
        const receiverSocketId = getReceiverSocketId(receiverId);
        console.log(message , receiverSocketId, "receiver socket id");

    await NEW_Message.populate('senderId', 'username profilePicture _id');
await NEW_Message.populate('receiverId', 'username profilePicture _id');

const newMessage = NEW_Message.toObject();


        if (receiverSocketId) {
            console.log("RTM send" ,newMessage);

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
        }).populate("messages").lean();

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

export const deleteForMe = async(req , res) =>{
    try{
        const senderId = req.id;
        const receiverId = req.params.id;
        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });
        const {messagesArray} = req.body;

        if (!conversation) return res.status(404).json({
            success: false,
            msg: "Converstation not found"
        });
            await Message.updateMany(
    { _id: { $in: messagesArray }},
    { $push: { NotVisibleTo: senderId } }
    );
     return res.status(200).json({
      success: true,
      msg: "Messages deleted for you"
    });


    }
    catch(err){
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