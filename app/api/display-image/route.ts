import { connectDB } from "@/lib/db";
import Image from "@/models/image";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(req:Request) {
    const session =  await getServerSession(authOptions);
    const email = session?.user?.email;

    try {
        await connectDB();

       const fetchedImage =  await Image.findOne({email}).select("image_url");

       return NextResponse.json({fetchedImage:fetchedImage});
        
    } catch (error) {
        console.log("Error occured while fetching Image");
        return NextResponse.json({msg:"Error occured while fetching data from DB"});
    }
    
    
}