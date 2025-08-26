import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { QuestionModel } from "@/models/Question";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const employerId = session?.user?.id;

  console.log(`Employer Id who add Quize is ${employerId}`)
  try {
    await connectDB();
    const body = await req.json();

    // Optional: validate here or rely on Mongoose validation
    const newQuestion = await QuestionModel.create({body,employerId});

    return NextResponse.json(newQuestion, { status: 201 });
  } catch (error) {
    console.error("❌ Error adding question:", error);
    return NextResponse.json(
      { message: "Failed to add question" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const questions = await QuestionModel.find().sort({ createdAt: -1 });
    return NextResponse.json(questions, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching questions:", error);
    return NextResponse.json(
      { message: "Failed to fetch questions" },
      { status: 500 }
    );
  }
}
