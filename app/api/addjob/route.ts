import { connectDB } from "@/lib/db";
import JobCollection from "@/models/jobSchema";
import { NextResponse } from "next/server";

export async function POST(res:any) {
    try {
        const {jobname,qualification,experiance,status, description}   = await res.json();
       
        await connectDB();
        await JobCollection.create({jobname,qualification,experiance,status, description})
        return NextResponse.json({msg:"Job is Successfully Added"});
    } catch (error) {
        console.log("Error when adding Job: ",error);
        return NextResponse.json({msg:"Error occured when adding job"});
    }
    
}