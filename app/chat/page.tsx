"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

type Conversation = {
  _id: string;
  participants: string[];
  otherUserName?: string;
};

export default function ChatPage() {
  const { data: session } = useSession();
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchConversations = async () => {
      try {
        const res = await axios.get<Conversation[]>(
          `/api/chat/conversations?userId=${session.user.id}`
        );

        const convData: Conversation[] = await Promise.all(
          res.data.map(async (conv) => {
            const otherUserId = conv.participants.find(
              (p) => p !== session.user.id
            );

            if (!otherUserId) return conv;

            const userRes = await axios.get(`/api/users/${otherUserId}`);
            const otherUserName = `${userRes.data.firstname} ${userRes.data.lastname}`;

            return { ...conv, otherUserName };
          })
        );

        setConversations(convData);
      } catch (err) {
        console.error("Error fetching conversations", err);
      }
    };

    fetchConversations();
  }, [session?.user?.id]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Your Conversations</h2>

      {conversations.length === 0 ? (
        <p className="text-gray-500">No conversations found.</p>
      ) : (
        conversations.map((conv) => (
          <Link
            key={conv._id}
            href={`/chat/${conv._id}`}
            className="block p-2 border-b hover:bg-gray-100"
          >
            💬 Chat with <b>{conv.otherUserName ?? "Unknown User"}</b>
          </Link>
        ))
      )}
    </div>
  );
}
