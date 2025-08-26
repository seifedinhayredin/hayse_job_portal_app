import { connectDB } from "@/lib/db";
import JobCollection from "@/models/jobSchema";
import { NextResponse } from "next/server";
import { getSession } from "next-auth/react";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";

export async function POST(req:any) {
    const session = await getServerSession(authOptions);

    const employerId = session?.user?.id;
    try {
        await connectDB();
        const savedJobs = await JobCollection.find({employerId});
        console.log(`All jobs Posted by ${employerId} are: ${savedJobs}`)
        return NextResponse.json({savedJobs})
        
    } catch (error) {
        console.log("Error occured while loading your saved jobs",error)
        return NextResponse.json({msg:"Error while fetching your saved jobs"})
    }
    
}