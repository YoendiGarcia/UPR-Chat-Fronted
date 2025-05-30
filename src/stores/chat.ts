import { defineStore } from 'pinia'
import { Chat } from '@/interfaces/Chats'
import { LLMQuery } from '@/interfaces/LLMQueries'

export const useChatStore = defineStore('chat', {
  state: () => ({
    chats: [] as Chat[],
  }),
  actions: {
    addChat(chat: Chat) {
      this.chats.push(chat)
    },
    removeChat(chatId: number) {
      this.chats = this.chats.filter((chat) => chatId !== chatId)
    },
    getCurrentChat(chatId: number): Chat {
      return this.chats[chatId]
    },
    saveLLMQuery(chatId: number, llmquery: LLMQuery): void {
      const chatObjective = this.chats.find(chat => chat.chatId == chatId)
      chatObjective?.llmqueries.push(llmquery)
    },
    getAllChats(): Chat[] {
      return this.chats
    },
  },
})

export const useChatIdStore = defineStore('chatId', {
 
})
