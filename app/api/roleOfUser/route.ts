import { connectDB } from "@/lib/db";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(req:any) {
    const {userId} = await req.json();
    console.log(`User Id for Searching Role of User: ${userId}`)

    try {
        await connectDB();
        const role = await User.findOne({userId}).select("role");

        console.log(`Role of user: ${role}`)
        return NextResponse.json({role});
    } catch (error) {
        console.log("Error while fetching role of user",error);
        return NextResponse.json({msg:"Error"})
    }
    
}