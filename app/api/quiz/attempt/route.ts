import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { ExamAttemptModel } from "@/models/ExamAttempt";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { userId, jobId, score } = await req.json();

    // Optional: validate userId and jobId

    // Check if already taken
    const exists = await ExamAttemptModel.findOne({ userId, jobId });
    if (exists) {
      return NextResponse.json({ message: "Exam already taken" }, { status: 400 });
    }

    const attempt = await ExamAttemptModel.create({ userId, jobId, score });

    return NextResponse.json({ message: "Exam attempt recorded", attempt });
  } catch (error) {
    console.error("Failed to record exam attempt", error);
    return NextResponse.json({ message: "Failed to record exam attempt" }, { status: 500 });
  }
}
