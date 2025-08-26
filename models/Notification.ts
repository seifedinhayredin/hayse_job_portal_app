import mongoose, { Schema, models } from "mongoose";

const notificationSchema = new Schema({
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "jobCollection", required: true },
    employerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // recipient
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

export default models.Notification || mongoose.model("Notification", notificationSchema);
