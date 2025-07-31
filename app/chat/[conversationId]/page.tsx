"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ChatBox from "@/component/ChatBox";
import { useEffect, useState } from "react";
import axios from "axios";
import React from "react";

export default function ChatPage({ params }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  // ✅ unwrap params correctly
  const { conversationId } = React.use(params);

  const [receiverId, setReceiverId] = useState(null);

  // ✅ Redirect if not logged in
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // ✅ Fetch conversation details
  useEffect(() => {
    if (!conversationId || !session?.user?.id) return;

    axios
      .get(`/api/conversations/${conversationId}`)
      .then((res) => {
        const conversation = res.data;
        const otherUser = conversation.participants.find(
          (id) => id !== session.user.id
        );
        setReceiverId(otherUser);
      })
      .catch((err) => console.error("Error fetching conversation", err));
  }, [conversationId, session?.user?.id]);

  if (status === "loading" || !receiverId) return <p>Loading...</p>;

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
