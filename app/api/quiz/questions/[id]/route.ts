import {NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { QuestionModel } from "@/models/Question";
import { Types } from "mongoose";
import { NextApiRequest, NextApiResponse } from 'next';

export async function GET(
  req: Request, context: { params: Promise<{ id: string }> }
) {
   const { id } = await context.params; // ✅ Await params
  try {
    await connectDB();

    // Validate the id if you store quiz/job IDs as ObjectId
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    // Find all questions matching quiz/job id
    const questions = await QuestionModel.find({ jobId: id,
            status:"opened",
          });


    if (!questions || questions.length === 0) {
      return NextResponse.json({ message: "No questions found" }, { status: 404 });
    }

    return NextResponse.json(questions, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching questions:", error);
    return NextResponse.json(
      { message: "Failed to fetch questions" },
      { status: 500 }
    );
  }
}


export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const body = await req.json();

    const updated = await QuestionModel.findByIdAndUpdate(params.id, body, {
      new: true,
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("❌ Error updating question:", error);
    return NextResponse.json(
      { message: "Failed to update question" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    await QuestionModel.findByIdAndDelete(params.id);
    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  } catch (error) {
    console.error("❌ Error deleting question:", error);
    return NextResponse.json(
      { message: "Failed to delete question" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const id = params.id;
  const body = await req.json();

  try {
    const updated = await QuestionModel.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ message: 'Error updating question' }, { status: 400 });
  }
}