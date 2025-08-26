import mongoose from "mongoose";

const ChoiceSchema = new mongoose.Schema({
  letter: { type: String, required: true },
  text: { type: String, required: true },
});

const QuestionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  type: { type: String, enum: ["choice", "text"], required: true },
  choices: { type: [ChoiceSchema], default: [] },
  correctAnswer: { type: String, required: false, default: "" }, // optional with default
  employerId:{type:String,default:""},
  jobId:{type:String, required:true},
  status:{type:String, default:"closed"},
}, { timestamps: true });

export const QuestionModel =
  mongoose.models.Question || mongoose.model("Question", QuestionSchema);
