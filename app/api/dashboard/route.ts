import { connectDB } from "@/lib/db";
import JobCollection from "@/models/jobSchema";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(req:Request) {
    await connectDB();

    const allUsers = await User.countDocuments();
    const allJobs = await JobCollection.countDocuments();

    return NextResponse.json({allUsers:allUsers,allJobs:allJobs});
    
}