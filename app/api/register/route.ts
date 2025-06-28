import { connectDB } from "@/lib/db";
import User from "@/models/user";
import { NextResponse } from "next/server";
import bcrypt from 'bcrypt';

export async function POST(res:any) {
    try {
        
    const {firstname,middlename,lastname,email,password,confirmpassword,role} = await res.json();

    const hashedPassword = await bcrypt.hash(password,10);
      await connectDB();

    await User.create({firstname,middlename,lastname,email,password:hashedPassword,role})
    return  NextResponse.json({msg:"User Registered"})
    
    } catch (error) {
       console.log("Error occured in api/register page ", error) 
    return NextResponse.json({ msg: "Registration failed" }, { status: 500 });
 
    }
   
    
    
}