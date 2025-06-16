import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
     
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Who triggered the notification
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post", // Related post (if any)
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Who should receive the notification
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
