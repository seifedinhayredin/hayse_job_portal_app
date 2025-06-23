// app/api/searchjob/route.ts (or pages/api/searchjob.ts if using pages dir)

import { connectDB } from "@/lib/db";
import JobCollection from "@/models/jobSchema";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { keyword } = await req.json();

    const searchedJob = await JobCollection.find({
      jobname: { $regex: keyword, $options: "i" }, // partial match, case-insensitive
    });

    return NextResponse.json({ searchedJob });
  } catch (error) {
    console.error("Error searching jobs:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
