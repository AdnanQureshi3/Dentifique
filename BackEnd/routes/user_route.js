import express from "express";
import { editProfile, followorUnfollow, getprofile,
    searchUser, getSuggestedusers, login, logout, resetPassword , isEmailExist, register, removePhoto,  verifyOtp , getConversationUsers } from "../controller/user_controller.js";
import isAuthenticated from "../middleware/isAuth.js";
import upload from "../middleware/multer.js";

import { createNotification, deleteAllReceiverNoti, getAllReciverNoti, markAllReceiverNotiasRead } from "../controller/notification_controller.js";
import { sendOtpForResetPassword , sendOtpForVerification } from "../controller/emailController.js";
const router = express.Router();

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/logout').get(logout)
router.route('/:id/getprofile').get( getprofile)
router.route('/profile/edit').post(isAuthenticated ,upload.single('profilePhoto') , editProfile)
router.route('/suggested').get(isAuthenticated , getSuggestedusers)
router.route('/followUnfollow/:id').get(isAuthenticated , followorUnfollow)
router.route('/profile/removephoto').get( isAuthenticated , removePhoto);

router.route('/conversationUsers').get(isAuthenticated , getConversationUsers);

router.route('/verifyOTP').post( verifyOtp);
router.route('/resendotpVerification').post( sendOtpForVerification);
router.route('/resendotpReset').post(  sendOtpForResetPassword);
router.route('/isEmailExist').post( isEmailExist);
router.route('/resetpassword').post( resetPassword);

router.route('/noti/:id').post( createNotification);
router.route('/noti/get').get( isAuthenticated, getAllReciverNoti);
router.route('/noti/delete').delete(isAuthenticated ,deleteAllReceiverNoti)
router.route('/noti/markRead').put( isAuthenticated,markAllReceiverNotiasRead);
router.route('/noti/delete').get(isAuthenticated , deleteAllReceiverNoti);

router.get('/searchuser', searchUser);


export default router;