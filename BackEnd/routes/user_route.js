import express from "express";
import { editProfile, followorUnfollow, getprofile, getSuggestedusers, login, logout, register } from "../controller/user_controller.js";
import isAuthenticated from "../middleware/isAuth.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/logout').get(logout)
router.route('/:id/getprofile').get(isAuthenticated , getprofile)
router.route('/profile/edit').post(isAuthenticated ,upload.single('ProfilePicture') , editProfile)
router.route('/suggested').get(isAuthenticated , getSuggestedusers)
router.route('/followUnfollow/:id').post(isAuthenticated , followorUnfollow)


export default router;