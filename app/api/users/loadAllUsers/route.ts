import { connectDB } from "@/lib/db";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(req:any) {
    try {
        await connectDB();

        const allUsers =  await User.find({});
        console.log(`All Registered Users: ${allUsers} `)
        return NextResponse.json({allUsers});
    } catch (error) {
        console.log("Error while loading all registered users");
        return NextResponse.json({msg:"Error while loading all registered users"});
    }
    
}