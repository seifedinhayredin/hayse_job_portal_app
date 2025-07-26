import { connectDB } from "@/lib/db";
import ApplicationToJob from "@/models/applicationToJob";
import { NextResponse } from "next/server";

export  async function PATCH(req:any) {
    const {applicantId,jobId,status} = await req.json();
    console.log(`Applicant ID: ${applicantId}, Job Id: ${jobId}`)

    try {
        await connectDB();
       const updatedData =  await ApplicationToJob.findOneAndUpdate(  { jobId, applicantId },

            {status},
            {new:true}
        )

        if(!updatedData){
            return NextResponse.json({success:false, msg:"Application is not found"});
        }
        console.log(`Updated to ${status} successfully!`)
        return NextResponse.json({success:true,statusAfterUpdate:status,jobId, applicantId, msg:"Application is successfully updated!"})

    } catch (error) {
        console.log("Error occured while updating status of application ",error)
        return NextResponse.json({success:false, msg:"Error occured while updating status of application"})
        
    }
    
}