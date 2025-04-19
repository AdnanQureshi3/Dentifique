import jwt from "jsonwebtoken"

const isAuthenticated = async(req,res,next)=>{
    try{
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({
                msg:"User not Authenticated",
                success:false,

            })
        }
        const decode = await jwt.verify(token , process.env.Secret_key);
        if(!decode){
            return res.status(401).json({
                msg:"Invalid request",
                success:false,
            })

        }
        req.id = decode.userId;
        next();
    }
    catch(err){
        console.log(err);
    }
}

export default isAuthenticated;
