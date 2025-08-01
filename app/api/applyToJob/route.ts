import { connectDB } from "@/lib/db";
import ApplicationToJob from "@/models/applicationToJob";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import User from "@/models/user";

export async function POST(req:Request) {
    const session = await getServerSession(authOptions)
    const email = session?.user?.email

    const applicantId = await User.findOne({email}).select("_id");
    const {jobId} = await req.json();
    try {
        await connectDB();
    
    await ApplicationToJob.create({jobId,applicantId});
    return NextResponse.json({msg:"You are successfully applied to Job"})
    } catch (error) {
        console.log("Error occured while applying to job",error)
        return NextResponse.json({msg:"Error occured while applying to job"});
    }
    
    
}