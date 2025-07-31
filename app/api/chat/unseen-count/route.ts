import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb"; // adjust path to your MongoDB connection

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ count: 0 });
    }

    const client = await clientPromise;
    const db = client.db("your_database_name"); // change to your DB name

    const count = await db.collection("messages").countDocuments({
      receiverId: userId,
      seen: false, // only unseen messages
    });

    return NextResponse.json({ count });
  } catch (err) {
    console.error("Error fetching unseen messages:", err);
    return NextResponse.json({ count: 0 });
  }
}
