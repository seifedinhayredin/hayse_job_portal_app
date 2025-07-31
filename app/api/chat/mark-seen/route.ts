import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const { userId, conversationId } = await req.json();

    if (!userId || !conversationId) {
      return NextResponse.json({ success: false });
    }

    const client = await clientPromise;
    const db = client.db("your_database_name");

    await db.collection("messages").updateMany(
      {
        conversationId,
        receiverId: userId,
        seen: false,
      },
      { $set: { seen: true } }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error marking messages as seen:", err);
    return NextResponse.json({ success: false });
  }
}
