"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function ChatPage() {
  const { data: session } = useSession();
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchConversations = async () => {
      try {
        const res = await axios.get(
          `/api/chat/conversations?userId=${session.user.id}`
        );

        const convData = await Promise.all(
          res.data.map(async (conv) => {
            // Get the other participant ID
            const otherUserId = conv.participants.find(
              (p) => p !== session.user.id
            );

            // Fetch the other user's details
            const userRes = await axios.get(`/api/users/${otherUserId}`);

            return {
              ...conv,
              otherUserName: `${userRes.data.firstname} ${userRes.data.lastname}`,
            };
          })
        );

        setConversations(convData);
      } catch (err) {
        console.error("Error fetching conversations", err);
      }
    };

    fetchConversations();
  }, [session]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Your Conversations</h2>

      {conversations.map((conv) => (
        <Link
          key={conv._id}
          href={`/chat/${conv._id}`}
          className="block p-2 border-b hover:bg-gray-100"
        >
          💬 Chat with <b>{conv.otherUserName}</b>
        </Link>
      ))}
    </div>
  );
}
