import User from '../models/user_Model.js'
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'
import getDataURI from '../utils/datauri.js';
import cloudinary from '../utils/cloudinary.js';
import { Post } from '../models/posts_model.js';
import axios from 'axios'
import { getReceiverSocketId, io } from "../socket/socket.js";
import Notification from "../models/notification_Model.js";
import { sendVerificationEmail } from '../utils/sendEmail.js';
import Conversation from '../models/conversation_Model.js';

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(401).json({
                msg: "Something is missing, please check.",
                success: false,
            });
        }
        let user = await User.findOne({ email });
        if (user) {
            return res.status(401).json({
                msg: `${email} email already registered, try different one`,
                success: false,
            });
        }
        user = await User.findOne({ username });
        if (user) {
            return res.status(401).json({
                msg: `${username} username already registered, try different one`,
                success: false,
            });
        }
        const hashedpassword = await bcrypt.hash(password, 10);
        user = await User.create({
            username,
            email,
            password: hashedpassword
        });

        return res.status(201).json({
            msg: "Account created Successfully.",
            success: true,
            user
        })
    }
    catch (err) {
        console.log(err);
    }
}
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  console.log(email  , otp );

  let user = await User.findOne({ email });
  if (!user || user.otp !== otp || Date.now() > user.otpExpiry)
    return res.status(400).json({ msg: 'Invalid or expired OTP' });

  user.isVerified = true;
  user.otp = null;
  user.otpExpiry = null;
  await user.save();
  const token = jwt.sign({ userId: user._id }, process.env.Secret_key, { expiresIn: '10d' });
        const populatedPost = await Promise.all(
            user.posts.map(async (postId) => {
                const post = await Post.findById(postId);
                return post;
            })
        )

        user = {
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
            followers: user.followers,
            following: user.following,
            posts: populatedPost,
            isPremium: user.isPremium,
            isVerified: user.isVerified,
            isPremiumExpiry: user.isPremiumExpiry,
        }

        res.cookie('token', token, { httpOnly: true, secure:true , sameSite: 'none', maxAge: 1 * 24 * 60 * 60 * 1000 }).json({
            msg: `Welcome back ${user.username}`,
            success: true,
            user,
            token
        });

  
};


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({
                msg: "Something is missing, please check",
                success: false,
            });
        }
        // let user = await User.findOne({email});
        let user = await User.findOne({
            $or: [
                { username: email },
                { email: email }
            ]
        });
        if (!user) {
            return res.status(401).json({
                msg: `Incorrect email or password`,
                success: false,
            });
        }
        const ispasswordMatched = await bcrypt.compare(password, user.password);
        if (!ispasswordMatched) {
            return res.status(401).json({
                msg: `Incorrect email or password`,
                success: false,
            });
        }



        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '10d' });
        const populatedPost = await Promise.all(
            user.posts.map(async (postId) => {
                const post = await Post.findById(postId);
                return post;
            })
        )

        user = {
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
            followers: user.followers,
            following: user.following,
            posts: populatedPost,
            isPremium: user.isPremium,
            isVerified: user.isVerified,
            isPremiumExpiry: user.isPremiumExpiry,
        }

        res.cookie('token', token, { httpOnly: true, secure:true , sameSite: 'none', maxAge: 1 * 24 * 60 * 60 * 1000 }).json({
            msg: `Welcome back ${user.username}`,
            success: true,
            user,
            token
        });
    }
    catch (err) {
        console.log(err);
    }
}

