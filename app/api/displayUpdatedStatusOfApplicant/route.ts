import { connectDB } from "@/lib/db";
import ApplicationToJob from "@/models/applicationToJob";
import { NextResponse } from "next/server";

export async function POST(req:any) {
    const {applicantId,jobId} = await req.json();

    try {
        await connectDB();
        const updatedStatus = await ApplicationToJob.findOne({applicantId,jobId}).select("status");
        const status = updatedStatus.status;

        console.log(`Updated status: ${updatedStatus}, status: ${status}`);
        return NextResponse.json({status,msg:"Fetched status correctly"})
    } catch (error) {
        console.log("Error while fetching status of applicant");
        return NextResponse.json({msg:"Error while fetching status of applicant"});
    }
    
}