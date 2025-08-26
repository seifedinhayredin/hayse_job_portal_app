import mongoose, { Schema, Document, Types } from "mongoose";

export interface IExamAttempt extends Document {
  userId: Types.ObjectId;
  jobId: Types.ObjectId;
  takenAt: Date;
  score?: number;
}

const ExamAttemptSchema = new Schema<IExamAttempt>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
  takenAt: { type: Date, default: Date.now },
  score: Number,
});

export const ExamAttemptModel =
  mongoose.models.ExamAttempt || mongoose.model<IExamAttempt>("ExamAttempt", ExamAttemptSchema);
