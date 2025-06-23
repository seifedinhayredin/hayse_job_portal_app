import { connectDB } from "@/lib/db";
import JobCollection from "@/models/jobSchema";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
  try {
    await connectDB();
    let filteredJob;
    const { experiance } = await req.json();
    if(experiance == ""){
       filteredJob = await JobCollection.find({})
    }
    else{
    filteredJob = await JobCollection.find({experiance});
    }
    

    return NextResponse.json({ filteredJob });
  } catch (error) {
    console.error("Error searching jobs:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
