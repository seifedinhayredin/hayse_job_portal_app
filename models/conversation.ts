import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema({
  participants: [{ 
             type: mongoose.Schema.Types.ObjectId,
              ref: "User" 
           }],
  lastMessage: String,
  updatedAt: { 
    type: Date,
     default: Date.now 
      },
});

const Conversation =  mongoose.models.Conversation ||mongoose.model("Conversation", ConversationSchema);
export default Conversation;
