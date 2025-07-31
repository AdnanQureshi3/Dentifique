import cloudinary from "../utils/cloudinary.js";
import { Post } from '../models/posts_model.js'; // default export
import User from '../models/user_Model.js'
import sharp from "sharp";
import Comments from '../models/comment_Model.js';
import { getReceiverSocketId, io } from "../socket/socket.js";
import axios from 'axios'
import Notification from "../models/notification_Model.js";



// import { populate } from "dotenv";
export const addNewPost = async (req, res) => {

    try {
        const { caption } = req.body;
        const image = req.file;
        const authorId = req.id;

        if (!image) {
            return res.status(400).json({ msg: "Image required" });
        }

        const optimizedImageBuffer = await sharp(image.buffer)
            .resize({ width: 800, height: 800, fit: 'inside' })
            .toBuffer();

        //buffer to datauri
        const fileuri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;
        const cloudResponse = await cloudinary.uploader.upload(fileuri);

        const post = await Post.create({
            caption,
            image: cloudResponse.secure_url,
            author: authorId,
            type: 'post' // default type for posts
        })
        const user = await User.findById(authorId);

        user.posts.push(post._id);
        await user.save();

        await post.populate({ path: 'author', select: '-password' });
        res.status(201).json({ msg: "Post created", post, success: true });

    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Something  kh nwent wrong", success: false });
    }
}
export const addNewArticle = async (req, res) => {

    try {
        
        const { content, title } = req.body;
        const authorId = req.id;

        if (!content || !title) {
            return res.status(400).json({ msg: "Content and title are required" });
        }

       
        const post = await Post.create({
            caption:content,
            author: authorId,
            title: title,
            type: 'article' // set type to article
        })
        const user = await User.findById(authorId);

        user.posts.push(post._id);
        await user.save();

        await post.populate({ path: 'author', select: '-password' });
        res.status(201).json({ msg: "Post created", post, success: true });

    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Something  kh nwent wrong", success: false });
    }
}

export const getAllPost = async (req, res) => {
    try {
        // console.log("get all post calle")
        const posts = await Post.find().sort({ createdAt: -1 })
            .populate({ path: 'author', select: 'username , profilePicture' })
            .populate({
                path: 'comments',
                sort: { createdAt: -1 },
                populate: {
                    path: 'author',
                    select: 'username , profilePicture'
                }
            });

        return res.status(200).json({
            success: true,
            posts
        })
    }
    catch (err) {
        console.log(err);
    }

}
export const getUserPost = async (req, res) => {
    try {
        console.log("hihhi")
        const UserId = req.id;
        const posts = await Post.find({ author: UserId }).sort({ createdAt: -1 })
            .populate({ path: 'author', select: 'username , profilePicture' })
        // .populate({path:'comments' , 
        //     sort:{createdAt:-1} , 
        //     populate:{
        //         path:'author',
        //         select:'username , profilePicture'
        //     }
        // });

        return res.status(200).json({
            success: true,
            posts
        })

    }
    catch (err) {
        console.log(err);
    }

}

export const LikeUnlikePost = async (req, res) => {
    try {

        const UserId = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ success: false, msg: "Post not found" });
        let str = "";

        if (post.likes.includes(UserId)) {
            //unlike
            str = "Unliked"
            await Post.updateOne({ _id: postId }, { $pull: { likes: UserId } });
        }
        else {
            //like
            str = "Liked"
            await Post.updateOne({ _id: postId }, { $addToSet: { likes: UserId } });
        }

        const user = await User.findById(UserId).select('username profilePicture _id').lean();

        if (post.author.toString() !== UserId) {
            const notification = {
                type: str,
                user,
                postId,
            }
            // console.log(notification)
            const postAuthorSocketId = getReceiverSocketId(post.author.toString());
            io.to(postAuthorSocketId).emit('notification', notification);

            if (str === "Liked")
                await axios.post(`http://localhost:8000/api/user/noti/${post.author.toString()}`, notification);
            else {
                await Notification.deleteOne({
                    receiver: post.author.toString(),
                    post: postId,
                    user: user._id
                });

            }

            // await axios.get(`http://localhost:8000/api/user/noti/${post.author.toString()}/delete`, notification);



        }


        return res.status(200).json({
            msg: `Post ${str} Successfully by ${user.username}`,
            success: true
        })


    }
    catch (err) {
        console.log(err);
    }

}
export const makeComment = async (req, res) => {
    try {
        const UserId = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);

        const { text } = req.body;
        const content = text;
        if (!content) {
            return res.status(400).json({
                msg: "Cannot add empty comment",
                success: false,
            });
        }
        let comment = await Comments.create({
            content,
            author: UserId,
            post: postId,
        });
        const user = await User.findById(UserId).select('username profilePicture _id').lean();

        comment = await comment.populate({ path: 'author', select: 'username profilePicture' });


        post.comments.push(comment._id);
        await post.save();

        if (post.author.toString() !== UserId) {
            const notification = {
                type: "commented",
                user,
                postId,
            }
            const postAuthorSocketId = getReceiverSocketId(post.author.toString());
            io.to(postAuthorSocketId).emit('notification', notification);
            await axios.post(`http://localhost:8000/api/user/noti/${post.author.toString()}`, notification);


        }

        return res.status(201).json({
            msg: "Comment Added Successfully",
            comment,
            success: true,

        })

    }
    catch (err) {
        console.log(err);
    }

}
export const getPostComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const comments = await Comments.find({ post: postId })
            .populate({ path: 'author', select: 'username , profilePicture' })

        if (comments.length === 0) {
            return res.status(200).json({
                msg: "No comments added",
                success: true
            })
        }

        return req.status(200).json({
            success: true,
            comments,
        })
    }
    catch (err) {
        console.log(err);
    }
}
export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const UserId = req.id;

        const post = await Post.findById(postId);

        if (post.author.toString() !== UserId) {
            return res.status(403).json({
                msg: "You are Unauthorized",
                success: false,
            })
        }
        await Post.findByIdAndDelete(postId);

        const user = await User.findByIdAndUpdate(
            UserId,
            { $pull: { posts: postId } },
            { new: true }
        );
        //   const user = await User.findById(UserId);
        //   user.posts = user.posts.filter(p => p.toString() !== postId);
        //   await user.save();

        //delete the all the comments of the post

        await Comments.deleteMany({ post: postId });


        return res.status(200).json({
            msg: "Post deleted Successfully",
            success: true,
        })


    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            msg: "Server Error",
            success: false
        });
    }


}

