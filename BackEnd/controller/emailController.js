import nodemailer from "nodemailer";
import User from "../models/user_Model.js";

export const sendOtpForVerification = async (req , res) => {
    try{
   
      console.log("sending otp");
      console.log(req.body);
        const savedUser = await User.findOne({ email: req.body.email });
        if (!savedUser) {
            return res.status(404).json({ message: "User not found" , success:false });
        }
       
        const email = savedUser.email;
        const otp = Math.floor(100000 + Math.random() * 900000);

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        console.log("email send opt send")
        
       savedUser.otp = otp.toString();

        savedUser.otpExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes expiry
        await savedUser.save();

        // Send OTP email                       
        await transporter.sendMail({
    from: `"UpChain" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "UpChain | Email Verification",
    html:  `<div style="font-family: Arial, sans-serif; background-color:#f4f6f8; padding:30px;">
  <div style="max-width:600px; margin:0 auto; background:#fff; border-radius:10px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.1);">
    
    <div style="background:#4f46e5; padding:20px; text-align:center;">
      <h1 style="color:#fff; font-size:36px; margin:0;">UpChain</h1>
      <p style="color:#dbeafe; font-size:16px; margin:5px 0 0;">Connect, share, and stay updated instantly.</p>
    </div>
    
    <div style="padding:30px; text-align:center;">
      <h2 style="color:#111827; margin-bottom:10px;">Verify Your Email</h2>
      <p style="color:#374151; font-size:15px; margin-bottom:20px;">
        Please use the OTP code below to complete your verification for <b>UpChain</b>.
      </p>

      <div style="font-size:28px; font-weight:bold; color:#4f46e5; background:#f3f4f6; display:inline-block; padding:15px 25px; border-radius:8px; margin:20px 0;">
        ${otp}
      </div>
      <p style="font-size:14px; color:#666; margin-top:10px;">This OTP is valid for 15 minutes. Please do not share it with anyone.</p>

      <p style="color:#6b7280; font-size:13px; margin-top:20px;">
        This code will expire in 10 minutes. If you didn’t request this, you can ignore this email.
      </p>
    </div>
    
    <div style="background:#f9fafb; padding:15px; text-align:center; border-top:1px solid #e5e7eb;">
      <p style="color:#9ca3af; font-size:12px; margin:0;">&copy; ${new Date().getFullYear()} UpChain. All rights reserved.</p>
    </div>
  </div>
</div>
`
});

        res.status(200).json({ message: "OTP sent successfully" , success:true });
    }
    catch(error){
        console.error("Error sending OTP:", error);
        res.status(500).json({ message: "Internal server error" , success:false });
    }
}
export const sendOtpForResetPassword = async (req , res) => {
    try{
      
        const {email } = req.body;
        console.log("sending otp" , email);
      const savedUser = await User.findOne({email});
      console.log(savedUser , email)
      if (!savedUser) {
            return res.status(404).json({ message: "User not found" , success:false });
        }
       
        
        const otp = Math.floor(100000 + Math.random() * 900000);

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        console.log("email send opt send")
        
       savedUser.otp = otp.toString();

        savedUser.otpExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes expiry
        await savedUser.save();

                  
        await transporter.sendMail({
    from: `"UpChain" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "UpChain | Email Verification",
    html: `<div style="font-family: Arial, sans-serif; background-color:#f4f6f8; padding:30px;">
  <div style="max-width:600px; margin:0 auto; background:#fff; border-radius:10px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.1);">
    
    <div style="background:#4f46e5; padding:20px; text-align:center;">
      <h1 style="color:#fff; font-size:36px; margin:0;">UpChain</h1>
      <p style="color:#dbeafe; font-size:16px; margin:5px 0 0;">Reset your password securely.</p>
    </div>
    
    <div style="padding:30px; text-align:center;">
      <h2 style="color:#111827; margin-bottom:10px;">Password Reset Request</h2>
      <p style="color:#374151; font-size:15px; margin-bottom:20px;">
        We received a request to reset your password for <b>UpChain</b>. Use the OTP code below to reset your password.
      </p>

      <div style="font-size:28px; font-weight:bold; color:#4f46e5; background:#f3f4f6; display:inline-block; padding:15px 25px; border-radius:8px; margin:20px 0;">
        ${otp}
      </div>
      <p style="font-size:14px; color:#666; margin-top:10px;">This OTP is valid for 15 minutes. Please do not share it with anyone.</p>

      <p style="color:#6b7280; font-size:13px; margin-top:20px;">
        If you didn’t request a password reset, you can safely ignore this email. Your password will remain unchanged.
      </p>
    </div>
    
    <div style="background:#f9fafb; padding:15px; text-align:center; border-top:1px solid #e5e7eb;">
      <p style="color:#9ca3af; font-size:12px; margin:0;">&copy; ${new Date().getFullYear()} UpChain. All rights reserved.</p>
    </div>
  </div>
</div>
`
});

        res.status(200).json({ message: "OTP sent successfully" , success:true });
    }
    catch(error){
        console.error("Error sending OTP:", error);
        res.status(500).json({ message: "Internal server error" , success:false });
    }
}
// export const sendFeedback = async (req , res) => {
//   console.log("sending feedback");
//     try{
      
      
//       const {feedback } = req.body;
//        const savedUser = await User.findOne({ _id: req.id });
//       console.log(savedUser , feedback)
//       if (!savedUser) {
//             return res.status(404).json({ message: "User not found" , success:false });
//         }
       
