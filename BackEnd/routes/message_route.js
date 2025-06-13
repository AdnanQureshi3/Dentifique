import express from "express";
import isAuthenticated from "../middleware/isAuth.js";
import upload from "../middleware/multer.js";
import { getMessage, sendMessage } from "../controller/message_controller.js";

const router = express.Router();
router.route('/send/:id').post(isAuthenticated , sendMessage);
router.route('/get/:id').get(isAuthenticated , getMessage);


export default router;