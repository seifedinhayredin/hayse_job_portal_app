import { connectDB } from "@/lib/db";
import JobCollection from "@/models/jobSchema";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import User from "@/models/user";
export async function POST(res:any) {
    const session = await getServerSession(authOptions)
    const email = session?.user?.email;

    console.log("Session Email:", email);

    try {
        const employer = await User.findOne({email}).select("_id")
        const employerId = employer?._id;


        const {employerName,jobname,qualification,experiance,status, address,description,deadline}   = await res.json();
       
        await connectDB();
        await JobCollection.create({employerName,jobname,qualification,experiance,status,address, description,deadline,employerId})
        return NextResponse.json({msg:"Job is Successfully Added"});
    } catch (error) {
        console.log("Error when adding Job: ",error);
        return NextResponse.json({msg:"Error occured when adding job"});
    }
    
}