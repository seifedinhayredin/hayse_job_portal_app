import { connectDB } from "@/lib/db";
import NextAuth, { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import User from "@/models/user";
import JobCollection from "@/models/jobSchema";
import { NextResponse } from "next/server";
import ApplicationToJob from "@/models/applicationToJob";
import Image from "@/models/image";

export async function POST(req: any) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  try {
    await connectDB();

    // Step 1: Find the employer's _id
    const employer = await User.findOne({ email }).select("_id");
    const employerId = employer?._id;

    if (!employerId) {
      return NextResponse.json({ success: false, msg: "Employer not found" });
    }

    // Step 2: Find all jobs posted by this employer
    const jobDocs = await JobCollection.find({ employerId }).select("_id");
    const jobIds = jobDocs.map((job) => job._id);

    if (jobIds.length === 0) {
        console.log("There is no aplicants found")
      return NextResponse.json({ success: true, applications: [] });
    }

    // Step 3: Find all applications for these jobs
    const applications = await ApplicationToJob.find({
      jobId: { $in: jobIds },
    })
      .populate("applicantId", "firstname lastname email applicantId")
      .populate("jobId", "jobname jobId employerName");

    // Step 4: Add applicant image from ImageCollection using email
    const applicationsWithImages = await Promise.all(
      applications.map(async (app) => {
        const applicant = app.applicantId;
        let applicantImage = null;

        if (applicant?.email) {
          const imageDoc = await Image.findOne({
            email: applicant.email,
          });
          applicantImage = imageDoc?.image_url || null;
        }

        return {
          jobname: app.jobId?.jobname || "Unknown Job",
          jobId:app.jobId,
          employerName:app.jobId?.employerName,
          

          applicant: {
            applicantId:applicant?._id,
            firstname: applicant?.firstname,
            lastname: applicant?.lastname,
            email: applicant?.email,
            image: applicantImage,
          },
        };
      })
    );
   //console.log("applicationsWithImages: ",applicationsWithImages)

    return NextResponse.json({ success: true, applications:applicationsWithImages });

  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json({ success: false, msg: "Something went wrong" });
  }
}




