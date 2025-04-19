import mongoose from 'mongoose';
 import dotenv from 'dotenv';
 dotenv.config({});
const MONGO_URL = process.env.MONGO_URL;
console.log("MongoDB URL:", MONGO_URL);
const connectDB = async ()=>{
    try{
        await mongoose.connect(MONGO_URL)
        .then((e) =>{
        
            console.log("mogoDb connected!!!");
        })
    }
    catch(err){
        console.log(err);
    }
}

export default connectDB;