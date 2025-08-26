import mongoose, { Schema, Document } from "mongoose";

interface IAnswer extends Document {
  questionId: string;
  userAnswer: string;
  createdAt: Date;
}

const AnswerSchema = new Schema<IAnswer>({
  questionId: { type: String, required: true },
  userAnswer: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const AnswerModel =
  mongoose.models.Answer || mongoose.model<IAnswer>("Answer", AnswerSchema);
