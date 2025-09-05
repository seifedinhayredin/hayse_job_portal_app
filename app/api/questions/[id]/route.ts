import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { QuestionModel } from "@/models/Question";
import { Types } from "mongoose";

/*export async function GET(
 
  req: Request, context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    //const { id } = context.params;
    const { id } = await context.params; // ✅ Await params

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    const question = await QuestionModel.find({
      _id: id,
      status: "opened",
    });

    if (!question) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json(question, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching question:", error);
    return NextResponse.json(
      { message: "Failed to fetch question" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = context.params;
    const body = await req.json();

    const updated = await QuestionModel.findByIdAndUpdate(id, body, {
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
  context: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = context.params;
    await QuestionModel.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  } catch (error) {
    console.error("❌ Error deleting question:", error);
    return NextResponse.json(
      { message: "Failed to delete question" },
      { status: 500 }
    );
  }
}*/
