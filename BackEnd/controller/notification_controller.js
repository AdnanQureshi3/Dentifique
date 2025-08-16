import Notification from "../models/notification_Model.js";

export const createNotification = async (req, res) => {
    try {
        const { type, user, postId } = req.body;
        const receiverId = req.params.id;

        const noti = await Notification.create({
            type,
            user: user._id,
            post:postId,
            receiver: receiverId

        });

        res.status(201).json({ msg: "Notification created", success: true });

    }
    catch (err) {
        console.log(err);

    }
}
export const deleteNotification = async (req, res) => {
    console.log('here deleting');
    try {
        const { user, postId } = req.body;
        const receiverId = req.params.id;
        await Notification.deleteOne({receiver:receiverId , post:postId , user:user._id})

        res.status(200).json({ msg: "Notification deleted", success: true });

    }
    catch (err) {
        console.log(err);

    }
}
export const getAllReciverNoti = async (req, res) => {
    try {

        const receiverId = req.id;
        const notis = await Notification.find({ receiver: receiverId }).sort({ createdAt: -1 }).populate('user', 'username profilePicture');

        res.status(200).json({ msg: "Notification fecthed", notis, success: true });

    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Server error", success: false });

    }
}
export const deleteAllReceiverNoti = async (req, res) => {
    try {
        
        const receiverId = req.id;
        console.log(req.id);
        await Notification.deleteMany({ receiver: receiverId });
      

        res.status(200).json({ msg: "All notifications deleted", success: true });
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Server error", success: false });
    }
};
export const markAllReceiverNotiasRead = async (req, res) => {
    try {
        const receiverId = req.id;
        await Notification.updateMany(
            { receiver: receiverId },             // filter
            { $set: { read: true } }              // update
        );

        res.status(200).json({ msg: "All notifications marked as Read", success: true });
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Server error", success: false });
    }

}