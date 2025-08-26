import { connectDB } from "@/lib/db";
import Notification from "@/models/Notification";
import ApplicationToJob from "@/models/applicationToJob";
import { ExamAttemptModel } from "@/models/ExamAttempt";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const employeeId = session.user.id;

  try {
    await connectDB();

    // Find all jobs the employee has applied for with status
    const jobsApplied = await ApplicationToJob.find({ applicantId: employeeId }).select(["jobId", "status"]);

    // Filter only accepted jobs
    const acceptedJobIds = jobsApplied
      .filter(app => app.status === "accepted")
      .map(app => app.jobId);

    // Find jobs where employee already attempted the exam
    const attempts = await ExamAttemptModel.find({ userId: employeeId, jobId: { $in: acceptedJobIds } }).select("jobId");
    const attemptedJobIds = attempts.map((attempt: any) => attempt.jobId.toString());

    // Filter notifications for jobs where exam is NOT yet attempted
    const notifications = await Notification.find({
      jobId: { $in: acceptedJobIds.filter((id) => !attemptedJobIds.includes(id.toString())) },
    })
      .populate("jobId", "jobname employerName")
      .populate("employerId", "name");

    return NextResponse.json({ notifications });
  } catch (error) {
    console.error("Error fetching notifications", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
