import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
    message: {
        type: String,
        required: true
    }
});


const Message = mongoose.model('Message' , messageSchema);
export default Message