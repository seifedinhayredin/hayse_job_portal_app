import { connectDB } from "@/lib/db";
import ApplicationToJob from "@/models/applicationToJob";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import User from "@/models/user";
import mongoose from "mongoose";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!session || !email) {
    return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
  }

  const { jobId } = await req.json();
  await connectDB();

  try {
    const applicant = await User.findOne({ email }).select("_id");
    if (!applicant) {
      return NextResponse.json({ msg: "User not found" }, { status: 404 });
    }

    const applicantId = applicant._id;

    // ✅ Convert jobId to ObjectId before querying
    const application = await ApplicationToJob.findOne({
      applicantId,
      jobId: new mongoose.Types.ObjectId(jobId)
    }).select("status");

    //console.log("Matched Application:", application);

    const statusofApplicant = application ? application.status : null;

    return NextResponse.json({ statusofApplicant });
  } catch (error) {
    console.error("Error fetching status:", error);
    return NextResponse.json({ msg: "Error" }, { status: 500 });
  }
}
