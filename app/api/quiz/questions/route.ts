import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { QuestionModel } from "@/models/Question";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import JobCollection from "@/models/jobSchema";
import ApplicationToJob from "@/models/applicationToJob";
import { Types } from "mongoose"; // for ObjectId typing if needed
import Notification from "@/models/Notification";



export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "client") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const employerId = session.user.id;
    const body = await req.json();
    const { jobId, questionText, type, choices, correctAnswer } = body;

    if (!jobId || !questionText || !type) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // ✅ Check if this is the first question for this job
    const existingQuestions = await QuestionModel.find({ jobId, employerId });
    const isFirstQuestion = existingQuestions.length === 0;

    // ✅ Insert new question document
    const newQuestion = await QuestionModel.create({
      jobId,
      employerId,
      questionText,
      type,
      choices: choices || [],
      correctAnswer: correctAnswer || "",
    });

    // ✅ Send notifications only if first question for this job
    if (isFirstQuestion) {
      const applicants = await ApplicationToJob.find({ jobId }).select("applicantId");
      const applicantIds = applicants.map((a) => a.applicantId.toString());

      const notifications = applicantIds.map((applicantId) => ({
        jobId,
        employerId,
        userId: applicantId,
        message: "An exam has been scheduled for the job you applied to.",
        read: false,
        createdAt: new Date(),
      }));

      if (notifications.length > 0) {
        await Notification.insertMany(notifications);
        console.log(`📢 Notifications sent to ${notifications.length} applicants for job ${jobId}`);
      }
    }

    return NextResponse.json(newQuestion, { status: 201 });
  } catch (error) {
    console.error("❌ Error adding question:", error);
    return NextResponse.json({ message: "Failed to save question" }, { status: 500 });
  }
}



export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  const { searchParams } = new URL(req.url);
  


  const applicantId = session?.user?.id;
  console.log(`Applicant Id to take quiz: ${applicantId}`);

   if (session != null && session.user.role === "client") {
    const employerId = session?.user?.id;
    const jobId = searchParams.get("jobId");
    
     try {
    await connectDB();

    const questions = await QuestionModel.find({employerId,jobId}).sort({ createdAt: -1 });

    return NextResponse.json(questions, { status: 200 });

  } catch (error) {
    console.error("❌ Error fetching questions:", error);
    return NextResponse.json(
      { message: "Failed to fetch questions" },
      { status: 500 }
    );
  }
  }

  try {
    await connectDB();

    // ✅ Step 1: Fetch applications for this applicant with jobId and status
    const applications = await ApplicationToJob.find({ applicantId }).select(["jobId", "status"]);

    // ✅ Step 2: Filter only accepted ones
    const acceptedJobIds = applications
      .filter(app => app.status === "accepted")
      .map(app => app.jobId);

    console.log("Accepted Job IDs:", acceptedJobIds);

    // ✅ Step 3: Fetch questions for those jobs
    const questions = await QuestionModel.find({
      jobId: { $in: acceptedJobIds },
      status:"opened"
    }).sort({ createdAt: -1 });

    return NextResponse.json(questions, { status: 200 });

  } catch (error) {
    console.error("❌ Error fetching questions:", error);
    return NextResponse.json(
      { message: "Failed to fetch questions" },
      { status: 500 }
    );
  }
}

