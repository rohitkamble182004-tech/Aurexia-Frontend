"use client";

import { JSX, useEffect, useState } from "react";
import { adminFetch } from "@/lib/api/client";

interface Conversation {
  conversationId: string;
  firebaseUid: string;
  lastMessage: string;
}

interface Message {
  id: string;
  role: "user" | "ai" | "agent";
  content: string;
  createdAt: string;
}

export default function AdminChatPage(): JSX.Element {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<string | null>(null);

  const [reply, setReply] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetchConversations();
  }, []);

  async function fetchConversations(): Promise<void> {
    try {
      const data = await adminFetch<Conversation[]>(
        "/api/admin/chat/conversations"
      );

      if (data) {
        setConversations(data);
      }
    } catch (err) {
      console.error("Conversation load error:", err);
      setError("Failed to load conversations");
    } finally {
      setLoading(false);
    }
  }

  async function loadMessages(conversationId: string): Promise<void> {
    try {
      const data = await adminFetch<Message[]>(
        `/api/admin/chat/messages/${conversationId}`
      );

      if (data) {
        setMessages(data);
        setSelectedConversation(conversationId);
      }
    } catch (err) {
      console.error("Message load error:", err);
    }
  }

  async function sendReply(): Promise<void> {
    if (!reply.trim() || !selectedConversation) return;

    try {
      const message = await adminFetch<Message>(
        "/api/admin/chat/reply",
        {
          method: "POST",
          body: JSON.stringify({
            conversationId: selectedConversation,
            message: reply,
          }),
        }
      );

      if (message) {
        setMessages((prev) => [...prev, message]);
      }

      setReply("");
    } catch (err) {
      console.error("Reply error:", err);
    }
  }

  if (loading) {
    return <p className="p-6">Loading conversations...</p>;
  }

  if (error) {
    return <p className="p-6 text-red-600">{error}</p>;
  }

  return (
    <div className="p-8 flex gap-6 h-[80vh]">

      {/* Conversations */}
      <div className="w-1/3 border rounded-lg p-4 overflow-y-auto">
        <h2 className="font-bold mb-4">Conversations</h2>

        {conversations.length === 0 && (
          <p className="text-gray-500">No conversations</p>
        )}

        {conversations.map((c) => (
          <ConversationItem
            key={c.conversationId}
            conversation={c}
            onClick={() => loadMessages(c.conversationId)}
          />
        ))}
      </div>

      {/* Chat Window */}
      <div className="flex-1 border rounded-lg flex flex-col">

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 && (
            <p className="text-gray-400">Select a conversation</p>
          )}

          {messages.map((m) => (
            <MessageBubble key={m.id} message={m} />
          ))}
        </div>

        {selectedConversation && (
          <div className="border-t p-4 flex gap-2">
            <input
              className="flex-1 border px-3 py-2 rounded"
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Type reply..."
            />

            <button
              onClick={() => void sendReply()}
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ConversationItem({
  conversation,
  onClick,
}: {
  conversation: Conversation;
  onClick: () => void;
}): JSX.Element {
  return (
    <div
      onClick={onClick}
      className="p-3 border rounded mb-2 cursor-pointer hover:bg-gray-300"
    >
      <p className="text-xs text-gray-700">
        User: {conversation.firebaseUid}
      </p>

      <p className="font-medium truncate">
        {conversation.lastMessage || "Conversation"}
      </p>
    </div>
  );
}

function MessageBubble({
  message,
}: {
  message: Message;
}): JSX.Element {
  const isAgent = message.role === "agent";

  return (
    <div
      className={`max-w-[70%] p-3 rounded-lg ${
        isAgent
          ? "ml-auto bg-black text-white"
          : "bg-gray-500"
      }`}
    >
      {message.content}
    </div>
  );
}