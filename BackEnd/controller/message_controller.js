import Conversation from "../models/conversation_Model.js";
import Message from "../models/message_Model.js";
import User from "../models/user_Model.js";


export const sendMessage = async(req,res) => {
    try{
        const senderId = req.id;
        const receiverId = req.params.id;
        const {message} = req.body;

        let conversation = await Conversation.findOne({
            participants:{$all:[senderId , receiverId]}
        })
        if(!conversation){
            conversation = await Conversation.create({
                participants:[senderId , receiverId]
            })

        }
        const newMessage= await Message.create({
            senderId,
            receiverId,
            message
        });

        if(newMessage) conversation.messages.push(newMessage._id);

        await Promise.all([conversation.save() , newMessage.save()]);  
        return res.status(201).json({
            success:true,
            newMessage,
        })


    }
    catch(err){
        console.log(err)
    }
}

export const getMessage = async (req,res)=>{
    try{
        const senderId = req.id;
        const receiverId = req.params.id;
        const conversation = await Conversation.find({
            participants:{$all:[senderId , receiverId]}
        });
        if(!conversation) return res.status(200).json({
            success:true, 
            messages:[]
        });

        return res.status(200).json({success:true , messages:conversation?.messages});

    }
    catch(err){
        console.log(err);
    }
}