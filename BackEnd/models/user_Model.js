import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String, default: '/defaultPhoto.png' },
    bio: { type: String, default: '' },
    gender: { type: String, enum: ['male', 'female'] },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    saved: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    isVerified: { type: Boolean, default: false },
    isPremium: { type: Boolean, default: false },
    isPremiumExpiry: { type: Date, default: Date.now },
    otp: { type: String, default: '' },
    otpExpiry: { type: Date, default: Date.now },
}, { timestamps: true });
 
 

const User = mongoose.model('User', userSchema);

export default User;

