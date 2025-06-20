import { connectDB } from "@/lib/db";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(res:any) {
    try {
        
    const {firstname,middlename,lastname,email,password,confirmpassword,role} = await res.json();
      await connectDB();

    await User.create({firstname,middlename,lastname,email,password,confirmpassword,role})
    return  NextResponse.json({msg:"User Registered"})
    
    } catch (error) {
       console.log("Error occured in api/register page ", error) 
    return NextResponse.json({ msg: "Registration failed" }, { status: 500 });
 
    }
   
    
    
}