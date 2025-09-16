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
 import ProjectRoutes from "./routes/project_routes.js"
import {app , server} from './socket/socket.js'
import path from 'path';

const __dirname = path.resolve();
console.log(__dirname);


const PORT = process.env.PORT || 8000;

//middleware
app.set('trust proxy', 1);
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({extented:true}));

const corsOptions = {
    origin: ['http://localhost:5173', process.env.URL || 'https://upchain-tvvm.onrender.com'],
    credentials: true
}

app.use(cors(corsOptions));

app.get('/login', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'Frontend', 'dist', 'index.html'));
});


app.use("/api/user" , UserRoute);
app.use("/api/post" , PostRoute);
app.use("/api/chats" , MessageRoute);
app.use("/api/ai" , aiRoute);
app.use("/api/projects" ,ProjectRoutes );

app.use(express.static(path.join(__dirname, '/Frontend/dist')));

app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.resolve(__dirname, 'Frontend', 'dist', 'index.html'));
});

server.listen(PORT , ()=>{
    connectDB();
    console.log("app is listening at" , PORT);
})