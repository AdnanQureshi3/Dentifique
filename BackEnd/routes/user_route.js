import express from "express";
import { editProfile, followorUnfollow, getprofile, getSuggestedusers, login, logout, register } from "../controller/user_controller.js";
import isAuthenticated from "../middleware/isAuth.js";
import upload from "../middleware/multer.js";
import { createNotification, deleteAllReceiverNoti, getAllReciverNoti, markAllReceiverNotiasRead } from "../controller/notification_controller.js";

const router = express.Router();

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/logout').get(logout)
router.route('/:id/getprofile').get( getprofile)
router.route('/profile/edit').post(isAuthenticated ,upload.single('profilePhoto') , editProfile)
router.route('/suggested').get(isAuthenticated , getSuggestedusers)
router.route('/followUnfollow/:id').get(isAuthenticated , followorUnfollow)

router.route('/noti/:id').post(createNotification);
router.route('/noti/get').get(getAllReciverNoti);
router.route('/noti/delete').delete(deleteAllReceiverNoti)
router.route('/noti/markRead').put(markAllReceiverNotiasRead);
router.route('/noti/:id/delete').get(deleteAllReceiverNoti);


export default router;