import { connectDB } from "@/lib/db";
import { QuestionModel } from "@/models/Question";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const employerId = session?.user?.id;

    if (!employerId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { jobId, status } = await req.json();

    await connectDB();

   const updated = await QuestionModel.updateMany(
      { employerId, jobId },   // filter
      { $set: { status } },    // update
      { runValidators: true }
    );


    if (!updated) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Error occurred in opening exam:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
