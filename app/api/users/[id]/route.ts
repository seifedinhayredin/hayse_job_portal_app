import { connectDB } from "@/lib/db";
import User from "@/models/user";

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  await connectDB();

  // ✅ Await params
  const { id } = await context.params;

  if (!id || id === "undefined") {
    return new Response("Invalid ID", { status: 400 });
  }

  const user = await User.findById(id).select("firstname lastname email");

  if (!user) {
    return new Response("User not found", { status: 404 });
  }

  return new Response(JSON.stringify(user), { status: 200 });
}
