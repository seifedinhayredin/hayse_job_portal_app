import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/user";

export async function GET(req: Request) {
  await connectDB();

  // ✅ Extract query params
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ id: user._id.toString() }, { status: 200 });
}
