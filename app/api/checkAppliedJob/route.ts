import { connectDB } from "@/lib/db";
import ApplicationToJob from "@/models/applicationToJob";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(req:any) {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;
    console.log("Email in checking application: ",email);
    
    const currentUserId = await User.findOne({email}).select("_id");

    try {
         await connectDB();
    const {JobId} = await req.json();

   const checkApplication =  await ApplicationToJob.exists({
         jobId: JobId,
         applicantId: currentUserId,
    })
        if (checkApplication){
            console.log("You are already applied")
              return NextResponse.json({checkApplication:false})
        }
        else{
            console.log("You can apply to job")
            return NextResponse.json({checkApplication:true})
        }

      
    } catch (error) {
        console.log("Error occured while checking application of user to Job ",error)
        return NextResponse.json({"msg":"Error occured while checking your application"})
        
    }

   
    
}