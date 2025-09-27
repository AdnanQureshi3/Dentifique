import express from "express";
import isAuthenticated from "../middleware/isAuth.js";
import upload from "../middleware/multer.js";
import { addNewArticle, addNewPost, deleteComment, deletePost, editComment, getAllPost, getPostComment, getUserPost, 
    LikeComment, LikeUnlikePost, makeComment, ReportThePost, saveThePost, getTop3TrendingPosts , getPost } from "../controller/post_controller.js";

const router = express.Router();
router.route("/addpost").post(isAuthenticated , upload.single('image') , addNewPost);
router.route("/addarticle").post(isAuthenticated , addNewArticle);
router.route("/allpost").get(isAuthenticated , getAllPost);
router.route("/:id/like_unlike").get(isAuthenticated , LikeUnlikePost);
router.route("/:id/save").get(isAuthenticated , saveThePost);
router.route("/:id/deletePost").delete(isAuthenticated , deletePost);

router.route("/trending").get( getTop3TrendingPosts);
router.route("/post/:id").get( getPost);


router.route("/:id/comment/all").get(isAuthenticated , getPostComment);
router.route("/:id/deleteComment").delete(isAuthenticated , deleteComment);
router.route("/:id/addComment").post(isAuthenticated , makeComment);
router.route("/:id/comment/likeUnlike").get(isAuthenticated , LikeComment);
router.route("/:id/comment/edit").put(isAuthenticated , editComment);

router.post("/:id/report", isAuthenticated, ReportThePost);

export default router;