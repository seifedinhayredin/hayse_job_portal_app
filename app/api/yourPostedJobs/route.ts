import { connectDB } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import JobCollection from "@/models/jobSchema";
import { NextResponse } from "next/server";

export async function POST(req:any){
    const session = await getServerSession(authOptions);

    const employerId = session?.user?.id;
    try{

    await connectDB();
     const jobsData = await JobCollection.find({employerId});

     //console.log(`Jobs posted by you: ${jobsData}`);

     return NextResponse.json({jobsData})
    }catch(error){
        console.log("Error occured while fetching jobs posted by you");
        return NextResponse.json({msg:"Error occured while fetching jobs posted by you"})
    }
}