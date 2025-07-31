import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  conversationId: {
     type: mongoose.Schema.Types.ObjectId, 
     ref: "Conversation" },
  senderId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" },
  text: String,
  createdAt: { 
    type: Date,
     default: Date.now },
});

const Message =  mongoose.models.Message ||mongoose.model("Message", MessageSchema);
export default Message;
