import { connectDB } from "@/lib/db";
import ApplicationToJob from "@/models/applicationToJob";
import Notification from "@/models/Notification";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    const { jobId, employerId } = await req.json();

    if (!session?.user || session.user.role !== "client") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        await connectDB();

        // Get all applicants for the job
        const applicants = await ApplicationToJob.find({ jobId }).select("applicantId");
        const applicantIds = applicants.map(a => a.applicantId.toString());

        // Create notification for each applicant
        const notifications = applicantIds.map(applicantId => ({
            jobId,
            employerId,
            userId: applicantId, // recipient
            message: "An exam has been scheduled for the job you applied to.",
            read: false,
            createdAt: new Date()
        }));

        await Notification.insertMany(notifications);

        return NextResponse.json({ message: "Notifications sent to all applicants." });

    } catch (error) {
        console.error("Error sending notifications", error);
        return NextResponse.json({ message: "Error sending notifications" }, { status: 500 });
    }
}
