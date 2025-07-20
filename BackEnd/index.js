 import express, { urlencoded } from 'express';
 import cors from 'cors';
import connectDB from './utils/db.js';
 import dotenv from 'dotenv';
 dotenv.config({});
 import cookieParser from 'cookie-parser';
 import UserRoute from "./routes/user_route.js"
 import PostRoute from "./routes/post_route.js"
 import MessageRoute from "./routes/message_route.js"
 import aiRoute from "./routes/ai_route.js"
import {app , server} from './socket/socket.js'


const PORT = process.env.PORT || 8000;

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({extented:true}));
const corsOptions = {
    origin:'http://localhost:5173',
    credentials:true
}
app.use(cors(corsOptions));

app.get('/' , (req,res)=>{
    return res.status(200).json({
            msg: "yesh its working",
            success:true
    })
})

app.use("/api/user" , UserRoute);
app.use("/api/post" , PostRoute);
app.use("/api/chats" , MessageRoute);
app.use("/api/ai" , aiRoute);


server.listen(PORT , ()=>{
    connectDB();
    console.log("app is listening at" , PORT);
})