import { connectDB } from "@/lib/db";
import Message from "@/models/message";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get("conversationId");

    if (!conversationId) {
      return new Response(
        JSON.stringify({ error: "conversationId is required" }),
        { status: 400 }
      );
    }

    // ✅ Fetch messages sorted by creation time
    const messages = await Message.find({ conversationId }).sort({
      createdAt: 1,
    });

    return new Response(JSON.stringify(messages), { status: 200 });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const { conversationId, senderId, receiverId, text } = await req.json();

    if (!conversationId || !senderId || !receiverId || !text) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    // ✅ Create new message with all fields
    const newMessage = await Message.create({
      conversationId,
      senderId,
      receiverId,
      text,
      seen: false, // initially unseen
      createdAt: new Date(),
    });

    return new Response(JSON.stringify(newMessage), { status: 201 });
  } catch (error) {
    console.error("Error saving message:", error);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}