export const logout = async (req, res) => {
    try {
        console.log("logout")
        return res.cookie('token', "", { maxAge: 0 }).json({
            msg: "Logout successfully",
            success: true
        })

    }
    catch (err) {
        console.log(err);
    }
};
export const resetPassword = async(req , res) =>{
    console.log("reseting password");
    try{
      
         const { email, password } = req.body;
         console.log(email , password);
        const user = await User.findOne({ email });

        if(!user){
            return res.status(404).json({
                message:"User not found",
                success:false
            })
        }
        const hashedpassword = await bcrypt.hash(password, 10);
        user.password = hashedpassword;

        await user.save();

        return res.status(200).json({
            message:"Password reset Successfully",
            success:true
        })
    }
    catch(error){
        console.log(error);
    }
}
export const isEmailExist = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
        success: false,
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "No account found with this email",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Email exists",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};
export const getprofile = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId)
            .select('-password -email')
            .populate({
                path: 'posts', options: { sort: { createdAt: -1 } },
                populate: [
                    {
                        path: 'comments', options: { sort: { createdAt: -1 } },
                        populate: [{ path: 'author', model: 'User', select: '-password -email', }]
                    },
                    { path: 'author' }]
            })

            .populate({
                path: 'saved', options: { sort: { createdAt: -1 } },
                populate: [
                    {
                        path: 'comments', options: { sort: { createdAt: -1 } },
                        populate: [{ path: 'author', model: 'User', select: '-password -email', }]
                    },
                    { path: 'author' }]
            })
        return res.status(200).json({
            user,
            success: true
        })
        // console.log(user.username)

    }
    catch (err) {
        console.log(err);
    }

}
export const removePhoto = async(req, res) => {
    try{
        console.log("we are changing")
        const userId = req.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                msg: "User not found",
                success: false,

            })
        }
        user.profilePicture = '/defaultPhoto.png';
        await user.save();
     
        const { password, email, ...safeUser } = user.toObject();

            return res.status(200).json({
                msg: "Photo Removed",
                success: true,
                user:safeUser

            })

    }
    catch(err){
        console.log(err);
    }
}
 export const editProfile = async (req, res) => {
    try {
        const userId = req.id;
        const { gender, bio , links } = req.body;
        console.log(links , "not array");

        const profilepic = req.file || null;

        let cloudResponse;
        if (profilepic) {
            const fileuri = getDataURI(profilepic);
            cloudResponse = await cloudinary.uploader.upload(fileuri);
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                msg: "User not found",
                success: false,

            })
        }
        if (bio) user.bio = bio;
        if (gender) user.gender = gender;
        if (profilepic) {
            user.profilePicture = cloudResponse.secure_url;
        }
        if(links) user.links = links;

        await user.save();
        const { password, email, ...safeUser } = user.toObject();


        return res.status(200).json({
            msg: "User updated successfully",
            success: true,
            user: safeUser
        })

    }

    catch (err) {
        console.log(err);
    }
}
export const getSuggestedusers = async (req, res) => {
    try {

        const loggedInUser = await User.findById(req.id);
        // const excludeIds = [...loggedInUser.following, req.id];
        const excludeIds = [req.id];

        const Suggestedusers = await User.find({ _id: { $nin: excludeIds } }).select("-password").limit(5);

        if (!Suggestedusers) {
            return res.status(400).json({
                msg: "No Suggested users are there",
                success: false,
            })

        }
        return res.status(200).json({

            success: true,
            users: Suggestedusers,
        })

    }
    catch (err) {
        console.log(err);
    }

}
// export const getMessageUsers = async (req, res) => {
//     try {

//         const MessageUsers = loggedInUser.following;
//         loggedInUser.followers.map((follower) => {
//             if (!MessageUsers.includes(follower)) {
//                 MessageUsers.push(follower);
//             }
//         });

//         const conversations = await Conversation.find({ participants: req.id });

//         const convoUserIds = new Set();

//         for (const convo of conversations) {
//         for (const id of convo.participants) {
//             if (id.toString() !== req.id) convoUserIds.add(id.toString());
//         }
//         }

//         const finalUserIds = [...new Set([...followingIds.map(id => id.toString()), ...convoUserIds])];

//         const users = await User.find({ _id: { $in: finalUserIds } }).select("-password");


//         if (!Suggestedusers) {
//             return res.status(400).json({
//                 msg: "No Suggested users are there",
//                 success: false,
//             })

//         }
//         return res.status(200).json({

//             success: true,
//             users: Suggestedusers,
//         })

//     }
//     catch (err) {
//         console.log(err);
//     }

