import { connectDB } from "@/lib/db";
import ApplicationToJob from "@/models/applicationToJob";
import JobCollection from "@/models/jobSchema";
import { NextResponse } from "next/server";

export async function POST(req: any) {
  const { applicantId } = await req.json();
  //console.log(`User Id: ${applicantId}`);

  try {
    await connectDB();

    // 1️⃣ Get all applications for this applicant
    const applications = await ApplicationToJob.find({ applicantId });
    if (!applications || applications.length === 0) {
      return NextResponse.json({ jobsAppliedFor: [] });
    }

    // 2️⃣ Extract jobIds from applications
    const jobIds = applications.map((app) => app.jobId);
    //console.log("Job IDs:", jobIds);

    // 3️⃣ Get job details for these IDs
    const jobsAppliedFor = await JobCollection.find({ _id: { $in: jobIds } });

    // 4️⃣ Optionally include application status with each job
    const jobsWithStatus = jobsAppliedFor.map((job) => {
      const app = applications.find((a) => a.jobId.toString() === job._id.toString());
      return {
        ...job.toObject(),
        applicationStatus: app?.status || "Unknown",
      };
    });
//console.log(`jobsWithStatus: ${jobsWithStatus}`)
    return NextResponse.json({ jobsAppliedFor: jobsWithStatus });
  } catch (error) {
    console.error("Error fetching jobs you applied for", error);
    return NextResponse.json(
      { error: "Error occurred while fetching jobs" },
      { status: 500 }
    );
  }
}
