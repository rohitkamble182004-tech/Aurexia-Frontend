import { apiFetchJson } from "./client"

export type ChatMessage = {
  id: string
  role: "user" | "ai" | "agent"
  content: string
  createdAt: string
}

export type SendMessageResponse = {
  conversationId: string
  aiMessage: ChatMessage
}

export function getChatMessages(conversationId: string) {
  return apiFetchJson<ChatMessage[]>(
    `/api/chat/messages/${conversationId}`
  )
}

export function sendChatMessage(
  conversationId: string | null,
  message: string
) {
  return apiFetchJson<SendMessageResponse>(
    "/api/chat/send",
    {
      method: "POST",
      body: JSON.stringify({
        conversationId,
        message
      })
    }
  )
}