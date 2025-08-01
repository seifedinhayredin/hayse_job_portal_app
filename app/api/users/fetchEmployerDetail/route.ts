import { connectDB } from "@/lib/db";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(req:any) {
    const {employerId} = await req.json();
    const _id = employerId;
    console.log(`Employer Id to search employer name: ${_id}`);
    try {
        await connectDB();

        const employerDetail = await User.findOne({_id});
      const fullName =
        employerDetail?.firstname && employerDetail?.lastname
            ? `${employerDetail.firstname} ${employerDetail.lastname}`
            : "";
 const applicantId = employerDetail?._id;

        console.log(`Full name of employer: ${fullName}`)
        return NextResponse.json({fullName,applicantId})
        
    } catch (error) {
        return NextResponse.json({msg:"Error when fetching name of employer"})
    }
    
}