import { connectDB } from "@/lib/db";
import Conversation from "@/models/conversation";

export async function GET(req: Request) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return new Response(JSON.stringify({ error: "userId required" }), { status: 400 });
  }

  const conversations = await Conversation.find({
    participants: userId,
  });

  return new Response(JSON.stringify(conversations), { status: 200 });
}

export async function POST(req: Request) {
  await connectDB();
  const { user1, user2 } = await req.json();

  if (!user1 || !user2) {
    return new Response(JSON.stringify({ error: "user1 and user2 required" }), { status: 400 });
  }

  let conversation = await Conversation.findOne({
    participants: { $all: [user1, user2] },
  });

  if (!conversation) {
    conversation = await Conversation.create({ participants: [user1, user2] });
  }

  return new Response(JSON.stringify(conversation), { status: 200 });
}