// }
export const UpgradeToPremium = async (req, res) => {
    try {   
        const userId = req.id;
        const user = await User.findById(userId).select("-password -email");
        if (!user) {
            return res.status(404).json({
                msg: "User not found",
                success: false,
            });
        }
        user.isPremium = true;
        user.isPremiumExpiry = new Date(Date.now() +   60 * 1000); // 1 day from now
        
        await user.save();
        return res.status(200).json({
            msg: "Upgraded to Premium successfully",
            success: true,
            user
        });
    } catch (err) {
        console.log(err);
    }
}
/*
 const users = await User.find(query).select("-password");
 basic method for finding using query parameters if none exist we get empty array not CASE-SENSITIVE

 
*/
export const searchUser = async (req, res) => {
    try {
       
        const query  = req.query
        console.log(query);
        const queryObject = {};
        if (!query) {
            return res.status(400).json({
                msg: "Query is required",
                success: false,
            });
        }
        const { username, email } = query;
        if (username) {
            queryObject.username = { $regex: username, $options: "i" };
        }
        if (email) {
            queryObject.email = { $regex: email, $options: "i" };
        }

        const users = await User.find(queryObject).select("_id username profilePicture");
        return res.status(200).json({
            success: true,
            users,
        });
    } catch (err) {
        console.log(err);
    }
};
        
export const followorUnfollow = async (req, res) => {
    try {
        const loggedInUserId = req.id;
        const otherUserId = req.params.id;
        if (loggedInUserId === otherUserId) {
            return res.status(400).json({
                msg: "You cannot follow Unfollow yourself",
                success: false,
            });
        }
        const loggedInUser = await User.findById(loggedInUserId);
        const otherUser = await User.findById(otherUserId);
        console.log(loggedInUser, otherUserId);

        if (!loggedInUser || !otherUser) {
            return res.status(400).json({
                msg: "User not found",
                success: false,
            })
        }
        const isfollowing = loggedInUser.following.includes(otherUserId);
        if (isfollowing) {
            //unfollow logic
            // await Promise.all([
            //     User.updateOne({loggedInUserId} , {$pull:{following:otherUserId}}),
            //     User.updateOne({otherUserId} , {$pull:{followers:loggedInUserId}}),
            // ])
            await Promise.all([
                User.updateOne({ _id: loggedInUserId }, { $pull: { following: otherUserId } }),
                User.updateOne({ _id: otherUserId }, { $pull: { followers: loggedInUserId } }),
            ])
            const notification = {
                type: "Unfollowed",
                user: loggedInUser,
                receiver:otherUserId
            }
            // console.log(notification)
            const otherUserSocketId = getReceiverSocketId(otherUserId);
            io.to(otherUserSocketId).emit('notification', notification);

            await Notification.deleteOne({
                type:"followed",
                receiver: otherUserId,
                user: loggedInUserId
            });



            return res.status(200).json({
                msg: "Unfollowed Successfully",
                success: true,
                user: loggedInUser,
             
            })

        }
        else {
            // follow logic
            await Promise.all([
                User.updateOne({ _id: loggedInUserId }, { $push: { following: otherUserId } }),
                User.updateOne({ _id: otherUserId }, { $push: { followers: loggedInUserId } }),
            ])
            const notification = {
                type: "followed",
                user: loggedInUser,
                receiver:otherUserId
            }

            const otherUserSocketId = getReceiverSocketId(otherUserId);
            io.to(otherUserSocketId).emit('notification', notification);

            await Notification.create({
                type: "followed",
                user: loggedInUserId,
                receiver:otherUserId
            })

            return res.status(200).json({
                msg: "Followed Successfully",
                success: true,
                user: loggedInUser,
             
            })
        }

    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            msg: "Internal Server Error",
            success: false,
        });
    }

}
export const getConversationUsers = async (req, res) => {
    try{
        const id = req.id;
        const conversations = await Conversation.find({ participants: id });
        // console.log(conversations);
        const MessageUsers = await User.find(
  { _id: { $in: conversations.map(c => c.participants).flat() , $ne :id} },
  "username profilePicture name"
);
console.log(MessageUsers , "message users");

        return res.status(200).json({
            success: true,
            MessageUsers
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            msg: "Internal Server Error",
            success: false,
        });
    }
}
