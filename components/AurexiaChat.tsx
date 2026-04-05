"use client"

import { useState, useEffect, useRef } from "react"
import { sendChatMessage, getChatMessages } from "@/lib/api/chat"

type Message = {
  id: string
  role: "user" | "ai" | "agent"
  content: string
  createdAt: string
}

export default function AurexiaChat() {

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"home" | "message">("home")

  const [conversationId, setConversationId] = useState<string | null>(() => {
    if (typeof window === "undefined") return null
    return localStorage.getItem("conversationId")
  })

  const bottomRef = useRef<HTMLDivElement>(null)

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null

  // =====================
  // LOAD CHAT HISTORY
  // =====================
useEffect(() => {
  if (!conversationId) return

  const load = async () => {
    try {
      const res = await fetch(
        `http://localhost:5143/api/chat/messages/${conversationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (!res.ok) return

      const data = await res.json()

      if (Array.isArray(data)) {
        setMessages(data)
      }

    } catch (err) {
      console.error("History error:", err)
    }
  }

  void load()

}, [conversationId])

  // =====================
  // SEND MESSAGE
  // =====================
  const sendMessage = async () => {

    if (!input.trim()) return

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input,
      createdAt: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")

    const res = await fetch(
      "http://localhost:5143/api/chat/send",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          conversationId,
          message: userMessage.content
        })
      }
    )

    const data = await res.json()

    if (!conversationId) {

      setConversationId(data.conversationId)

      localStorage.setItem(
        "conversationId",
        data.conversationId
      )
    }

    setMessages(prev => [...prev, data.aiMessage])
  }

  // auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Handle tab reset when closing - FIXED ESLINT ISSUE
  const handleClose = () => {
    setOpen(false)
    setActiveTab("home")
  }

  const handleOpen = () => {
    setOpen(true)
  }

  return (
    <>
      {/* Floating Button - more subtle */}
      <button
        onClick={handleOpen}
        className="fixed bottom-6 right-6 bg-black text-white p-3 rounded-full shadow-lg z-50 hover:bg-gray-800 transition-colors"
        aria-label="Chat"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
        </svg>
      </button>

      {open && (
        <div className="fixed bottom-20 right-6 w-[300px] bg-white rounded-lg shadow-xl flex flex-col overflow-hidden z-50 border border-gray-200">
          {/* Simple Header */}
          <div className="bg-black text-white px-4 py-3 flex justify-between items-center">
            <span className="font-medium text-sm">AUREXIA Assistant</span>
            <button 
              onClick={handleClose}
              className="text-white/80 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("home")}
              className={`flex-1 py-2 text-xs font-medium transition-colors ${
                activeTab === "home"
                  ? "text-black border-b-2 border-black"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setActiveTab("message")}
              className={`flex-1 py-2 text-xs font-medium transition-colors ${
                activeTab === "message"
                  ? "text-black border-b-2 border-black"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Message
            </button>
          </div>

          {/* Content Area */}
          <div className="h-[350px] overflow-y-auto p-3">
            {activeTab === "home" ? (
              <div className="text-center mt-4 space-y-1">
                <p className="text-gray-800 text-sm">
                  Welcome to Aurexia!
                </p>
                <p className="text-gray-600 text-xs">
                  Let us know if we can help with anything.
                </p>
                <div className="mt-4 text-left border-t pt-3">
                  <p className="text-xs font-medium mb-2">Quick links:</p>
                  <ul className="space-y-1 text-xs text-gray-600">
                    <li>• New In</li>
                    <li>• Best-Sellers</li>
                    <li>• Riviera</li>
                    <li>• Cashmere</li>
                  </ul>
                </div>
              </div>
            ) : (
              /* Messages Area */
              <div className="space-y-2">
                {messages.length === 0 ? (
                  <p className="text-center text-gray-400 text-xs py-4">
                    Start a conversation...
                  </p>
                ) : (
                  messages.map(m => (
                    <div
                      key={m.id}
                      className={`max-w-[85%] p-2 rounded-lg text-xs ${
                        m.role === "user"
                          ? "ml-auto bg-black text-white"
                          : "bg-gray-100"
                      }`}
                    >
                      {m.content}
                    </div>
                  ))
                )}
                <div ref={bottomRef} />
              </div>
            )}
          </div>

          {/* Input Area - only on Message tab */}
          {activeTab === "message" && (
            <div className="p-2 border-t border-gray-200">
              <div className="flex items-center gap-1">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question..."
                  className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                />
                <button
                  onClick={sendMessage}
                  className="px-3 py-1.5 bg-black text-white text-xs rounded hover:bg-gray-800 transition-colors"
                >
                  Send
                </button>
              </div>
              <p className="text-[10px] text-gray-400 mt-1 text-center">
                AI Agent & team ready to help
              </p>
            </div>
          )}
        </div>
      )}
    </>
  )
}