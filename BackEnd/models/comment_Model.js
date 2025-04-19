import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({

    content:{type:String ,required:true},
    author:{type:mongoose.Schema.Types.ObjectId , ref:'User'},
    likes:[{type:mongoose.Schema.Types.ObjectId , ref:'User'}],
    post:[{type:mongoose.Schema.Types.ObjectId , ref:'Post'}],
}, {timestamps:true});

const Comments = mongoose.model('Comments' , commentSchema);

export default Comments;