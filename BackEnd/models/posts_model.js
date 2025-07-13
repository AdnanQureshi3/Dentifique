import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    caption: { type: String, default: '' },
    image: { type: String, default: '' },
    title: { type: String, default: '' },
    type: { type: String, enum: ['post', 'article'], default: 'post' },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comments' }]

}, { timestamps: true });
export  const Post = mongoose.model('Post', postSchema);