//         const transporter = nodemailer.createTransport({
//             service: "gmail",
//             auth: {
//                 user: process.env.EMAIL_USER,
//                 pass: process.env.EMAIL_PASS,
//             },
//         });
      
// await transporter.sendMail({
//   from: `"FileMan" <${process.env.EMAIL_USER}>`,
//   to: process.env.EMAIL_USER,
//   subject: "FileMan | Feedback from Anonymous User",
//   html: `<div style="font-family: Arial, sans-serif; background-color:#f4f6f8; padding:30px;">
//   <div style="max-width:600px; margin:0 auto; background:#fff; border-radius:10px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.1);">
    
//     <div style="background:#4f46e5; padding:20px; text-align:center;">
//       <h1 style="color:#fff; font-size:32px; margin:0;">FileMan</h1>
//       <p style="color:#dbeafe; font-size:15px; margin:5px 0 0;">New Feedback Received</p>
//     </div>
    
//     <div style="padding:30px;">
//       <h2 style="color:#111827; margin-bottom:10px; text-align:center;">Feedback from an Anonymous User</h2>
//       <p style="color:#374151; font-size:15px; margin-bottom:20px; text-align:center;">
//         Someone has shared feedback about <b>FileMan</b>. Here’s what they said:
//       </p>

//       <div style="font-size:16px; line-height:1.6; color:#1f2937; background:#f9fafb; padding:20px; border-radius:8px; border:1px solid #e5e7eb; margin:20px 0;">
//         ${feedback}
//       </div>

//       <p style="color:#6b7280; font-size:13px; text-align:center; margin-top:20px;">
//         This message was submitted anonymously through the FileMan feedback system.
//       </p>
//     </div>
    
//     <div style="background:#f9fafb; padding:15px; text-align:center; border-top:1px solid #e5e7eb;">
//       <p style="color:#9ca3af; font-size:12px; margin:0;">&copy; ${new Date().getFullYear()} FileMan. All rights reserved.</p>
//     </div>
//   </div>
// </div>`
// });

//         res.status(200).json({ message: "feedback sent successfully" , success:true });
//     }
//     catch(error){
//         console.error("Error sending feedback:", error);
//         res.status(500).json({ message: "Internal server error" , success:false });
//     }
// }