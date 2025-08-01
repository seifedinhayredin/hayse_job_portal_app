"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ChatBox from "@/component/ChatBox";
import { useEffect, useState } from "react";
import axios from "axios";
import React from "react";

interface ChatPageProps {
  params: Promise<{ conversationId: string }>; // 👈 params is now a Promise
}

export default function ChatPage({ params }: ChatPageProps) {
  // ✅ unwrap params
  const unwrappedParams = React.use(params);
  const { conversationId } = unwrappedParams;

  const { data: session, status } = useSession();
  const router = useRouter();
  const [receiverId, setReceiverId] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (!conversationId || !session?.user?.id) return;

    axios
      .get(`/api/conversations/${conversationId}`)
      .then((res) => {
        const conversation = res.data;
        const otherUser = conversation.participants.find(
          (id: string) => id !== session.user.id
        );
        setReceiverId(otherUser || null);
      })
      .catch((err) => console.error("Error fetching conversation", err));
  }, [conversationId, session?.user?.id]);

  if (status === "loading" || !receiverId || !session?.user?.id) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex justify-center p-8">
      <ChatBox
        userId={session.user.id}
        conversationId={conversationId}
        receiverId={receiverId}
      />
    </div>
  );
}