export const deleteComment = async (req, res) => {
    try {
        const commentId = req.params.id;
        const userId = req.id;
        const comment = await Comments.findById(commentId);
        if(!comment) {
            return res.status(404).json({
                msg: "Comment not found",
                success: false,
            })

        }


        if (userId !== comment.author.toString()) {
            return res.status(403).json({
                msg: "You are Unauthorized",
                success: false,
            })
        }
        const postId = comment.post.toString();

        const post = await Post.findById(postId);
        post.comments = post.comments.filter(c => c.toString() != commentId);
        await post.save();


        await Comments.findByIdAndDelete(commentId);
        return res.status(200).json({
            msg: `Comment deleted Successfully`,
            success: true,
            postId,
            commentId
        })


    }
    catch (err) {
        console.log(err);
    }

}

export const editComment = async (req, res) => {
    try {
        const commentId = req.params.id;
        const userId = req.id;
        const {text} = req.body;
        const comment = await Comments.findById(commentId)
        
        if(!comment) {
            return res.status(404).json({
                msg: "Comment not found",
                success: false,
            })
        }
        

       const updatedComment = await Comments.findByIdAndUpdate(commentId , {content:text})
       .populate({ path: 'author', select: 'username , profilePicture' })
        return res.status(200).json({
            msg: "Comment edited Successfully",
            success: true,
            updatedComment,
        })


    }
    catch (err) {
        console.log(err);
    }

}

export const LikeComment = async (req, res) => {
    try {
        const commentId = req.params.id;
        const userId = req.id;
        const comment = await Comments.findById(commentId)
        .populate({ path: 'author', select: 'username , profilePicture' })
        let str= '';

        if(comment.likes.includes(userId)){

            comment.likes.pull(userId);
            str = "liked"
        }
        else{
            comment.likes.push(userId);
            str = 'unliked'
        }
        await comment.save();

        return res.status(200).json({
            msg: `Comment ${str} Successfully`,
            success: true,
            str,
            updatedComment:comment
        })

    }
    catch (err) {
        console.log(err);
    }

}



export const saveThePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.id;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                msg: "Post not found",
                success: false,
            })
        }

        const user = await User.findById(userId);
        let str = "";

        if (user.saved.includes(postId)) {
            //Unsave
            str = "Unsaved";
            await user.updateOne({ $pull: { saved: postId } })
            // await user.save();
        }
        else {
            //save
            str = "Saved";
            await user.updateOne({ $push: { saved: postId } })
            // await user.save();
        }
        const { password, email, ...safeUser } = user.toObject();
        return res.status(200).json({
            msg: `Post ${str} Successfully`,
            success: true,
            user: safeUser,
            str

        })

    }
    catch (err) {
        console.log(err);
    }
}

export const ReportThePost = async (req,res)=>{
    try{
        const {username, text, post, type} = req.body;

        await sendReportEmail(username, text, post, type);

        return res.status(200).json({
            msg: "Report sent successfully",
            success: true
        });
    }
    catch(err){
        console.log(err);
    }
}





// export const getAllPost = async (req, res)=>{
//     try{

//     }
//     catch(err){
//         console.log(err);
//     }

// }