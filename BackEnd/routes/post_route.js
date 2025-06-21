import express from "express";
import isAuthenticated from "../middleware/isAuth.js";
import upload from "../middleware/multer.js";
import { addNewPost, deleteComment, deletePost, editComment, getAllPost, getPostComment, getUserPost, LikeComment, LikeUnlikePost, makeComment, saveThePost } from "../controller/post_controller.js";

const router = express.Router();
router.route("/addpost").post(isAuthenticated , upload.single('image') , addNewPost);
router.route("/allpost").get(isAuthenticated , getAllPost);
router.route("/:id/like_unlike").get(isAuthenticated , LikeUnlikePost);
router.route("/:id/save").get(isAuthenticated , saveThePost);
router.route("/:id/deletePost").delete(isAuthenticated , deletePost);


router.route("/:id/comment/all").get(isAuthenticated , getPostComment);
router.route("/:id/deleteComment").delete(isAuthenticated , deleteComment);
router.route("/:id/addComment").post(isAuthenticated , makeComment);
router.route("/:id/comment/likeUnlike").get(isAuthenticated , LikeComment);
router.route("/:id/comment/edit").put(isAuthenticated , editComment);



export default router;