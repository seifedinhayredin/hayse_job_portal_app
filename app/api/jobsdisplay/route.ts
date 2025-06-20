import { connectDB } from "@/lib/db";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import JobCollection from "@/models/jobSchema";

export async function GET(res:any) {
    try {
        await connectDB();
        const savedJobs = await JobCollection.find({})
        console.log("Saved Jobs: ",savedJobs)

      return NextResponse.json({savedJobs:savedJobs});
    } catch (error) {
    console.error("Error occurred while fetching data:", error);
    return NextResponse.json({ savedJobs: [], msg: "Error" }, { status: 500 });
  }

    
}