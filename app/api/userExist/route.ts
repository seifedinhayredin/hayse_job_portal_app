import { connectDB } from "@/lib/db";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectDB();
  const { email } = await req.json();

  const existingUser = await User.findOne({ email }).select("_id");

  return NextResponse.json({ exists: !!existingUser });
}
