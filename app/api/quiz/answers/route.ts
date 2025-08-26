import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { AnswerModel } from "@/models/Answer";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const newAnswer = await AnswerModel.create(body);

    return NextResponse.json(newAnswer, { status: 201 });
  } catch (error) {
    console.error("❌ Error saving answer:", error);
    return NextResponse.json(
      { message: "Failed to save answer" },
      { status: 500 }
    );
  }
}
