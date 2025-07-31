"use client";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import axios from "axios";

let socket: Socket;
type Props = {
  userId: string;          // or number, or whatever type fits
  conversationId: string;  // same here
  receiverId:string;
};

type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  text:string;
  timestamp: string;
};



export default function ChatBox({ userId, conversationId, receiverId }:Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");

  // ✅ Initialize socket & fetch messages
 useEffect(() => {
  socket = io({ path: "/api/chat/socket" });

  socket.emit("join", conversationId);

  socket.on("newMessage", (msg) => {
    if (msg.conversationId === conversationId) {
      setMessages((prev) => [...prev, msg]);
    }
  });

  fetchMessages();

  if (userId && conversationId) {
    axios.post("/api/chat/mark-seen", { userId, conversationId });
  }

  return () => {
    socket.disconnect(); // Now returns void
  };
}, [conversationId, userId]);


  // ✅ Fetch messages from API
  const fetchMessages = async () => {
    try {
      const res = await axios.get(
        `/api/chat/messages?conversationId=${conversationId}`
      );
      setMessages(res.data);
    } catch (err) {
      console.error("Failed to fetch messages", err);
    }
  };

  // ✅ Send message
  const sendMessage = async () => {
    if (!text.trim()) return;

    const msg = {
      conversationId,
      senderId: userId,
      receiverId, // 👈 Add receiverId so backend knows who gets it
      text,
      seen: false, // 👈 Mark new messages as unseen for receiver
    };

    try {
      const res = await axios.post("/api/chat/messages", msg);
      socket.emit("sendMessage", res.data); // Send to other user
      setMessages((prev) => [...prev, res.data]); // Update UI instantly
      setText("");
    } catch (err) {
      console.error("Error sending message", err);
    }
  };

  return (
    <div className="p-4 border rounded-xl max-w-md">
      <div className="h-64 overflow-y-auto border-b mb-3 flex flex-col gap-2">
        {messages.map((m, i) => {
          const isMe = m.senderId === userId;
          return (
            <div
              key={i}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-3 py-2 rounded-lg max-w-[70%] text-sm ${
                  isMe
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-200 text-gray-900 rounded-bl-none"
                }`}
              >
                <p className="font-semibold text-xs mb-1">
                  {isMe ? "You" : "Other"}
                </p>
                <p>{m.text}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-2">
        <input
          className="border p-2 flex-1 rounded"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-3 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
